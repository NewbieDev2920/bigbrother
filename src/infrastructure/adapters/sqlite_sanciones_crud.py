import sqlite3
import json
import os
from typing import List, Optional
import dataclasses
from src.domain.models import SecopSancion
from src.application.ports.crud_port import SecopSancionPort

class SQLiteSecopSancionAdapter(SecopSancionPort):
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH_SANCIONES"]
        
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def create_table(self) -> None:
        fields = dataclasses.fields(SecopSancion)
        columns = [f"{f.name} TEXT" for f in fields]
        
        create_table_q = f"""CREATE TABLE IF NOT EXISTS secopii_sanciones(
            {", ".join(columns)}
        );"""
        create_index_q = "CREATE INDEX IF NOT EXISTS idx_sanciones_nit ON secopii_sanciones(nit_entidad);"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_q)
            cursor.execute(create_index_q)
            conn.commit()

    def _extract_tuple(self, record: SecopSancion) -> tuple:
        return tuple(getattr(record, f.name) for f in dataclasses.fields(record))

    def insert(self, record: SecopSancion) -> None:
        fields = dataclasses.fields(record)
        placeholders = ", ".join(["?" for _ in fields])
        # Usamos INSERT simple ya que no hay PK garantizada.
        insert_q = f"INSERT INTO secopii_sanciones VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_q, self._extract_tuple(record))
            conn.commit()

    def insert_many(self, records: List[SecopSancion]) -> None:
        if not records:
            return
        fields = dataclasses.fields(records[0])
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT INTO secopii_sanciones VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_q, [self._extract_tuple(r) for r in records])
            conn.commit()

    def update(self, key: str, record: SecopSancion) -> bool:
        # numero_de_contrato is key
        fields = dataclasses.fields(record)
        update_cols = [f.name for f in fields if f.name != 'numero_de_contrato']
        set_clause = ", ".join([f"{col}=?" for col in update_cols])
        update_q = f"UPDATE secopii_sanciones SET {set_clause} WHERE numero_de_contrato=?"
        
        update_vals = tuple(getattr(record, col) for col in update_cols) + (key,)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(update_q, update_vals)
            conn.commit()
            return cursor.rowcount > 0

    def delete(self, key: str) -> bool:
        delete_q = "DELETE FROM secopii_sanciones WHERE numero_de_contrato=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_q, (key,))
            conn.commit()
            return cursor.rowcount > 0

    def get_sanciones_by_nit(self, nit_entidad: str) -> List[SecopSancion]:
        print("[WARNING] El dataset utilizado para buscar sanciones pertenece a SECOP I, no a SECOP II.")
        query = "SELECT * FROM secopii_sanciones WHERE nit_entidad=?"
        results = []
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (nit_entidad,))
            rows = cursor.fetchall()
            
            fields = [f.name for f in dataclasses.fields(SecopSancion)]
            for row in rows:
                data = dict(zip(fields, row))
                # Add warning attribute dynamically to the model instance if possible, or just keep the print
                results.append(SecopSancion(**data))
                
        return results
