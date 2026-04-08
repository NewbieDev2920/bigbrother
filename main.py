import os
import json
from dotenv import load_dotenv

from src.infrastructure.adapters.gemini_llm import GeminiLlmAdapter
from src.infrastructure.adapters.tesseract_ocr import TesseractOcrAdapter
from src.application.services.audit_chat import AuditChatService
from src.infrastructure.web.server import create_app

def bootstrap():
    load_dotenv()
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    with open('config.json','r', encoding='utf-8') as f:
        config = json.load(f)

    TARGET_PDF_PATH = config["TARGET_PDF_PATH"]
    POPPLER_PATH = config["POPPLER_PATH"]
    SYSTEM_PROMPT = config["SYSTEM_PROMPT"]

    # Initialize Outbound Adapters
    llm_adapter = GeminiLlmAdapter(api_key=GEMINI_API_KEY)
    ocr_adapter = TesseractOcrAdapter()

    # Initialize the core service (Application)
    audit_chat_service = AuditChatService(
        ocr_port=ocr_adapter,
        llm_port=llm_adapter,
        system_prompt=SYSTEM_PROMPT,
        poppler_path=POPPLER_PATH
    )

    # Initialize the Web framework (Inbound Adapter)
    app = create_app(audit_chat_service, TARGET_PDF_PATH)
    
    return app

if __name__ == "__main__":
    app = bootstrap()
    app.run(host="0.0.0.0", port=3000, debug=True)
