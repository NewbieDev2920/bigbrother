import sqlite3
import json
import os
import dataclasses
from typing import List, Optional
from src.domain.models import SecopProceso
from src.application.ports.crud_port import SecopProcesoPort

# Mapping from dataclass field names to the original CSV column headers.
# Keys = snake_case field names, Values = CSV header names (latin1-decoded, then cleaned)
_CSV_COLUMN_ORDER = [
    "entidad",
    "nit_entidad",
    "departamento_entidad",
    "ciudad_entidad",
    "ordenentidad",
    "entidad_centralizada",
    "id_del_proceso",
    "referencia_del_proceso",
    "pci",
    "id_del_portafolio",
    "nombre_del_procedimiento",
    "descripcin_del_procedimiento",
    "fase",
    "fecha_de_publicacion_del_proceso",
    "fecha_de_ultima_publicacin",
    "fecha_de_publicacion_fase_planeacion_precalificacion",
    "fecha_de_publicacion_fase_seleccion_precalificacion",
    "fecha_de_publicacion_manifestacion_de_interes",
    "fecha_de_publicacion_fase_borrador",
    "fecha_de_publicacion_fase_seleccion",
    "precio_base",
    "modalidad_de_contratacion",
    "justificacin_modalidad_de_contratacin",
    "duracion",
    "unidad_de_duracion",
    "fecha_de_recepcion_de_respuestas",
    "fecha_de_apertura_de_respuesta",
    "fecha_de_apertura_efectiva",
    "ciudad_de_la_unidad_de_contratacin",
    "nombre_de_la_unidad_de_contratacin",
    "proveedores_invitados",
    "proveedores_con_invitacion_directa",
    "visualizaciones_del_procedimiento",
    "proveedores_que_manifestaron_interes",
    "respuestas_al_procedimiento",
    "respuestas_externas",
    "conteo_de_respuestas_a_ofertas",
    "proveedores_unicos_con_respuestas",
    "numero_de_lotes",
    "estado_del_procedimiento",
    "id_estado_del_procedimiento",
    "adjudicado",
    "id_adjudicacion",
    "codigoproveedor",
    "departamento_proveedor",
    "ciudad_proveedor",
    "fecha_adjudicacion",
    "valor_total_adjudicacion",
    "nombre_del_adjudicador",
    "nombre_del_proveedor_adjudicado",
    "nit_del_proveedor_adjudicado",
    "codigo_principal_de_categoria",
    "estado_de_apertura_del_proceso",
    "tipo_de_contrato",
    "subtipo_de_contrato",
    "categorias_adicionales",
    "urlproceso",
    "codigo_entidad",
    "estado_resumen",
]

NUM_COLS = len(_CSV_COLUMN_ORDER)


class SQLiteSecopProcesoAdapter(SecopProcesoPort):
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)

        self.db_path = config["DB_PATH_PROCESOS"]

        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def create_table(self) -> None:
        fields = dataclasses.fields(SecopProceso)

        columns = []
        for f in fields:
            if f.name == "id_del_proceso":
                columns.append(f"{f.name} TEXT PRIMARY KEY")
            else:
                columns.append(f"{f.name} TEXT")

        create_table_q = f"""CREATE TABLE IF NOT EXISTS secopii_procesos (
            {", ".join(columns)}
        );"""

        # Two indexes: nit_entidad (to look up contracts belonging to an entity)
        #              nit_del_proveedor_adjudicado (the most important one – the contractor's NIT)
        idx_nit_entidad_q = (
            "CREATE INDEX IF NOT EXISTS idx_procesos_nit_entidad "
            "ON secopii_procesos(nit_entidad);"
        )
        idx_nit_proveedor_q = (
            "CREATE INDEX IF NOT EXISTS idx_procesos_nit_proveedor "
            "ON secopii_procesos(nit_del_proveedor_adjudicado);"
        )

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_q)
            cursor.execute(idx_nit_entidad_q)
            cursor.execute(idx_nit_proveedor_q)
            conn.commit()

    def _extract_tuple(self, record: SecopProceso) -> tuple:
        return tuple(getattr(record, f.name) for f in dataclasses.fields(record))

    def insert(self, record: SecopProceso) -> None:
        fields = dataclasses.fields(record)
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_procesos VALUES ({placeholders})"

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(insert_q, self._extract_tuple(record))
            conn.commit()

    def insert_many(self, records: List[SecopProceso]) -> None:
        if not records:
            return
        fields = dataclasses.fields(records[0])
        placeholders = ", ".join(["?" for _ in fields])
        insert_q = f"INSERT OR REPLACE INTO secopii_procesos VALUES ({placeholders})"

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_q, [self._extract_tuple(r) for r in records])
            conn.commit()

    def update(self, key: str, record: SecopProceso) -> bool:
        fields = dataclasses.fields(record)
        update_cols = [f.name for f in fields if f.name != "id_del_proceso"]
        set_clause = ", ".join([f"{col}=?" for col in update_cols])
        update_q = f"UPDATE secopii_procesos SET {set_clause} WHERE id_del_proceso=?"

        update_vals = tuple(getattr(record, col) for col in update_cols) + (key,)

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(update_q, update_vals)
            conn.commit()
            return cursor.rowcount > 0

    def delete(self, key: str) -> bool:
        delete_q = "DELETE FROM secopii_procesos WHERE id_del_proceso=?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_q, (key,))
            conn.commit()
            return cursor.rowcount > 0

    def count_all(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM secopii_procesos")
            return cursor.fetchone()[0]

    def count_by_nit_entidad(self, nit_entidad: str) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT COUNT(*) FROM secopii_procesos WHERE nit_entidad=?",
                (nit_entidad,),
            )
            return cursor.fetchone()[0]

    def get_by_nit_entidad(self, nit_entidad: str) -> List[SecopProceso]:
        query = "SELECT * FROM secopii_procesos WHERE nit_entidad=?"
        return self._fetch_records(query, (nit_entidad,))

    def count_by_nit_proveedor(self, nit_proveedor: str) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT COUNT(*) FROM secopii_procesos WHERE nit_del_proveedor_adjudicado=?",
                (nit_proveedor,),
            )
            return cursor.fetchone()[0]

    def get_by_nit_proveedor(self, nit_proveedor: str) -> List[SecopProceso]:
        query = "SELECT * FROM secopii_procesos WHERE nit_del_proveedor_adjudicado=?"
        return self._fetch_records(query, (nit_proveedor,))

    def _fetch_records(self, query: str, params: tuple) -> List[SecopProceso]:
        results = []
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            field_names = [f.name for f in dataclasses.fields(SecopProceso)]
            for row in rows:
                data = dict(zip(field_names, row))
                results.append(SecopProceso(**data))
        return results
