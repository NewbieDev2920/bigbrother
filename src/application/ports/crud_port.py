from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.models import SecopUser

class SecopUserCursor(ABC):
    
    @abstractmethod
    def create_table(self) -> None:
        """Crea la tabla en la base de datos."""
        pass
        
    @abstractmethod
    def insert_user(self, user: SecopUser) -> None:
        """Inserta un único usuario en la base de datos."""
        pass
        
    @abstractmethod
    def insert_users(self, users: List[SecopUser]) -> None:
        """Inserta múltiples usuarios en la base de datos."""
        pass
        
    @abstractmethod
    def update_user(self, codigo: str, user: SecopUser) -> bool:
        """Actualiza un usuario en la base de datos por su código."""
        pass
        
    @abstractmethod
    def delete_user(self, codigo: str) -> bool:
        """Elimina un usuario de la base de datos por su código."""
        pass
