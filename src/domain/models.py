from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class ChatRequest:
    message: str
    file_path: Optional[str] = None

@dataclass
class ChatResponse:
    text: str
    metadata: Optional[Dict[str, Any]] = None
