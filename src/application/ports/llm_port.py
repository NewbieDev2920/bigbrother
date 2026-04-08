from abc import ABC, abstractmethod

class LlmPort(ABC):
    @abstractmethod
    def generate_content(self, system_prompt: str, user_content: str) -> str:
        """
        Envía el prompt al LLM y retorna su respuesta.
        """
        pass
