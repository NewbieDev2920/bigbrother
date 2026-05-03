from dataclasses import dataclass
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

@dataclass
class ChatRequest:
    message: str
    file_path: Optional[str] = None
    session_id: Optional[str] = None

class Tributary(BaseModel):
    name: str = Field(description="Nombre de empresa, persona natural, juridica. Nombre del tributario.")
    nit: str = Field(description="Numero de identificación tributaria (NIT) en formato XXX.XXX.XXX-Y")

class ChatResponse(BaseModel):
    chat_msg: str = Field(description="El mensaje de texto que analiza el documento y responde la necesidad del usuario.")
    trichotomous_output: str = Field(description="Output tricotómico con formato estricto. Estados posibles del documento: APTO/NOAPTO/NA. NA En caso de no tener suficiente información.")
    tributary_list: List[Tributary] = Field(description="Lista de NITs encontrados en el documento.")
    costo: str = Field(description="Costo total del proyecto o contrato extraído. Formato moneda o N/A.")
    lista_entidades: List[str] = Field(description="Nombres de entidades gubernamentales involucradas.")
    periodo: str = Field(description="Periodo de ejecución o fecha del documento.")
    lista_contratistas: List[str] = Field(description="Nombres de contratistas o proveedores mencionados.")
    modalidad: str = Field(description="Modalidad de selección o N/A.")
    ubicacion: str = Field(description="Ubicación geográfica del proyecto o N/A.")
    riesgo_corrupcion: float = Field(description="Riesgo de corrupción estimado (0.0 a 1.0) basado exclusivamente en el texto del documento.")
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

@dataclass
class SecopContrato:
    nombre_entidad: Optional[str] = None
    nit_entidad: Optional[str] = None
    departamento: Optional[str] = None
    ciudad: Optional[str] = None
    localizacion: Optional[str] = None
    orden: Optional[str] = None
    sector: Optional[str] = None
    rama: Optional[str] = None
    entidad_centralizada: Optional[str] = None
    proceso_de_compra: Optional[str] = None
    id_contrato: Optional[str] = None
    referencia_del_contrato: Optional[str] = None
    estado_contrato: Optional[str] = None
    codigo_de_categoria_principal: Optional[str] = None
    descripcion_del_proceso: Optional[str] = None
    tipo_de_contrato: Optional[str] = None
    modalidad_de_contratacion: Optional[str] = None
    justificacion_modalidad_de_contratacion: Optional[str] = None
    fecha_de_firma: Optional[str] = None
    fecha_de_inicio_del_contrato: Optional[str] = None
    fecha_de_fin_del_contrato: Optional[str] = None
    condiciones_de_entrega: Optional[str] = None
    tipodocproveedor: Optional[str] = None
    documento_proveedor: Optional[str] = None
    proveedor_adjudicado: Optional[str] = None
    es_grupo: Optional[str] = None
    es_pyme: Optional[str] = None
    habilita_pago_adelantado: Optional[str] = None
    liquidacion: Optional[str] = None
    obligacion_ambiental: Optional[str] = None
    obligaciones_postconsumo: Optional[str] = None
    reversion: Optional[str] = None
    origen_de_los_recursos: Optional[str] = None
    destino_gasto: Optional[str] = None
    valor_del_contrato: Optional[str] = None
    valor_de_pago_adelantado: Optional[str] = None
    valor_facturado: Optional[str] = None
    valor_pendiente_de_pago: Optional[str] = None
    valor_pagado: Optional[str] = None
    valor_amortizado: Optional[str] = None
    valor_pendiente_de_amortizacion: Optional[str] = None
    valor_pendiente_de_ejecucion: Optional[str] = None
    saldo_cdp: Optional[str] = None
    saldo_vigencia: Optional[str] = None
    espostconflicto: Optional[str] = None
    dias_adicionados: Optional[str] = None
    puntos_del_acuerdo: Optional[str] = None
    pilares_del_acuerdo: Optional[str] = None
    urlproceso: Optional[str] = None
    nombre_representante_legal: Optional[str] = None
    nacionalidad_representante_legal: Optional[str] = None
    domicilio_representante_legal: Optional[str] = None
    tipo_de_identificacion_representante_legal: Optional[str] = None
    identificacion_representante_legal: Optional[str] = None
    genero_representante_legal: Optional[str] = None
    presupuesto_general_de_la_nacion_pgn: Optional[str] = None
    sistema_general_de_participaciones: Optional[str] = None
    sistema_general_de_regalias: Optional[str] = None
    recursos_propios_alcaldias_gobernaciones_resguardos: Optional[str] = None
    recursos_de_credito: Optional[str] = None
    recursos_propios: Optional[str] = None
    ultima_actualizacion: Optional[str] = None
    codigo_entidad: Optional[str] = None
    codigo_proveedor: Optional[str] = None
    fecha_inicio_liquidacion: Optional[str] = None
    fecha_fin_liquidacion: Optional[str] = None
    objeto_del_contrato: Optional[str] = None
    duracion_del_contrato: Optional[str] = None
    nombre_del_banco: Optional[str] = None
    tipo_de_cuenta: Optional[str] = None
    numero_de_cuenta: Optional[str] = None
    el_contrato_puede_ser_prorrogado: Optional[str] = None
    fecha_de_notificacion_de_prorrogacion: Optional[str] = None
    nombre_ordenador_del_gasto: Optional[str] = None
    tipo_de_documento_ordenador_del_gasto: Optional[str] = None
    numero_de_documento_ordenador_del_gasto: Optional[str] = None
    nombre_supervisor: Optional[str] = None
    tipo_de_documento_supervisor: Optional[str] = None
    numero_de_documento_supervisor: Optional[str] = None
    nombre_ordenador_de_pago: Optional[str] = None
    tipo_de_documento_ordenador_de_pago: Optional[str] = None
    numero_de_documento_ordenador_de_pago: Optional[str] = None
    documentos_tipo: Optional[str] = None
    descripcion_documentos_tipo: Optional[str] = None

@dataclass
class SecopSancion:
    nombre_entidad: Optional[str] = None
    nit_entidad: Optional[str] = None
    nivel: Optional[str] = None
    orden: Optional[str] = None
    municipio: Optional[str] = None
    numero_de_resolucion: Optional[str] = None
    documento_contratista: Optional[str] = None
    nombre_contratista: Optional[str] = None
    numero_de_contrato: Optional[str] = None
    valor_sancion: Optional[str] = None
    fecha_de_publicacion: Optional[str] = None
    fecha_de_firmeza: Optional[str] = None
    fecha_de_cargue: Optional[str] = None
    ruta_de_proceso: Optional[str] = None

@dataclass
class SecopInvias:
    nombre_entidad: Optional[str] = None
    nit_entidad: Optional[str] = None
    departamento: Optional[str] = None
    ciudad: Optional[str] = None
    localizacion: Optional[str] = None
    orden: Optional[str] = None
    sector: Optional[str] = None
    rama: Optional[str] = None
    entidad_centralizada: Optional[str] = None
    proceso_de_compra: Optional[str] = None
    id_contrato: Optional[str] = None
    referencia_del_contrato: Optional[str] = None
    estado_contrato: Optional[str] = None
    codigo_de_categoria_principal: Optional[str] = None
    descripcion_del_proceso: Optional[str] = None
    tipo_de_contrato: Optional[str] = None
    modalidad_de_contratacion: Optional[str] = None
    justificacion_modalidad_de_contratacion: Optional[str] = None
    fecha_de_firma: Optional[str] = None
    fecha_de_inicio_del_contrato: Optional[str] = None
    fecha_de_fin_del_contrato: Optional[str] = None
    condiciones_de_entrega: Optional[str] = None
    tipodocproveedor: Optional[str] = None
    documento_proveedor: Optional[str] = None
    proveedor_adjudicado: Optional[str] = None
    es_grupo: Optional[str] = None
    es_pyme: Optional[str] = None
    habilita_pago_adelantado: Optional[str] = None
    liquidacion: Optional[str] = None
    obligacion_ambiental: Optional[str] = None
    obligaciones_postconsumo: Optional[str] = None
    reversion: Optional[str] = None
    valor_del_contrato: Optional[str] = None
    valor_de_pago_adelantado: Optional[str] = None
    valor_facturado: Optional[str] = None
    valor_pendiente_de_pago: Optional[str] = None
    valor_pagado: Optional[str] = None
    valor_amortizado: Optional[str] = None
    valor_pendiente_de_amortizacion: Optional[str] = None
    valor_pendiente_de_ejecucion: Optional[str] = None
    saldo_cdp: Optional[str] = None
    saldo_vigencia: Optional[str] = None
    espostconflicto: Optional[str] = None
    urlproceso: Optional[str] = None
    destino_gasto: Optional[str] = None
    origen_de_los_recursos: Optional[str] = None
    dias_adicionados: Optional[str] = None
    puntos_del_acuerdo: Optional[str] = None
    pilares_del_acuerdo: Optional[str] = None
    nombre_representante_legal: Optional[str] = None
    nacionalidad_representante_legal: Optional[str] = None
    tipo_de_identificacion_representante_legal: Optional[str] = None
    identificacion_representante_legal: Optional[str] = None
    genero_representante_legal: Optional[str] = None
    presupuesto_general_de_la_nacion_pgn: Optional[str] = None
    sistema_general_de_participaciones: Optional[str] = None
    sistema_general_de_regalias: Optional[str] = None
    recursos_propios_alcaldias_gobernaciones_resguardos: Optional[str] = None
    recursos_de_credito: Optional[str] = None
    recursos_propios: Optional[str] = None
    ultima_actualizacion: Optional[str] = None
    codigo_entidad: Optional[str] = None
    fecha_inicio_liquidacion: Optional[str] = None
    codigo_proveedor: Optional[str] = None
    objeto_del_contrato: Optional[str] = None
    fecha_fin_liquidacion: Optional[str] = None

@dataclass
class SecopProceso:
    entidad: Optional[str] = None
    nit_entidad: Optional[str] = None
    departamento_entidad: Optional[str] = None
    ciudad_entidad: Optional[str] = None
    ordenentidad: Optional[str] = None
    entidad_centralizada: Optional[str] = None
    id_del_proceso: Optional[str] = None
    referencia_del_proceso: Optional[str] = None
    pci: Optional[str] = None
    id_del_portafolio: Optional[str] = None
    nombre_del_procedimiento: Optional[str] = None
    descripcin_del_procedimiento: Optional[str] = None
    fase: Optional[str] = None
    fecha_de_publicacion_del_proceso: Optional[str] = None
    fecha_de_ultima_publicacin: Optional[str] = None
    fecha_de_publicacion_fase_planeacion_precalificacion: Optional[str] = None
    fecha_de_publicacion_fase_seleccion_precalificacion: Optional[str] = None
    fecha_de_publicacion_manifestacion_de_interes: Optional[str] = None
    fecha_de_publicacion_fase_borrador: Optional[str] = None
    fecha_de_publicacion_fase_seleccion: Optional[str] = None
    precio_base: Optional[str] = None
    modalidad_de_contratacion: Optional[str] = None
    justificacin_modalidad_de_contratacin: Optional[str] = None
    duracion: Optional[str] = None
    unidad_de_duracion: Optional[str] = None
    fecha_de_recepcion_de_respuestas: Optional[str] = None
    fecha_de_apertura_de_respuesta: Optional[str] = None
    fecha_de_apertura_efectiva: Optional[str] = None
    ciudad_de_la_unidad_de_contratacin: Optional[str] = None
    nombre_de_la_unidad_de_contratacin: Optional[str] = None
    proveedores_invitados: Optional[str] = None
    proveedores_con_invitacion_directa: Optional[str] = None
    visualizaciones_del_procedimiento: Optional[str] = None
    proveedores_que_manifestaron_interes: Optional[str] = None
    respuestas_al_procedimiento: Optional[str] = None
    respuestas_externas: Optional[str] = None
    conteo_de_respuestas_a_ofertas: Optional[str] = None
    proveedores_unicos_con_respuestas: Optional[str] = None
    numero_de_lotes: Optional[str] = None
    estado_del_procedimiento: Optional[str] = None
    id_estado_del_procedimiento: Optional[str] = None
    adjudicado: Optional[str] = None
    id_adjudicacion: Optional[str] = None
    codigoproveedor: Optional[str] = None
    departamento_proveedor: Optional[str] = None
    ciudad_proveedor: Optional[str] = None
    fecha_adjudicacion: Optional[str] = None
    valor_total_adjudicacion: Optional[str] = None
    nombre_del_adjudicador: Optional[str] = None
    nombre_del_proveedor_adjudicado: Optional[str] = None
    nit_del_proveedor_adjudicado: Optional[str] = None
    codigo_principal_de_categoria: Optional[str] = None
    estado_de_apertura_del_proceso: Optional[str] = None
    tipo_de_contrato: Optional[str] = None
    subtipo_de_contrato: Optional[str] = None
    categorias_adicionales: Optional[str] = None
    urlproceso: Optional[str] = None
    codigo_entidad: Optional[str] = None
    estado_resumen: Optional[str] = None
