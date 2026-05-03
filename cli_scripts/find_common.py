
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3, json
with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f: cfg = json.load(f)

# Sample NITs from users
conn_u = sqlite3.connect(cfg['DB_PATH_CONTRATISTAS'])
cur_u = conn_u.cursor()
cur_u.execute("SELECT NIT FROM secopii_users LIMIT 1000")
user_nits = [r[0] for r in cur_u.fetchall()]
conn_u.close()

# Check which of these are in contratos
conn_c = sqlite3.connect(cfg['DB_PATH_CONTRATOS'])
cur_c = conn_c.cursor()
found = []
for nit in user_nits:
    # Match against normalized nit_entidad
    cur_c.execute("SELECT COUNT(*) FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?", (nit,))
    if cur_c.fetchone()[0] > 0:
        found.append(nit)
        if len(found) >= 5: break
conn_c.close()

print("Common NITs:", found)
