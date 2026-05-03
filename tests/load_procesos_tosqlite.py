"""
load_procesos_tosqlite.py
--------------------------
Carga tests/secopii_procesos_contratos2.csv a la base de datos SQLite
en storage/secopii_procesos_contratacion.db de forma eficiente y en lotes,
sin saturar la RAM ni producir errores de disk I/O.

Diseñado para datasets de 8+ GB / ~8.4 millones de filas.

Uso:
    python tests/load_procesos_tosqlite.py
    python tests/load_procesos_tosqlite.py tests/otro_archivo.csv --config config.json --chunk 5000
"""

import os
import sys
import csv
import json
import time
import gc
import sqlite3

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ---------------------------------------------------------------------------
# Constantes
# ---------------------------------------------------------------------------

NUM_COLS = 59       # Total de columnas del CSV / del dataclass SecopProceso
TOTAL_ROWS_ESTIMATE = 8_400_000   # Estimado para mostrar el porcentaje de progreso

# Mapping: header original (latin1-decoded) -> índice de posición en el dataclass
_HEADER_MAP = {
    "Entidad":                                                              0,
    "Nit Entidad":                                                          1,
    "Departamento Entidad":                                                 2,
    "Ciudad Entidad":                                                       3,
    "OrdenEntidad":                                                         4,
    "Entidad Centralizada":                                                 5,
    "ID del Proceso":                                                       6,
    "Referencia del Proceso":                                               7,
    "PCI":                                                                  8,
    "ID del Portafolio":                                                    9,
    "Nombre del Procedimiento":                                             10,
    "Descripci\u00f3n del Procedimiento":                                   11,
    "Fase":                                                                 12,
    "Fecha de Publicacion del Proceso":                                     13,
    "Fecha de Ultima Publicaci\u00f3n":                                     14,
    "Fecha de Publicacion (Fase Planeacion Precalificacion)":               15,
    "Fecha de Publicacion (Fase Seleccion Precalificacion)":                16,
    "Fecha de Publicacion (Manifestacion de Interes)":                      17,
    "Fecha de Publicacion (Fase Borrador)":                                 18,
    "Fecha de Publicacion (Fase Seleccion)":                                19,
    "Precio Base":                                                          20,
    "Modalidad de Contratacion":                                            21,
    "Justificaci\u00f3n Modalidad de Contrataci\u00f3n":                    22,
    "Duracion":                                                             23,
    "Unidad de Duracion":                                                   24,
    "Fecha de Recepcion de Respuestas":                                     25,
    "Fecha de Apertura de Respuesta":                                       26,
    "Fecha de Apertura Efectiva":                                           27,
    "Ciudad de la Unidad de Contrataci\u00f3n":                            28,
    "Nombre de la Unidad de Contrataci\u00f3n":                            29,
    "Proveedores Invitados":                                                30,
    "Proveedores con Invitacion Directa":                                   31,
    "Visualizaciones del Procedimiento":                                    32,
    "Proveedores que Manifestaron Interes":                                 33,
    "Respuestas al Procedimiento":                                          34,
    "Respuestas Externas":                                                  35,
    "Conteo de Respuestas a Ofertas":                                       36,
    "Proveedores Unicos con Respuestas":                                    37,
    "Numero de Lotes":                                                      38,
    "Estado del Procedimiento":                                             39,
    "ID Estado del Procedimiento":                                          40,
    "Adjudicado":                                                           41,
    "ID Adjudicacion":                                                      42,
    "CodigoProveedor":                                                      43,
    "Departamento Proveedor":                                               44,
    "Ciudad Proveedor":                                                     45,
    "Fecha Adjudicacion":                                                   46,
    "Valor Total Adjudicacion":                                             47,
    "Nombre del Adjudicador":                                               48,
    "Nombre del Proveedor Adjudicado":                                      49,
    "NIT del Proveedor Adjudicado":                                         50,
    "Codigo Principal de Categoria":                                        51,
    "Estado de Apertura del Proceso":                                       52,
    "Tipo de Contrato":                                                     53,
    "Subtipo de Contrato":                                                  54,
    "Categorias Adicionales":                                               55,
    "URLProceso":                                                           56,
    "Codigo Entidad":                                                       57,
    "Estado Resumen":                                                       58,
}


# ---------------------------------------------------------------------------
# Lightweight DB handler
# ---------------------------------------------------------------------------

class _ProcesosDBHandler:
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)

        self.db_path = config["DB_PATH_PROCESOS"]

        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

        self.conn = sqlite3.connect(self.db_path, isolation_level=None)
        # Performance PRAGMAs para inserciones masivas
        self.conn.execute("PRAGMA journal_mode = OFF;")
        self.conn.execute("PRAGMA synchronous = OFF;")
        self.conn.execute("PRAGMA cache_size = -32000;")  # ~32 MB de cache SQLite
        self.conn.execute("PRAGMA temp_store = MEMORY;")

    def close(self):
        if self.conn:
            self.conn.close()

    def create_table(self):
        columns_sql = [
            "entidad TEXT",
            "nit_entidad TEXT",
            "departamento_entidad TEXT",
            "ciudad_entidad TEXT",
            "ordenentidad TEXT",
            "entidad_centralizada TEXT",
            "id_del_proceso TEXT PRIMARY KEY",
            "referencia_del_proceso TEXT",
            "pci TEXT",
            "id_del_portafolio TEXT",
            "nombre_del_procedimiento TEXT",
            "descripcin_del_procedimiento TEXT",
            "fase TEXT",
            "fecha_de_publicacion_del_proceso TEXT",
            "fecha_de_ultima_publicacin TEXT",
            "fecha_de_publicacion_fase_planeacion_precalificacion TEXT",
            "fecha_de_publicacion_fase_seleccion_precalificacion TEXT",
            "fecha_de_publicacion_manifestacion_de_interes TEXT",
            "fecha_de_publicacion_fase_borrador TEXT",
            "fecha_de_publicacion_fase_seleccion TEXT",
            "precio_base TEXT",
            "modalidad_de_contratacion TEXT",
            "justificacin_modalidad_de_contratacin TEXT",
            "duracion TEXT",
            "unidad_de_duracion TEXT",
            "fecha_de_recepcion_de_respuestas TEXT",
            "fecha_de_apertura_de_respuesta TEXT",
            "fecha_de_apertura_efectiva TEXT",
            "ciudad_de_la_unidad_de_contratacin TEXT",
            "nombre_de_la_unidad_de_contratacin TEXT",
            "proveedores_invitados TEXT",
            "proveedores_con_invitacion_directa TEXT",
            "visualizaciones_del_procedimiento TEXT",
            "proveedores_que_manifestaron_interes TEXT",
            "respuestas_al_procedimiento TEXT",
            "respuestas_externas TEXT",
            "conteo_de_respuestas_a_ofertas TEXT",
            "proveedores_unicos_con_respuestas TEXT",
            "numero_de_lotes TEXT",
            "estado_del_procedimiento TEXT",
            "id_estado_del_procedimiento TEXT",
            "adjudicado TEXT",
            "id_adjudicacion TEXT",
            "codigoproveedor TEXT",
            "departamento_proveedor TEXT",
            "ciudad_proveedor TEXT",
            "fecha_adjudicacion TEXT",
            "valor_total_adjudicacion TEXT",
            "nombre_del_adjudicador TEXT",
            "nombre_del_proveedor_adjudicado TEXT",
            "nit_del_proveedor_adjudicado TEXT",
            "codigo_principal_de_categoria TEXT",
            "estado_de_apertura_del_proceso TEXT",
            "tipo_de_contrato TEXT",
            "subtipo_de_contrato TEXT",
            "categorias_adicionales TEXT",
            "urlproceso TEXT",
            "codigo_entidad TEXT",
            "estado_resumen TEXT",
        ]

        create_sql = (
            f"CREATE TABLE IF NOT EXISTS secopii_procesos "
            f"({', '.join(columns_sql)});"
        )
        idx_nit_entidad = (
            "CREATE INDEX IF NOT EXISTS idx_procesos_nit_entidad "
            "ON secopii_procesos(nit_entidad);"
        )
        idx_nit_proveedor = (
            "CREATE INDEX IF NOT EXISTS idx_procesos_nit_proveedor "
            "ON secopii_procesos(nit_del_proveedor_adjudicado);"
        )

        with self.conn:
            cur = self.conn.cursor()
            cur.execute(create_sql)
            cur.execute(idx_nit_entidad)
            cur.execute(idx_nit_proveedor)

    def insert_chunk(self, rows: list) -> None:
        placeholders = ", ".join(["?" for _ in range(NUM_COLS)])
        insert_q = f"INSERT OR REPLACE INTO secopii_procesos VALUES ({placeholders})"

        cursor = self.conn.cursor()
        cursor.execute("BEGIN TRANSACTION;")
        try:
            cursor.executemany(insert_q, rows)
            cursor.execute("COMMIT;")
        except Exception:
            cursor.execute("ROLLBACK;")
            raise
        finally:
            cursor.close()


# ---------------------------------------------------------------------------
# Main loader
# ---------------------------------------------------------------------------

def load_csv_to_sqlite(
    csv_filepath: str,
    config_path: str = "config.json",
    chunk_size: int = 5000,
    total_rows_estimate: int = TOTAL_ROWS_ESTIMATE,
):
    """
    Lee el CSV de procesos de contratación con codificación latin1, mapea los
    headers al esquema del dataclass SecopProceso y lo inserta en lotes pequeños
    para mantener footprint de RAM constante (~O(chunk_size)).

    Args:
        csv_filepath: Ruta al CSV.
        config_path:  Ruta a config.json.
        chunk_size:   Filas por lote de inserción (recomendado 5000 para datasets de 8GB+).
        total_rows_estimate: Estimado de filas totales para mostrar el porcentaje.
    """
    print(f"[*] Configurando base de datos para: {csv_filepath}")
    handler = _ProcesosDBHandler(config_path)
    handler.create_table()

    print(
        f"[*] Iniciando carga en lotes de {chunk_size:,} filas "
        f"(estimado total: {total_rows_estimate:,} filas)..."
    )
    start_time = time.time()
    total_processed = 0
    chunk = []

    try:
        # latin1 decodifica correctamente tildes rotas por encoding de Windows
        with open(csv_filepath, "r", encoding="latin1") as f:
            reader = csv.reader(f, delimiter=",", quotechar='"')

            # Leer y mapear headers
            try:
                raw_headers = next(reader)
            except StopIteration:
                print("[-] El archivo CSV esta vacio.")
                handler.close()
                return

            # Construir mapeo: indice_csv -> indice_dataclass
            col_index_map = {}
            for csv_idx, raw_col in enumerate(raw_headers):
                field_idx = _HEADER_MAP.get(raw_col.strip())
                if field_idx is not None:
                    col_index_map[csv_idx] = field_idx

            unrecognised = len(raw_headers) - len(col_index_map)
            if unrecognised:
                print(f"[!] {unrecognised} columna(s) del CSV no reconocidas, seran ignoradas.")

            for row in reader:
                # Armar la tupla en el orden exacto del dataclass
                ordered = [None] * NUM_COLS
                for csv_idx, field_idx in col_index_map.items():
                    if csv_idx < len(row):
                        val = row[csv_idx].strip()
                        ordered[field_idx] = val if val else None

                chunk.append(tuple(ordered))

                if len(chunk) >= chunk_size:
                    handler.insert_chunk(chunk)
                    total_processed += len(chunk)
                    chunk.clear()
                    # Liberar referencias a objetos temporales del chunk anterior
                    gc.collect()

                    elapsed = time.time() - start_time
                    pct = min((total_processed / total_rows_estimate) * 100, 100.0)
                    rate = total_processed / elapsed if elapsed > 0 else 0
                    eta_s = (total_rows_estimate - total_processed) / rate if rate > 0 else 0
                    eta_min = eta_s / 60

                    print(
                        f"  [+] {total_processed:>10,} filas  |  "
                        f"{pct:5.1f}%  |  "
                        f"{rate:,.0f} filas/s  |  "
                        f"ETA: {eta_min:.1f} min"
                    )

            # Insertar el remanente final
            if chunk:
                handler.insert_chunk(chunk)
                total_processed += len(chunk)
                chunk.clear()

    except FileNotFoundError:
        print(f"[X] Archivo no encontrado: {csv_filepath}")
    except Exception as e:
        print(f"[X] Error inesperado en la fila ~{total_processed + len(chunk)}: {e}")
        raise
    finally:
        handler.close()

    elapsed_total = time.time() - start_time
    print(
        f"\n[*] Carga completada.\n"
        f"    Total insertadas/actualizadas : {total_processed:,} filas\n"
        f"    Tiempo total                  : {elapsed_total:.1f}s  "
        f"({elapsed_total / 60:.1f} min)\n"
        f"    Base de datos                 : {handler.db_path}"
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Carga CSV de procesos de contratacion SECOP II a SQLite."
    )
    parser.add_argument(
        "csv_path",
        nargs="?",
        default="tests/secopii_procesos_contratos2.csv",
        help="Ruta al CSV (default: tests/secopii_procesos_contratos2.csv)",
    )
    parser.add_argument("--config", default="config.json", help="Ruta a config.json")
    parser.add_argument(
        "--chunk",
        type=int,
        default=5000,
        help="Filas por lote (default: 5000). Reducir si se agota la RAM.",
    )
    parser.add_argument(
        "--total",
        type=int,
        default=TOTAL_ROWS_ESTIMATE,
        help=f"Estimado de filas totales para el porcentaje (default: {TOTAL_ROWS_ESTIMATE:,})",
    )

    args = parser.parse_args()
    load_csv_to_sqlite(args.csv_path, args.config, args.chunk, args.total)
