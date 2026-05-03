
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3, json
with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f: cfg = json.load(f)
conn = sqlite3.connect(cfg['DB_PATH_CONTRATISTAS'])
cur = conn.cursor()
cur.execute("SELECT * FROM secopii_users WHERE NIT = '899999118'")
print(cur.fetchone())
conn.close()
