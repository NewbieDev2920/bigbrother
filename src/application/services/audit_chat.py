from src.domain.models import ChatRequest, ChatResponse
from src.application.ports.ocr_port import OcrPort
from src.application.ports.llm_port import LlmPort
import json
import os

class AuditChatService:
    def __init__(self, ocr_port: OcrPort, llm_port: LlmPort, system_prompt: str, poppler_path: str):
        self.ocr_port = ocr_port
        self.llm_port = llm_port
        self.system_prompt = system_prompt
        self.poppler_path = poppler_path
        self.histories = {} # Dict[session_id, List[dict]]

    def process_chat(self, request: ChatRequest) -> ChatResponse:
        plain_text = ""
        session_id = request.session_id or "default"
        
        # 1. OCR if file exists (Only on first message of session usually, but here we check)
        if request.file_path:
            try:
                plain_text = self.ocr_port.extract_text(request.file_path, self.poppler_path)
            except Exception as e:
                raise ValueError(f"Failed to parse PDF: {str(e)}")

        # 2. Prepare content
        if plain_text:
            # First message with document
            user_content = f"CONTEXTO DEL DOCUMENTO:\n{plain_text}\n\nSOLICITUD DEL USUARIO: {request.message}"
            # Reset history for new document if same session
            self.histories[session_id] = []
        else:
            # Follow-up message
            user_content = request.message

        # 3. Call LLM with history
        history = self.histories.get(session_id, [])
        try:
            response_text = self.llm_port.generate_content(
                system_prompt=self.system_prompt, 
                user_content=user_content,
                history=history
            )
            
            # 4. Parse and update history
            response_data = json.loads(response_text)
            
            # Ensure project_id is present
            if not response_data.get("project_id"):
                response_data["project_id"] = "ultimo-analisis"

            # We only store the 'chat_msg' part in history to avoid bloating with structured data
            # unless we want Gemini to remember the full JSON (usually not needed for conversational flow)
            history.append({"role": "user", "text": user_content})
            history.append({"role": "model", "text": response_data.get("chat_msg", "")})
            self.histories[session_id] = history
            
            return ChatResponse(**response_data)
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise RuntimeError(str(e))
