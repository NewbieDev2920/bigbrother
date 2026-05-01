import os
from flask import Flask, render_template, request, jsonify
from src.domain.models import ChatRequest

def create_app(audit_chat_service, target_pdf_path: str):
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    template_dir = os.path.abspath(os.path.join(current_dir, '..', 'ui', 'templates'))
    
    app = Flask(__name__, template_folder=template_dir)
    
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/chat", methods=["POST"])
    def chat():
        user_message = request.form.get("message", "")
        uploaded_file = request.files.get("file")
        
        if not user_message and not uploaded_file:
            return jsonify({"error": "No message or file provided"}), 400
            
        file_path = None
        if uploaded_file and uploaded_file.filename != '':
            uploaded_file.save(target_pdf_path)
            file_path = target_pdf_path

        chat_request = ChatRequest(message=user_message, file_path=file_path)

        try:
            response = audit_chat_service.process_chat(chat_request)
            # Response.text might be JSON string due to our adapter
            return jsonify({"response": response.chat_msg})
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except RuntimeError as re:
            return jsonify({"error": str(re)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app
