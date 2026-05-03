import os
import sys
import json
import sqlite3
import csv
import time
import gc

# Ensure we can import from src if needed, though this is mostly standalone
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class SQLiteSancionesHandler:
    def __init__(self, config_path: str = "config.json"):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        self.db_path = config["DB_PATH_SANCIONES"]
        
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
        Crea la tabla secopii_sanciones con 14 columnas.
        """
        columns = [
            "nombre_entidad TEXT",
            "nit_entidad TEXT",
            "nivel TEXT",
            "orden TEXT",
            "municipio TEXT",
            "numero_de_resolucion TEXT",
            "documento_contratista TEXT",
            "nombre_contratista TEXT",
            "numero_de_contrato TEXT",
            "valor_sancion TEXT",
            "fecha_de_publicacion TEXT",
            "fecha_de_firmeza TEXT",
            "fecha_de_cargue TEXT",
            "ruta_de_proceso TEXT"
        ]
        
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS secopii_sanciones(
            {", ".join(columns)}
        );
        """
        
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(create_table_sql)

    def insert_chunk(self, rows: list) -> None:
        """
        Inserta un lote de filas en la tabla de sanciones.
        """
        placeholders = ", ".join(["?" for _ in range(14)])
        insert_q = f"INSERT INTO secopii_sanciones VALUES ({placeholders})"
        
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

def load_sanciones_to_sqlite(csv_filepath: str, config_path: str = "config.json", chunk_size: int = 20000):
    print(f"[*] Configurando base de datos e inicializando tabla para {csv_filepath}")
    handler = SQLiteSancionesHandler(config_path)
    handler.create_table()
    
    print(f"[*] Iniciando carga del CSV en lotes de {chunk_size} filas...")
    
    start_time = time.time()
    total_processed = 0
    chunk = []
    
    try:
        with open(csv_filepath, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.reader(f, delimiter=',', quotechar='"')
            
            try:
                headers = next(reader)
                if len(headers) != 14:
                    print(f"[!] Advertencia: La cabecera tiene {len(headers)} columnas, se esperaban 14.")
            except StopIteration:
                print("[-] El archivo CSV está vacío.")
                return

            for row_idx, row in enumerate(reader, start=1):
                if len(row) > 14:
                    row = row[:14]
                elif len(row) < 14:
                    row += [''] * (14 - len(row))
                    
                chunk.append(tuple(row))
                
                if len(chunk) >= chunk_size:
                    handler.insert_chunk(chunk)
                    total_processed += len(chunk)
                    chunk.clear()
                    gc.collect()
                    elapsed = time.time() - start_time
                    print(f"  [+] Procesadas {total_processed} filas... ({elapsed:.2f} s transcurridos)")
            
            if chunk:
                handler.insert_chunk(chunk)
                total_processed += len(chunk)
                
    except FileNotFoundError:
        print(f"[X] Archivo no encontrado: {csv_filepath}")
    except Exception as e:
        print(f"[X] Ocurrió un error inesperado durante la lectura: {e}")

    total_time = time.time() - start_time
    print(f"[*] Carga completada. Total insertados: {total_processed} en {total_time:.2f} segundos.")
    handler.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Script para cargar CSV de sanciones en SQLite.")
    parser.add_argument("csv_path", type=str, help="Ruta al archivo CSV de sanciones")
    parser.add_argument("--config", type=str, default="config.json", help="Ruta al config.json")
    parser.add_argument("--chunk", type=int, default=20000, help="Tamaño del bloque de inserción (chunk size)")
    
    args = parser.parse_args()
    load_sanciones_to_sqlite(args.csv_path, args.config, args.chunk)
