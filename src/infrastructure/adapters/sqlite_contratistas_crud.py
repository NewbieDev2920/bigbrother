import sqlite3
import json
import os
from typing import List, Optional
import dataclasses
from src.domain.models import SecopUser
from src.application.ports.crud_port import SecopContratistaPort

class SQLiteSecopContratistaAdapter(SecopContratistaPort):
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH_CONTRATISTAS"]
        
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
        create_index_q = "CREATE INDEX IF NOT EXISTS idx_users_nit ON secopii_users(nit);"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_q)
            cursor.execute(create_index_q)
            conn.commit()

    def _extract_tuple(self, record: SecopUser) -> tuple:
        return tuple(getattr(record, f.name) for f in dataclasses.fields(record))

    def insert(self, record: SecopUser) -> None:
        fields = dataclasses.fields(record)
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_users VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_q, self._extract_tuple(record))
            conn.commit()

    def insert_many(self, records: List[SecopUser]) -> None:
        if not records:
            return
        fields = dataclasses.fields(records[0])
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_users VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_q, [self._extract_tuple(r) for r in records])
            conn.commit()

    def update(self, key: str, record: SecopUser) -> bool:
        fields = dataclasses.fields(record)
        # Exclude 'codigo' from SET clause, we use it in WHERE
        update_cols = [f.name for f in fields if f.name != 'codigo']
        set_clause = ", ".join([f"{col}=?" for col in update_cols])
        update_q = f"UPDATE secopii_users SET {set_clause} WHERE codigo=?"
        
        update_vals = tuple(getattr(record, col) for col in update_cols) + (key,)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(update_q, update_vals)
            conn.commit()
            return cursor.rowcount > 0

    def delete(self, key: str) -> bool:
        delete_q = "DELETE FROM secopii_users WHERE codigo=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_q, (key,))
            conn.commit()
            return cursor.rowcount > 0

    def get_by_nit(self, nit: str) -> Optional[SecopUser]:
        query = "SELECT * FROM secopii_users WHERE nit=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (nit,))
            row = cursor.fetchone()
            if row:
                fields = [f.name for f in dataclasses.fields(SecopUser)]
                data = dict(zip(fields, row))
                return SecopUser(**data)
            return None
