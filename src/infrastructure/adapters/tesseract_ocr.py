from pdf2image import convert_from_path
import pytesseract
from src.application.ports.ocr_port import OcrPort

class TesseractOcrAdapter(OcrPort):
    def extract_text(self, file_path: str, poppler_path: str) -> str:
        """
        Implementation using pdf2image and pytesseract.
        """
        images = convert_from_path(file_path, poppler_path=poppler_path)
        plain_text = ""
        for img in images:
            text = pytesseract.image_to_string(img)
            plain_text += text + "\n"
        return plain_text
