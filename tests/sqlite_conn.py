import sqlite3

connection = sqlite3.connect("secopii_data.db")

cursor = connection.cursor()

#CRUD SQL QUERIES.

create_table_q = """CREATE TABLE IF NOT EXISTS secopii_users(
    codigo VARCHAR(12),
    nombre VARCHAR(200),
    nit VARCHAR(20),
    es_entidad BOOLEAN,
    es_grupo BOOLEAN,
    esta_activa BOOLEAN,
    fecha_creacion VARCHAR(12),
    codigo_categoria_principal VARCHAR(10),
    descripcion_categoria_principal VARCHAR(150),
    telefono VARCHAR(20),
    fax VARCHAR(20),
    correo VARCHAR(150),
    direccion VARCHAR(200),
    pais VARCHAR(50),
    departamento VARCHAR(50),
    municipio VARCHAR(50),
    sitio_web VARCHAR(150),
    tipo_empresa VARCHAR(50),
    nombre_representante_legal VARCHAR(150),
    tipo_doc_representante_legal VARCHAR(20),
    numero_doc_representante_legal VARCHAR(20),
    telefono_representante_legal VARCHAR(20),
    correo_representante_legal VARCHAR(150),
    es_pyme BOOLEAN,
    ubicacion VARCHAR(100)
);"""
