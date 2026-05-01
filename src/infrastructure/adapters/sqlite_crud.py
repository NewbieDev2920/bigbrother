import sqlite3
import json
import os
from typing import List
from src.domain.models import SecopUser
from src.application.ports.crud_port import SecopUserCursor

class SQLiteSecopUserCursor(SecopUserCursor):
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH"]
        
        # Create directory if it does not exist
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def create_table(self) -> None:
        create_table_q = """CREATE TABLE IF NOT EXISTS secopii_users(
            codigo VARCHAR(12) PRIMARY KEY,
            nombre VARCHAR(200),
            nit VARCHAR(20) UNIQUE,
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
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_q)
            conn.commit()

    def _extract_user_tuple(self, user: SecopUser) -> tuple:
        return (
            user.codigo, user.nombre, user.nit, user.es_entidad, user.es_grupo, 
            user.esta_activa, user.fecha_creacion, user.codigo_categoria_principal, 
            user.descripcion_categoria_principal, user.telefono, user.fax, user.correo, 
            user.direccion, user.pais, user.departamento, user.municipio, user.sitio_web, 
            user.tipo_empresa, user.nombre_representante_legal, user.tipo_doc_representante_legal, 
            user.numero_doc_representante_legal, user.telefono_representante_legal, 
            user.correo_representante_legal, user.es_pyme, user.ubicacion
        )

    def insert_user(self, user: SecopUser) -> None:
        insert_q = """INSERT OR REPLACE INTO secopii_users VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_q, self._extract_user_tuple(user))
            conn.commit()

    def insert_users(self, users: List[SecopUser]) -> None:
        insert_q = """INSERT OR REPLACE INTO secopii_users VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_q, [self._extract_user_tuple(u) for u in users])
            conn.commit()

    def update_user(self, codigo: str, user: SecopUser) -> bool:
        update_q = """UPDATE secopii_users SET 
            nombre=?, nit=?, es_entidad=?, es_grupo=?, esta_activa=?, fecha_creacion=?, 
            codigo_categoria_principal=?, descripcion_categoria_principal=?, telefono=?, 
            fax=?, correo=?, direccion=?, pais=?, departamento=?, municipio=?, sitio_web=?, 
            tipo_empresa=?, nombre_representante_legal=?, tipo_doc_representante_legal=?, 
            numero_doc_representante_legal=?, telefono_representante_legal=?, 
            correo_representante_legal=?, es_pyme=?, ubicacion=?
            WHERE codigo=?"""
            
        tup = self._extract_user_tuple(user)
        # Exclude codigo which is the first element, and append it at the end for WHERE condition
        update_tuple = tup[1:] + (codigo,)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(update_q, update_tuple)
            conn.commit()
            return cursor.rowcount > 0

    def delete_user(self, codigo: str) -> bool:
        delete_q = "DELETE FROM secopii_users WHERE codigo=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_q, (codigo,))
            conn.commit()
            return cursor.rowcount > 0
