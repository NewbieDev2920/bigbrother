from pdf2image import convert_from_path
import pytesseract

PATH = r"C:\Users\cande\Documents\code\llm_auditor\src\target.pdf"

images = convert_from_path(PATH ,poppler_path = r"C:\Program Files\poppler\Library\bin")

plain_text = ""

for i, img in enumerate(images):
    text =  pytesseract.image_to_string(img)
    plain_text += text + "\n"

print(plain_text)