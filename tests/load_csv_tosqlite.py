import os
import sys
import json
import sqlite3
import csv
import time
import gc

# Ensure we can import from src if needed, though this is mostly standalone
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class SQLiteContratosHandler:
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH_CONTRATOS"]
        
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir)

        # Mantenemos una única conexión para evitar fugas de memoria y bloqueos (disk I/O error)
        self.conn = sqlite3.connect(self.db_path, isolation_level=None)
        # Optimizaciones de SQLite para inserciones masivas y evitar saturacion
        self.conn.execute("PRAGMA journal_mode = OFF;")
        self.conn.execute("PRAGMA synchronous = OFF;")
        self.conn.execute("PRAGMA cache_size = -64000;") # Limitar caché a ~64MB
        self.conn.execute("PRAGMA temp_store = MEMORY;")

    def close(self):
        if self.conn:
            self.conn.close()

    def create_table(self):
        """
        Crea la tabla secopii_contratos con 84 columnas.
        id_contrato se designa como PRIMARY KEY.
        """
        columns = [
            "nombre_entidad TEXT",
            "nit_entidad TEXT",
            "departamento TEXT",
            "ciudad TEXT",
            "localizacion TEXT",
            "orden TEXT",
            "sector TEXT",
            "rama TEXT",
            "entidad_centralizada TEXT",
            "proceso_de_compra TEXT",
            "id_contrato TEXT PRIMARY KEY",
            "referencia_del_contrato TEXT",
            "estado_contrato TEXT",
            "codigo_de_categoria_principal TEXT",
            "descripcion_del_proceso TEXT",
            "tipo_de_contrato TEXT",
            "modalidad_de_contratacion TEXT",
            "justificacion_modalidad_de_contratacion TEXT",
            "fecha_de_firma TEXT",
            "fecha_de_inicio_del_contrato TEXT",
            "fecha_de_fin_del_contrato TEXT",
            "condiciones_de_entrega TEXT",
            "tipodocproveedor TEXT",
            "documento_proveedor TEXT",
            "proveedor_adjudicado TEXT",
            "es_grupo TEXT",
            "es_pyme TEXT",
            "habilita_pago_adelantado TEXT",
            "liquidacion TEXT",
            "obligacion_ambiental TEXT",
            "obligaciones_postconsumo TEXT",
            "reversion TEXT",
            "origen_de_los_recursos TEXT",
            "destino_gasto TEXT",
            "valor_del_contrato TEXT",
            "valor_de_pago_adelantado TEXT",
            "valor_facturado TEXT",
            "valor_pendiente_de_pago TEXT",
            "valor_pagado TEXT",
            "valor_amortizado TEXT",
            "valor_pendiente_de_amortizacion TEXT",
            "valor_pendiente_de_ejecucion TEXT",
            "saldo_cdp TEXT",
            "saldo_vigencia TEXT",
            "espostconflicto TEXT",
            "dias_adicionados TEXT",
            "puntos_del_acuerdo TEXT",
            "pilares_del_acuerdo TEXT",
            "urlproceso TEXT",
            "nombre_representante_legal TEXT",
            "nacionalidad_representante_legal TEXT",
            "domicilio_representante_legal TEXT",
            "tipo_de_identificacion_representante_legal TEXT",
            "identificacion_representante_legal TEXT",
            "genero_representante_legal TEXT",
            "presupuesto_general_de_la_nacion_pgn TEXT",
            "sistema_general_de_participaciones TEXT",
            "sistema_general_de_regalias TEXT",
            "recursos_propios_alcaldias_gobernaciones_resguardos TEXT",
            "recursos_de_credito TEXT",
            "recursos_propios TEXT",
            "ultima_actualizacion TEXT",
            "codigo_entidad TEXT",
            "codigo_proveedor TEXT",
            "fecha_inicio_liquidacion TEXT",
            "fecha_fin_liquidacion TEXT",
            "objeto_del_contrato TEXT",
            "duracion_del_contrato TEXT",
            "nombre_del_banco TEXT",
            "tipo_de_cuenta TEXT",
            "numero_de_cuenta TEXT",
            "el_contrato_puede_ser_prorrogado TEXT",
            "fecha_de_notificacion_de_prorrogacion TEXT",
            "nombre_ordenador_del_gasto TEXT",
            "tipo_de_documento_ordenador_del_gasto TEXT",
            "numero_de_documento_ordenador_del_gasto TEXT",
            "nombre_supervisor TEXT",
            "tipo_de_documento_supervisor TEXT",
            "numero_de_documento_supervisor TEXT",
            "nombre_ordenador_de_pago TEXT",
            "tipo_de_documento_ordenador_de_pago TEXT",
            "numero_de_documento_ordenador_de_pago TEXT",
            "documentos_tipo TEXT",
            "descripcion_documentos_tipo TEXT"
        ]
        
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS secopii_contratos(
            {", ".join(columns)}
        );
        """
        
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(create_table_sql)

    def insert_chunk(self, rows: list) -> None:
        """
        Inserta un lote de filas en la tabla de contratos.
        La query asume que el input (rows) contiene 84 elementos por tupla.
        En el dataset, el id_contrato es la columna 10 (indice 0-based), es decir rows[10].
        Como el ID puede duplicarse en archivos grandes con múltiples actualizaciones, 
        usamos INSERT OR REPLACE (o INSERT OR IGNORE). Aquí usaremos INSERT OR REPLACE.
        """
        placeholders = ", ".join(["?" for _ in range(84)])
        insert_q = f"INSERT OR REPLACE INTO secopii_contratos VALUES ({placeholders})"
        
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


def load_csv_to_sqlite(csv_filepath: str, config_path: str = "config.json", chunk_size: int = 20000):
    """
    Lee un CSV masivo (ej. 9GB) iterativamente y carga a la base de datos en chunks.
    Maneja el CSV mediante la librería estandar para asegurar O(1) de memoria respecto al tamaño del archivo.
    """
    print(f"[*] Configurando base de datos e inicializando tabla para {csv_filepath}")
    handler = SQLiteContratosHandler(config_path)
    handler.create_table()
    
    print(f"[*] Iniciando carga del CSV en lotes de {chunk_size} filas...")
    
    start_time = time.time()
    total_processed = 0
    chunk = []
    
    try:
        # Importante: usar encoding='utf-8' pero tolerar errores ya que algunos CSV gigantes vienen mal formados
        with open(csv_filepath, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.reader(f, delimiter=',', quotechar='"')
            
            # Omitir los headers (la primera linea)
            try:
                headers = next(reader)
                if len(headers) != 84:
                    print(f"[!] Advertencia: La cabecera tiene {len(headers)} columnas, se esperaban 84.")
            except StopIteration:
                print("[-] El archivo CSV está vacío.")
                return

            # Iterar cada fila del CSV
            for row_idx, row in enumerate(reader, start=1):
                # Normalizar filas si les sobran o faltan columnas
                if len(row) > 84:
                    row = row[:84]
                elif len(row) < 84:
                    row += [''] * (84 - len(row))
                    
                chunk.append(tuple(row))
                
                # Cada vez que llegamos a chunk_size, enviamos a DB
                if len(chunk) >= chunk_size:
                    handler.insert_chunk(chunk)
                    total_processed += len(chunk)
                    chunk.clear()
                    gc.collect()
                    elapsed = time.time() - start_time
                    print(f"  [+] Procesadas {total_processed} filas... ({elapsed:.2f} s transcurridos)")
            
            # Insertar remanentes
            if chunk:
                handler.insert_chunk(chunk)
                total_processed += len(chunk)
                
    except FileNotFoundError:
        print(f"[X] Archivo no encontrado: {csv_filepath}")
    except Exception as e:
        print(f"[X] Ocurrió un error inesperado durante la lectura: {e}")

    total_time = time.time() - start_time
    print(f"[*] Carga completada. Total insertados/actualizados: {total_processed} en {total_time:.2f} segundos.")
    
    # Cerrar la conexión correctamente
    handler.close()


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Script para cargar CSV gigantes de contratos SECOP II en SQLite.")
    parser.add_argument("csv_path", type=str, help="Ruta al archivo CSV de 9GB+")
    parser.add_argument("--config", type=str, default="config.json", help="Ruta al config.json")
    parser.add_argument("--chunk", type=int, default=20000, help="Tamaño del bloque de inserción (chunk size)")
    
    args = parser.parse_args()
    load_csv_to_sqlite(args.csv_path, args.config, args.chunk)
