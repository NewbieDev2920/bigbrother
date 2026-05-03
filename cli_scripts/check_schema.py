
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3
import json

with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f:
    config = json.load(f)

def check(name, path, table):
    print(f"=== {name} ({table}) ===")
    conn = sqlite3.connect(path)
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info({table})")
    cols = cur.fetchall()
    for col in cols:
        print(f"  {col[1]}")
    conn.close()

check("Contratos", config["DB_PATH_CONTRATOS"], "secopii_contratos")
check("Procesos", config["DB_PATH_PROCESOS"], "secopii_procesos")
check("Sanciones", config["DB_PATH_SANCIONES"], "secopii_sanciones")
