import sqlite3
import json

with open('config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

conn = sqlite3.connect(config["DB_PATH_SANCIONES"])
cur = conn.cursor()
cur.execute("SELECT nit_entidad, documento_contratista, nombre_contratista FROM secopii_sanciones LIMIT 5")
print(cur.fetchall())
conn.close()
