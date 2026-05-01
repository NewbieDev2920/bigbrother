from dataclasses import dataclass
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

@dataclass
class ChatRequest:
    message: str
    file_path: Optional[str] = None

class Tributary(BaseModel):
    name : str = Field(description="Nombre de empresa, persona natural, juridica. Nombre del tributario.")
    nit : str = Field(description = "Numero de identificación tributaria (NIT) en formato XXX.XXX.XXX-Y")

class ChatResponse(BaseModel):
    chat_msg :str =  Field(description = "El mensaje de texto que analiza el documento y responde la necesidad del usuario.")
    trichotomous_output : str = Field(description = "Output tricotómico con formato estricto. Estados posibles del documento: APTO/NOAPTO/NA. NA En caso de no tener suficiente información.")
    tributary_list : List[Tributary]
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class SecopUser:
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    nit: Optional[str] = None
    es_entidad: Optional[bool] = None
    es_grupo: Optional[bool] = None
    esta_activa: Optional[bool] = None
    fecha_creacion: Optional[str] = None
    codigo_categoria_principal: Optional[str] = None
    descripcion_categoria_principal: Optional[str] = None
    telefono: Optional[str] = None
    fax: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None
    pais: Optional[str] = None
    departamento: Optional[str] = None
    municipio: Optional[str] = None
    sitio_web: Optional[str] = None
    tipo_empresa: Optional[str] = None
    nombre_representante_legal: Optional[str] = None
    tipo_doc_representante_legal: Optional[str] = None
    numero_doc_representante_legal: Optional[str] = None
    telefono_representante_legal: Optional[str] = None
    correo_representante_legal: Optional[str] = None
    es_pyme: Optional[bool] = None
    ubicacion: Optional[str] = None
