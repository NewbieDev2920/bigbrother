import os
from flask import Flask, render_template, request, jsonify
from google import genai
import json
from dotenv import load_dotenv
from pdf2image import convert_from_path
import pytesseract

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

config = None

try:
    with open('config.json','r', encoding='utf-8') as f:
        config = json.load(f)
except Exception as e:
    print(e)

client = genai.Client(api_key=GEMINI_API_KEY)

app = Flask(__name__)

TARGET_PDF_PATH = config["TARGET_PDF_PATH"]
POPPLER_PATH = config["POPPLER_PATH"]

def extract_text_from_pdf(pdf_path):
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
    plain_text = ""
    for i, img in enumerate(images):
        text = pytesseract.image_to_string(img)
        plain_text += text + "\n"
    return plain_text

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.form.get("message", "")
    uploaded_file = request.files.get("file")
    
    if not user_message and not uploaded_file:
        return jsonify({"error": "No message or file provided"}), 400
        
    plain_text = ""
    if uploaded_file and uploaded_file.filename != '':
        uploaded_file.save(TARGET_PDF_PATH)
        
      
        try:
            plain_text = extract_text_from_pdf(TARGET_PDF_PATH)
        except Exception as e:
            return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 500


    if plain_text:
        final_content = f"{user_message}\nPLAIN_TEXT({plain_text})"
    else:
        final_content = user_message

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            config={"system_instruction": config["SYSTEM_PROMPT"]},
            contents=final_content
        )
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
