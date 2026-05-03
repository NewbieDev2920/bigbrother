import json, os, sqlite3, time, numpy as np, pandas as pd, sys
from src.domain.services.dania_scoring import DaniaScoringService, normalize_nit
from src.infrastructure.adapters.sqlite_contratistas_crud import SQLiteSecopContratistaAdapter
from src.infrastructure.adapters.sqlite_contratos_crud import SQLiteSecopContratoAdapter
from src.infrastructure.adapters.sqlite_sanciones_crud import SQLiteSecopSancionAdapter
from src.infrastructure.adapters.sqlite_invias_crud import SQLiteSecopInviasAdapter
from src.infrastructure.adapters.sqlite_procesos_crud import SQLiteSecopProcesoAdapter

config_path = "config.json"
stats_path = "global_statistics.json"
service = DaniaScoringService(SQLiteSecopContratistaAdapter(config_path), SQLiteSecopContratoAdapter(config_path), SQLiteSecopSancionAdapter(config_path), SQLiteSecopInviasAdapter(config_path), SQLiteSecopProcesoAdapter(config_path), config_path=config_path, stats_path=stats_path)

nit = "900192544" # Known NIT
t0 = time.time()
res = service.score(nit)
print(f"Score for {nit} took {time.time()-t0:.2f}s")
print(res)
