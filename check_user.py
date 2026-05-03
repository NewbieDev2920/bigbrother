import sqlite3, json
with open('config.json', 'r', encoding='utf-8') as f: cfg = json.load(f)
conn = sqlite3.connect(cfg['DB_PATH_CONTRATISTAS'])
cur = conn.cursor()
cur.execute("SELECT * FROM secopii_users WHERE NIT = '899999118'")
print(cur.fetchone())
conn.close()
