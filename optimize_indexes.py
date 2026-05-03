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
                # Contractor index (Primary use case for Dania scoring)
                "CREATE INDEX IF NOT EXISTS idx_contratos_doc_prov_norm ON secopii_contratos(REPLACE(documento_proveedor, ',', ''));"
            ]
        },
        {
            "name": "invias",
            "db": config["DB_PATH_INVIAS"],
            "queries": [
                "CREATE INDEX IF NOT EXISTS idx_invias_doc_prov_norm ON secopii_invias(REPLACE(documento_proveedor, ',', ''));"
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
                # Contractor index
                "CREATE INDEX IF NOT EXISTS idx_procesos_nit_prov_norm ON secopii_procesos(REPLACE(nit_del_proveedor_adjudicado, ',', ''));",
                # Entity index for x9 (using raw nit_entidad)
                "CREATE INDEX IF NOT EXISTS idx_procesos_nit_entidad ON secopii_procesos(nit_entidad);"
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
