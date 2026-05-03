from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.models import SecopUser, SecopContrato, SecopSancion, SecopInvias, SecopProceso

class SecopContratistaPort(ABC):
    @abstractmethod
    def create_table(self) -> None:
        pass
        
    @abstractmethod
    def insert(self, record: SecopUser) -> None:
        pass
        
    @abstractmethod
    def insert_many(self, records: List[SecopUser]) -> None:
        pass
        
    @abstractmethod
    def update(self, key: str, record: SecopUser) -> bool:
        pass
        
    @abstractmethod
    def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    def get_by_nit(self, nit: str) -> Optional[SecopUser]:
        pass

class SecopContratoPort(ABC):
    @abstractmethod
    def create_table(self) -> None:
        pass
        
    @abstractmethod
    def insert(self, record: SecopContrato) -> None:
        pass
        
    @abstractmethod
    def insert_many(self, records: List[SecopContrato]) -> None:
        pass
        
    @abstractmethod
    def update(self, key: str, record: SecopContrato) -> bool:
        pass
        
    @abstractmethod
    def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    def count_all(self) -> int:
        pass
        
    @abstractmethod
    def count_by_nit(self, nit_entidad: str) -> int:
        pass
        
    @abstractmethod
    def get_by_nit(self, nit_entidad: str) -> List[SecopContrato]:
        pass

class SecopSancionPort(ABC):
    @abstractmethod
    def create_table(self) -> None:
        pass
        
    @abstractmethod
    def insert(self, record: SecopSancion) -> None:
        pass
        
    @abstractmethod
    def insert_many(self, records: List[SecopSancion]) -> None:
        pass
        
    @abstractmethod
    def update(self, key: str, record: SecopSancion) -> bool:
        pass
        
    @abstractmethod
    def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    def get_sanciones_by_nit(self, nit_entidad: str) -> List[SecopSancion]:
        pass

class SecopInviasPort(ABC):
    @abstractmethod
    def create_table(self) -> None:
        pass
        
    @abstractmethod
    def insert(self, record: SecopInvias) -> None:
        pass
        
    @abstractmethod
    def insert_many(self, records: List[SecopInvias]) -> None:
        pass
        
    @abstractmethod
    def update(self, key: str, record: SecopInvias) -> bool:
        pass
        
    @abstractmethod
    def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    def count_all(self) -> int:
        pass
        
    @abstractmethod
    def count_by_nit(self, nit_entidad: str) -> int:
        pass
        
    @abstractmethod
    def get_by_nit(self, nit_entidad: str) -> List[SecopInvias]:
        pass

class SecopProcesoPort(ABC):
    @abstractmethod
    def create_table(self) -> None:
        pass

    @abstractmethod
    def insert(self, record: SecopProceso) -> None:
        pass

    @abstractmethod
    def insert_many(self, records: List[SecopProceso]) -> None:
        pass

    @abstractmethod
    def update(self, key: str, record: SecopProceso) -> bool:
        pass

    @abstractmethod
    def delete(self, key: str) -> bool:
        pass

    @abstractmethod
    def count_all(self) -> int:
        pass

    @abstractmethod
    def count_by_nit_entidad(self, nit_entidad: str) -> int:
        pass

    @abstractmethod
    def get_by_nit_entidad(self, nit_entidad: str) -> List[SecopProceso]:
        pass

    @abstractmethod
    def count_by_nit_proveedor(self, nit_proveedor: str) -> int:
        pass

    @abstractmethod
    def get_by_nit_proveedor(self, nit_proveedor: str) -> List[SecopProceso]:
        pass
