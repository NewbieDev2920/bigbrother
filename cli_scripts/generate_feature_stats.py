
import sys
import os
# Añadir el directorio raíz al path para que funcionen los imports y se encuentre config.json desde cli_scripts/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import json, os, sqlite3, time, numpy as np, pandas as pd, sys
from src.domain.services.dania_scoring import DaniaScoringService, normalize_nit
from src.infrastructure.adapters.sqlite_contratistas_crud import SQLiteSecopContratistaAdapter
from src.infrastructure.adapters.sqlite_contratos_crud import SQLiteSecopContratoAdapter
from src.infrastructure.adapters.sqlite_sanciones_crud import SQLiteSecopSancionAdapter
from src.infrastructure.adapters.sqlite_invias_crud import SQLiteSecopInviasAdapter
from src.infrastructure.adapters.sqlite_procesos_crud import SQLiteSecopProcesoAdapter

def run_stats(sample_size=200):
    config_path = os.path.join(os.path.dirname(__file__), "..", "config.json")
    stats_path = os.path.join(os.path.dirname(__file__), "..", "global_statistics.json")
    with open(config_path, 'r', encoding='utf-8') as f: config = json.load(f)
    conn = sqlite3.connect(config["DB_PATH_CONTRATOS"])
    cur = conn.cursor()
    print("[*] Muestreando CONTRATISTAS activos (fast)...")
    # Take first 10k rows and get unique contractors from there
    cur.execute(f"SELECT documento_proveedor FROM secopii_contratos LIMIT 10000")
    raw_nits = [r[0] for r in cur.fetchall() if r[0]]
    conn.close()
    
    nits = list(set([normalize_nit(n) for n in raw_nits]))[:sample_size]
    print(f"[*] Procesando {len(nits)} contratistas...")
    
    service = DaniaScoringService(SQLiteSecopContratistaAdapter(config_path), SQLiteSecopContratoAdapter(config_path), SQLiteSecopSancionAdapter(config_path), SQLiteSecopInviasAdapter(config_path), SQLiteSecopProcesoAdapter(config_path), config_path=config_path, stats_path=stats_path)
    
    vectors_v = []
    t0 = time.time()
    for i, nit in enumerate(nits):
        try:
            res = service.score(nit)
            v = np.array(list(res["features_v"].values()))
            vectors_v.append(v)
        except: continue
        if (i+1)%50==0: print(f" {i+1}/{len(nits)} done...")
    
    if not vectors_v: return
    V = np.array(vectors_v)
    mu = np.mean(V, axis=0); sigma = np.std(V, axis=0)
    sigma = np.where(sigma == 0, 1.0, sigma)
    with open(stats_path, 'r', encoding='utf-8') as f: gs = json.load(f)
    gs["feature_stats"] = {f"x{i+1}": {"mu": float(mu[i]), "sigma": float(sigma[i])} for i in range(11)}
    with open(stats_path, 'w', encoding='utf-8') as f: json.dump(gs, f, indent=4)
    print("Done.")

if __name__ == "__main__": run_stats(200)
