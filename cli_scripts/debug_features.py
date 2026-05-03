
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import sqlite3
import json
import pandas as pd
import numpy as np
from datetime import datetime

with open(os.path.join(os.path.dirname(__file__), '..', 'config.json'), 'r', encoding='utf-8') as f:
    config = json.load(f)

def normalize_nit(nit):
    if not nit: return ""
    return str(nit).replace(".", "").replace(",", "").replace("-", "").strip()

# Let's find a NIT that definitely has contracts to debug
conn = sqlite3.connect(config["DB_PATH_CONTRATOS"])
cur = conn.cursor()
cur.execute("SELECT nit_entidad FROM secopii_contratos WHERE nit_entidad IS NOT NULL LIMIT 20")
nits_with_commas = [r[0] for r in cur.fetchall()]
print("NITs with commas in contracts:", nits_with_commas)

target_nit_raw = nits_with_commas[0]
target_nit = normalize_nit(target_nit_raw)
print(f"Targeting NIT: {target_nit} (normalized from {target_nit_raw})")

# Check x2 count
cur.execute("SELECT COUNT(*) FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?", (target_nit,))
count_x2 = cur.fetchone()[0]
print(f"x2 count for {target_nit}: {count_x2}")

# Check x3 (modalidad)
cur.execute("SELECT modalidad_de_contratacion, COUNT(*) FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ? GROUP BY modalidad_de_contratacion", (target_nit,))
modalidades = cur.fetchall()
print(f"x3 modalidades: {modalidades}")

# Check x5/x6 (values)
cur.execute("SELECT valor_del_contrato, valor_de_pago_adelantado, valor_pagado, valor_facturado FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?", (target_nit,))
vals = cur.fetchall()
print(f"Sample values (vc, va, vp, vf) for x5/x6: {vals[:3]}")

conn.close()

# Check procesos for x9, x10, x11
conn_p = sqlite3.connect(config["DB_PATH_PROCESOS"])
cur_p = conn_p.cursor()
cur_p.execute("SELECT nit_del_proveedor_adjudicado FROM secopii_procesos WHERE nit_del_proveedor_adjudicado IS NOT NULL LIMIT 10")
print("NITs in procesos:", [r[0] for r in cur_p.fetchall()])

cur_p.execute("SELECT COUNT(*) FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ?", (target_nit,))
count_p = cur_p.fetchone()[0]
print(f"Procesos count for {target_nit}: {count_p}")
conn_p.close()
