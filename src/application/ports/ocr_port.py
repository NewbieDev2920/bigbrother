from abc import ABC, abstractmethod

class OcrPort(ABC):
    @abstractmethod
    def extract_text(self, file_path: str, poppler_path: str) -> str:
        """
        Lee el archivo PDF en file_path y extrae el texto usando OCR.
        """
        pass
