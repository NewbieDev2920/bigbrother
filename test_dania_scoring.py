"""
test_dania_scoring.py
----------------------
Script de auditoría individual del Índice Dania.
(Version con 6 decimales para features pequeños)
"""

import argparse
import sys
import os

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from src.infrastructure.adapters.sqlite_contratistas_crud import SQLiteSecopContratistaAdapter
from src.infrastructure.adapters.sqlite_contratos_crud import SQLiteSecopContratoAdapter
from src.infrastructure.adapters.sqlite_sanciones_crud import SQLiteSecopSancionAdapter
from src.infrastructure.adapters.sqlite_invias_crud import SQLiteSecopInviasAdapter
from src.infrastructure.adapters.sqlite_procesos_crud import SQLiteSecopProcesoAdapter

from src.domain.services.dania_scoring import DaniaScoringService, normalize_nit

BOLD = ""; GREEN = ""; YELLOW = ""; RED = ""; CYAN = ""; RESET = ""
if sys.stdout.isatty():
    try:
        import colorama
        colorama.init()
        BOLD = "\033[1m"; GREEN = "\033[92m"; YELLOW = "\033[93m"; RED = "\033[91m"; CYAN = "\033[96m"; RESET = "\033[0m"
    except: pass

def _color(text, code): return f"{code}{text}{RESET}"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("nit", type=str)
    parser.add_argument("--config", default="config.json")
    parser.add_argument("--stats", default="global_statistics.json")
    args = parser.parse_args()

    nit = normalize_nit(args.nit)
    print(f"\n{_color('AUDITORIA DANIA - Big Brother', BOLD + CYAN)}")
    print(f"Evaluando NIT: {_color(nit, BOLD)}")

    service = DaniaScoringService(SQLiteSecopContratistaAdapter(args.config), SQLiteSecopContratoAdapter(args.config), SQLiteSecopSancionAdapter(args.config), SQLiteSecopInviasAdapter(args.config), SQLiteSecopProcesoAdapter(args.config), config_path=args.config, stats_path=args.stats)

    try:
        res = service.score(nit)
    except Exception as e:
        import traceback
        print(_color(f"\n[!] Error critico: {e}", RED))
        traceback.print_exc()
        return

    print(f"\n{_color('-- Features (Vector x)', BOLD)}")
    labels = [
        ("x1", "Sanciones Previas"), ("x2", "Concentracion Contratos"), ("x3", "Max Modalidad"),
        ("x4", "Dias desde Creacion"), ("x5", "Razon Anticipo (va/vc)"), ("x6", "Razon Ejecucion (vp/vf)"),
        ("x7", "Max Log Growth Count"), ("x8", "Max Log Growth Value"), ("x9", "Max Conc Entidad"),
        ("x10", "Velocidad Adjudicacion"), ("x11", "Prob Ganar (1/nk)")
    ]
    keys = ["x1_sanciones", "x2_concentracion_contratos", "x3_max_modalidad", "x4_dias_desde_creacion", "x5_razon_anticipo", "x6_razon_ejecucion", "x7_max_log_growth_count", "x8_max_log_growth_value", "x9_max_concentracion_entidad_proveedor", "x10_velocidad_adjudicacion_dias", "x11_prob_ganar_adjudicacion"]

    for (x_label, name), key in zip(labels, keys):
        val = res["features_raw"].get(key, 0.0)
        # Usar .6f para mostrar valores pequeños
        print(f"  {x_label:<4} {name:<30}: {_color(f'{val:.6f}', BOLD)}")

    print(f"\n{_color('-- Resultados del Modelo', BOLD)}")
    delta = res["delta"]
    dania = res["indice_dania"]
    print(f"  delta (Scoring Lineal) : {_color(f'{delta:+.6f}', BOLD)}")
    risk_color = GREEN if dania < 1.0 else (YELLOW if dania < 5.0 else RED)
    print(f"  Indice Dania (d)       : {_color(f'{dania:.6f}', BOLD + risk_color)}")
    risk_level = "BAJO" if dania < 1.0 else ("MEDIO" if dania < 5.0 else "ALTO")
    print(f"  Nivel de Riesgo        : {_color(risk_level, BOLD + risk_color)}")
    print()

if __name__ == "__main__": main()
