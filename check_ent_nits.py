import sqlite3, json
with open('config.json', 'r', encoding='utf-8') as f: cfg = json.load(f)
conn = sqlite3.connect(cfg['DB_PATH_PROCESOS'])
cur = conn.cursor()
cur.execute("SELECT nit_entidad FROM secopii_procesos LIMIT 10")
print(cur.fetchall())
conn.close()
