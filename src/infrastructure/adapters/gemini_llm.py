import json
from google import genai
from src.application.ports.llm_port import LlmPort
from src.domain.models import ChatResponse

class GeminiLlmAdapter(LlmPort):
    def __init__(self, api_key: str, model_name: str = "gemini-2.0-flash", debug_mode: bool = False):
        self.api_key = api_key
        self.model_name = model_name
        self.debug_mode = debug_mode
        # Usamos la sintaxis del SDK moderno google-genai
        self.client = genai.Client(api_key=self.api_key)
        
    def generate_content(self, system_prompt: str, user_content: str, history: list = None) -> str:
        """
        Sends the prompt to Gemini and parses the response.
        Supports multi-turn chat if history is provided.
        """
        contents = []
        if history:
            # history should be a list of {'role': 'user'|'model', 'text': '...'}
            for h in history:
                contents.append({
                    "role": h["role"],
                    "parts": [{"text": h["text"]}]
                })
        
        contents.append({
            "role": "user",
            "parts": [{"text": user_content}]
        })

        try:
            response = self.client.models.generate_content(
                model=self.model_name, 
                config={
                    "system_instruction": system_prompt,
                    "response_mime_type": "application/json",
                    "response_json_schema": ChatResponse.model_json_schema()
                },
                contents=contents
            )
            if self.debug_mode:
                print(f"\n--- GEMINI API RESPONSE ---\n{response.text}\n---------------------------\n")
            return response.text
        except Exception as e:
            raise RuntimeError(f"Error calling Gemini: {str(e)}")
