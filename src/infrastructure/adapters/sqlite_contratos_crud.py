import sqlite3
import json
import os
from typing import List, Optional
import dataclasses
from src.domain.models import SecopContrato
from src.application.ports.crud_port import SecopContratoPort

class SQLiteSecopContratoAdapter(SecopContratoPort):
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH_CONTRATOS"]
        
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def create_table(self) -> None:
        fields = dataclasses.fields(SecopContrato)
        
        columns = []
        for f in fields:
            if f.name == 'id_contrato':
                columns.append(f"{f.name} TEXT PRIMARY KEY")
            else:
                columns.append(f"{f.name} TEXT")
                
        create_table_q = f"""CREATE TABLE IF NOT EXISTS secopii_contratos(
            {", ".join(columns)}
        );"""
        create_index_q = "CREATE INDEX IF NOT EXISTS idx_contratos_nit ON secopii_contratos(nit_entidad);"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_q)
            cursor.execute(create_index_q)
            conn.commit()

    def _extract_tuple(self, record: SecopContrato) -> tuple:
        return tuple(getattr(record, f.name) for f in dataclasses.fields(record))

    def insert(self, record: SecopContrato) -> None:
        fields = dataclasses.fields(record)
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_contratos VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_q, self._extract_tuple(record))
            conn.commit()

    def insert_many(self, records: List[SecopContrato]) -> None:
        if not records:
            return
        fields = dataclasses.fields(records[0])
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_contratos VALUES ({placeholders})"
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_q, [self._extract_tuple(r) for r in records])
            conn.commit()

    def update(self, key: str, record: SecopContrato) -> bool:
        fields = dataclasses.fields(record)
        update_cols = [f.name for f in fields if f.name != 'id_contrato']
        set_clause = ", ".join([f"{col}=?" for col in update_cols])
        update_q = f"UPDATE secopii_contratos SET {set_clause} WHERE id_contrato=?"
        
        update_vals = tuple(getattr(record, col) for col in update_cols) + (key,)
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(update_q, update_vals)
            conn.commit()
            return cursor.rowcount > 0

    def delete(self, key: str) -> bool:
        delete_q = "DELETE FROM secopii_contratos WHERE id_contrato=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_q, (key,))
            conn.commit()
            return cursor.rowcount > 0

    def count_all(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM secopii_contratos")
            return cursor.fetchone()[0]

    def count_by_nit(self, nit_entidad: str) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM secopii_contratos WHERE nit_entidad=?", (nit_entidad,))
            return cursor.fetchone()[0]

    def get_by_nit(self, nit_entidad: str) -> List[SecopContrato]:
        query = "SELECT * FROM secopii_contratos WHERE nit_entidad=?"
        results = []
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (nit_entidad,))
            rows = cursor.fetchall()
            fields = [f.name for f in dataclasses.fields(SecopContrato)]
            for row in rows:
                data = dict(zip(fields, row))
                results.append(SecopContrato(**data))
        return results
