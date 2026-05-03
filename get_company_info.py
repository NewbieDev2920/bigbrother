"""
get_company_info.py
--------------------
Busca y despliega toda la información de un contratista en SECOP II basado en su NIT.
"""

import argparse
import json
import sqlite3
import os
import sys

def get_company_info(nit: str):
    # Cargar configuración
    config_path = "config.json"
    if not os.path.exists(config_path):
        print(f"[!] Error: No se encontró {config_path}")
        return

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    db_path = config.get("DB_PATH_CONTRATISTAS")
    if not db_path or not os.path.exists(db_path):
        print(f"[!] Error: Base de datos de contratistas no encontrada en {db_path}")
        return

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Para acceder por nombre de columna
    cur = conn.cursor()

    # Normalizar NIT (aunque en secopii_users suelen estar limpios)
    nit_clean = nit.replace(".", "").replace(",", "").replace("-", "").strip()

    print(f"[*] Buscando información para el NIT: {nit_clean}...")
    
    # Intentar búsqueda exacta
    cur.execute("SELECT * FROM secopii_users WHERE NIT = ?", (nit_clean,))
    row = cur.fetchone()

    if not row:
        # Intentar búsqueda parcial/like por si acaso
        cur.execute("SELECT * FROM secopii_users WHERE NIT LIKE ?", (f"%{nit_clean}%",))
        row = cur.fetchone()

    if not row:
        print(f"[!] No se encontró ninguna empresa con el NIT {nit} en la base de datos de usuarios.")
        conn.close()
        return

    # Imprimir resultados
    print("\n" + "="*60)
    print(f" INFO EMPRESA: {row['Nombre']}")
    print("="*60)
    
    for key in row.keys():
        if key == "index": continue
        val = row[key]
        # Manejo de encoding para terminales Windows
        display_key = key.encode('utf-8', 'ignore').decode('cp1252', 'ignore') if sys.platform == "win32" else key
        print(f"{key:<35}: {val}")
    
    print("="*60 + "\n")
    conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Consulta información de empresa por NIT.")
    parser.add_argument("nit", help="NIT de la empresa a consultar")
    args = parser.parse_args()
    get_company_info(args.nit)
