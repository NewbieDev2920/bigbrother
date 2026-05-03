"""
tests/dania_scoring/batch_score.py
-----------------------------------
Muestrea NITs de contratistas y calcula el Índice Dania.
Incluye promedios de cada feature xi para depuración.
"""

import argparse
import json
import os
import sqlite3
import subprocess
import sys
import time
import pandas as pd
import numpy as np

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, REPO_ROOT)

from src.domain.services.dania_scoring import DaniaScoringService, _WEIGHT_KEYS

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def run_batch(config_path, stats_path, n_sample, seed):
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
        
    print(f"\n[*] Iniciando Batch Dania Scoring (Sample={n_sample}, Seed={seed})")
    
    # 1. Muestrear NITs
    conn = sqlite3.connect(config["DB_PATH_CONTRATISTAS"])
    cur = conn.cursor()
    cur.execute(f"SELECT NIT FROM secopii_users WHERE NIT IS NOT NULL AND NIT != '' ORDER BY RANDOM() LIMIT {n_sample}")
    nits = [r[0] for r in cur.fetchall()]
    conn.close()
    
    if not nits:
        print("[!] No se encontraron NITs.")
        return

    # 2. Inicializar Servicio (con Cache)
    service = DaniaScoringService(
        config_path=config_path,
        stats_path=stats_path
    )
    
    # 3. Cálculo de Scores
    results = []
    t0 = time.time()
    
    for i, nit in enumerate(nits):
        try:
            res = service.score(nit)
            flat = {"nit": nit, "delta": res["delta"], "indice_dania": res["indice_dania"]}
            for k, v in res["features_raw"].items(): 
                flat[k] = v
            results.append(flat)
        except Exception as e:
            # print(f"\n[!] Error en NIT {nit}: {e}")
            pass
            
        if (i + 1) % 10 == 0 or i + 1 == n_sample:
            elapsed = time.time() - t0
            rate = (i + 1) / elapsed
            print(f"\r    Progreso: {i+1}/{n_sample} ({100*(i+1)/n_sample:.1f}%) | {rate:.1f} NIT/s | ETA: {(n_sample-(i+1))/rate:.0f}s", end="")

    print(f"\n\n[*] Procesamiento completado en {time.time()-t0:.1f}s")
    
    if not results:
        print("[!] No se calcularon resultados.")
        return

    df = pd.DataFrame(results)
    df.to_csv(os.path.join(OUTPUT_DIR, "results.csv"), index=False)
    
    # 4. Estadísticos Descriptivos
    dania = df["indice_dania"]
    feature_means = df[_WEIGHT_KEYS].mean()
    
    stats_text = f"""
======================================================
  ESTADÍSTICOS DESCRIPTIVOS - ÍNDICE DANIA
======================================================
N:          {len(dania)}
Media:      {dania.mean():.6f}
Mín:        {dania.min():.6f}
Mediana:    {dania.median():.6f}
Máx:        {dania.max():.6f}
======================================================
PROMEDIO DE CADA FEATURE (Raw):
"""
    for k, v in feature_means.items():
        stats_text += f"  - {k:<40}: {v:.10f}\n"
    stats_text += "======================================================\n"

    print(stats_text)
    with open(os.path.join(OUTPUT_DIR, "descriptive.txt"), "w") as f: f.write(stats_text)
    
    # 5. Casos extremos
    nit_max = df.loc[dania.idxmax(), "nit"]
    nit_min = df.loc[dania.idxmin(), "nit"]
    
    print(f"[*] NIT Max: {nit_max} ({dania.max():.6f})")
    print(f"[*] NIT Min: {nit_min} ({dania.min():.6f})")
    
    # 6. Detalle (Solo si el script existe)
    test_script = os.path.join(REPO_ROOT, "test_dania_scoring.py")
    if os.path.exists(test_script):
        for label, nit_val in [("MÁXIMO", nit_max), ("MÍNIMO", nit_min)]:
            print(f"\n--- DETALLE CASO {label} (NIT {nit_val}) ---")
            subprocess.run([sys.executable, test_script, str(nit_val)])

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample", type=int, default=100)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    run_batch("config.json", "global_statistics.json", args.sample, args.seed)
