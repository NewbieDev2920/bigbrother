
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3
import json

with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f:
    config = json.load(f)

conn = sqlite3.connect(config["DB_PATH_SANCIONES"])
cur = conn.cursor()
cur.execute("SELECT nit_entidad, documento_contratista, nombre_contratista FROM secopii_sanciones LIMIT 5")
print(cur.fetchall())
conn.close()
