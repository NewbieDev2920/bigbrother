import sqlite3, json
with open('config.json', 'r', encoding='utf-8') as f: cfg = json.load(f)
conn = sqlite3.connect(cfg['DB_PATH_PROCESOS'])
cur = conn.cursor()
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='index'")
for name, sql in cur.fetchall():
    print(f"Index: {name}\nSQL: {sql}\n")
conn.close()
