import sqlite3, json
with open('config.json', 'r', encoding='utf-8') as f: cfg = json.load(f)

print("--- Contratos (fecha_de_firma) ---")
conn_c = sqlite3.connect(cfg['DB_PATH_CONTRATOS'])
cur_c = conn_c.cursor()
cur_c.execute("SELECT fecha_de_firma FROM secopii_contratos WHERE fecha_de_firma IS NOT NULL LIMIT 5")
print(cur_c.fetchall())
conn_c.close()

print("\n--- Procesos (fecha_adjudicacion) ---")
conn_p = sqlite3.connect(cfg['DB_PATH_PROCESOS'])
cur_p = conn_p.cursor()
cur_p.execute("SELECT fecha_adjudicacion FROM secopii_procesos WHERE fecha_adjudicacion IS NOT NULL LIMIT 5")
print(cur_p.fetchall())
conn_p.close()
