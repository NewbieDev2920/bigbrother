from src.domain.models import ChatRequest, ChatResponse
from src.application.ports.ocr_port import OcrPort
from src.application.ports.llm_port import LlmPort

class AuditChatService:
    def __init__(self, ocr_port: OcrPort, llm_port: LlmPort, system_prompt: str, poppler_path: str):
        self.ocr_port = ocr_port
        self.llm_port = llm_port
        self.system_prompt = system_prompt
        self.poppler_path = poppler_path

    def process_chat(self, request: ChatRequest) -> ChatResponse:
        plain_text = ""
        
        # 1. OCR if file exists
        if request.file_path:
            try:
                plain_text = self.ocr_port.extract_text(request.file_path, self.poppler_path)
            except Exception as e:
                raise ValueError(f"Failed to parse PDF: {str(e)}")

        # 2. Concat
        if plain_text:
            final_content = f"{request.message}\nPLAIN_TEXT({plain_text})"
        else:
            final_content = request.message

        # 3. Call LLM
        try:
            response_text = self.llm_port.generate_content(
                system_prompt=self.system_prompt, 
                user_content=final_content
            )
            return ChatResponse(text=response_text)
        except Exception as e:
            raise RuntimeError(str(e))
