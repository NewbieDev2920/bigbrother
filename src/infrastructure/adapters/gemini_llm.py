import json
from google import genai
from src.application.ports.llm_port import LlmPort
from src.domain.models import ChatResponse

class GeminiLlmAdapter(LlmPort):
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Usamos la sintaxis del SDK moderno google-genai
        self.client = genai.Client(api_key=self.api_key)
        
    def generate_content(self, system_prompt: str, user_content: str) -> str:
        """
        Sends the prompt to Gemini and parses the response.
        Returns the raw markdown text suitable for the frontend.
        """
        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview", 
                config={
                    "system_instruction": system_prompt,
                    "response_mime_type" : "application/json",
                    "response_json_schema" : ChatResponse.model_json_schema()
                },
                contents=user_content
            )
            # Retornamos el texto crudo en Markdown como espera la UI
            print(response.text)
            return response.text
        except Exception as e:
            raise RuntimeError(f"Error calling Gemini: {str(e)}")
