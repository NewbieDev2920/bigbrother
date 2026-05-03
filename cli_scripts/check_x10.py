
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3, json
from datetime import datetime
def parse_secop_date(date_str: str):
    try:
        parts = date_str.split('/')
        if len(parts) == 3: return datetime(int(parts[2]), int(parts[0]), int(parts[1]))
    except: pass
    return None

with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f: cfg = json.load(f)
conn = sqlite3.connect(cfg['DB_PATH_PROCESOS'])
cur = conn.cursor()
cur.execute("SELECT fecha_de_publicacion_del_proceso, fecha_adjudicacion, nit_del_proveedor_adjudicado FROM secopii_procesos WHERE fecha_adjudicacion IS NOT NULL LIMIT 20")
for pub, adj, nit in cur.fetchall():
    dp = parse_secop_date(pub); da = parse_secop_date(adj)
    if dp and da:
        print(f"NIT: {nit} | Delta: {(da-dp).days}")
conn.close()
