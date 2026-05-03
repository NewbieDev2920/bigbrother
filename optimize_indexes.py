import sqlite3
import json
import os

def apply_optimization_indexes():
    print("[*] Aplicando índices de expresión para optimización O(log N)...")
    
    with open('config.json', 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    optimizations = [
        {
            "name": "contratos",
            "db": config["DB_PATH_CONTRATOS"],
            "queries": [
                "CREATE INDEX IF NOT EXISTS idx_contratos_nit_norm ON secopii_contratos(REPLACE(nit_entidad, ',', ''));"
            ]
        },
        {
            "name": "invias",
            "db": config["DB_PATH_INVIAS"],
            "queries": [
                "CREATE INDEX IF NOT EXISTS idx_invias_nit_norm ON secopii_invias(REPLACE(nit_entidad, ',', ''));"
            ]
        },
        {
            "name": "sanciones",
            "db": config["DB_PATH_SANCIONES"],
            "queries": [
                "CREATE INDEX IF NOT EXISTS idx_sanciones_nit_norm ON secopii_sanciones(REPLACE(REPLACE(documento_contratista, '-', ''), '.', ''));"
            ]
        },
        {
            "name": "procesos",
            "db": config["DB_PATH_PROCESOS"],
            "queries": [
                "CREATE INDEX IF NOT EXISTS idx_procesos_nit_ent_norm ON secopii_procesos(REPLACE(nit_entidad, ',', ''));",
                "CREATE INDEX IF NOT EXISTS idx_procesos_nit_prov_norm ON secopii_procesos(REPLACE(nit_del_proveedor_adjudicado, ',', ''));"
            ]
        }
    ]
    
    for opt in optimizations:
        db_path = opt["db"]
        if not os.path.exists(db_path):
            continue
            
        print(f"[+] Indexando {opt['name']}...")
        conn = sqlite3.connect(db_path)
        try:
            for q in opt["queries"]:
                conn.execute(q)
            conn.commit()
        except Exception as e:
            print(f"    [!] Error: {e}")
        finally:
            conn.close()

if __name__ == "__main__":
    apply_optimization_indexes()
