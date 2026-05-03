"""
generate_global_statistics.py
------------------------------
Script de pre-cómputo ejecutado UNA SOLA VEZ para reducir la complejidad
algorítmica en producción de O(N) a O(1) para estadísticas globales.

Calcula:
  - table_shapes:          cantidad total de filas por tabla.
  - numeric_stats:         mu y sigma de columnas numéricas clave.
  - omitted_percentages:   % de datos no parseables por columna.
  - date_delta_stats:      mu y sigma de diferencias de fechas (velocidad de adjudicacion).

Uso:
    python generate_global_statistics.py
    python generate_global_statistics.py --config config.json --output global_statistics.json
"""

import sqlite3
import json
import os
import gc
import math
import argparse
from datetime import datetime, timezone

import numpy as np


# ---------------------------------------------------------------------------
# Configuración de columnas numéricas por tabla
# ---------------------------------------------------------------------------

NUMERIC_COLUMNS = {
    "secopii_contratos": [
        "valor_del_contrato",
        "valor_de_pago_adelantado",
        "valor_facturado",
        "valor_pagado",
    ],
    "secopii_invias": [
        "valor_del_contrato",
        "valor_de_pago_adelantado",
        "valor_facturado",
        "valor_pagado",
    ],
    "secopii_sanciones": [
        "valor_sancion",
    ],
    "secopii_procesos": [
        "valor_total_adjudicacion",
        "proveedores_unicos_con_respuestas",  # para x11 (competidores)
        "precio_base",
        "duracion",
    ],
}

# Columnas de fecha para calcular la diferencia t_adjudicacion - t_publicacion (x10)
# Nota: fecha_adjudicacion solo existe en ~494k de 8.1M filas (procesos adjudicados).
# El 94% de omision es ESTRUCTURAL (el resto de procesos aun no tienen adjudicacion),
# no un problema de parseo. El formato real del dataset es MM/DD/YYYY.
DATE_DELTA_CONFIG = {
    "secopii_procesos": {
        "col_start": "fecha_de_publicacion_del_proceso",   # t_publicacion
        "col_end":   "fecha_adjudicacion",                  # t_adjudicacion
        "stat_name": "velocidad_adjudicacion_dias",
        "date_formats": ["%m/%d/%Y", "%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S"],
    }
}

CHUNK_SIZE = 100_000  # Filas por fetchmany para no saturar RAM


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _try_parse_date(val: str, formats: list):
    """Intenta parsear val con los formatos dados. Retorna datetime o None."""
    val = val.strip()
    for fmt in formats:
        try:
            return datetime.strptime(val[:len(fmt.replace('%Y','2000').replace('%m','01')
                                           .replace('%d','01').replace('%H','00')
                                           .replace('%M','00').replace('%S','00'))],
                                    fmt)
        except (ValueError, TypeError):
            pass
    # Fallback: pandas-style
    try:
        import pandas as pd
        return pd.to_datetime(val, errors="raise").to_pydatetime()
    except Exception:
        return None


def _clean_float(val) -> float | None:
    """Parsea val a float limpiando caracteres monetarios. Retorna None si falla."""
    if val is None:
        return None
    cleaned = str(val).replace(",", "").replace("$", "").strip()
    if cleaned == "" or cleaned.lower() in ("nan", "none", "null", "n/a"):
        return None
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return None


# ---------------------------------------------------------------------------
# Welford's online algorithm para mu y sigma sin acumular el array completo
# (evita saturar RAM en tablas de millones de filas)
# ---------------------------------------------------------------------------

class WelfordAccumulator:
    """Calcula media y varianza de forma incremental (O(1) de memoria)."""

    def __init__(self):
        self.n = 0
        self.mean = 0.0
        self.M2 = 0.0  # Sum of squared deviations

    def update(self, value: float):
        self.n += 1
        delta = value - self.mean
        self.mean += delta / self.n
        delta2 = value - self.mean
        self.M2 += delta * delta2

    @property
    def sigma(self) -> float:
        if self.n < 2:
            return 0.0
        return math.sqrt(self.M2 / self.n)  # población (no muestral)

    def result(self) -> dict:
        return {
            "mu":    self.mean if self.n > 0 else 0.0,
            "sigma": self.sigma,
            "n":     self.n,
        }


# ---------------------------------------------------------------------------
# Sección 1: Estadísticas de columnas numéricas
# ---------------------------------------------------------------------------

def _process_numeric_cols(conn, table_name: str, cols: list, total_rows: int) -> tuple[dict, dict]:
    """Calcula mu/sigma de cols numéricas usando Welford. Retorna (stats_dict, omitted_pct_dict)."""
    accum   = {col: WelfordAccumulator() for col in cols}
    omitted = {col: 0 for col in cols}

    query = f"SELECT {', '.join(cols)} FROM {table_name}"
    cursor = conn.cursor()
    cursor.execute(query)

    while True:
        rows = cursor.fetchmany(CHUNK_SIZE)
        if not rows:
            break
        for row in rows:
            for i, col in enumerate(cols):
                fval = _clean_float(row[i])
                if fval is None:
                    omitted[col] += 1
                else:
                    accum[col].update(fval)

    stats_out   = {}
    omitted_out = {}

    for col in cols:
        res = accum[col].result()
        stats_out[col]   = {"mu": res["mu"], "sigma": res["sigma"], "n": res["n"]}
        omitted_out[col] = (omitted[col] / total_rows * 100) if total_rows > 0 else 0.0
        print(f"    - {col}: mu={res['mu']:.4f}, sigma={res['sigma']:.4f}, "
              f"n={res['n']:,}, omitidos={omitted_out[col]:.2f}%")

    return stats_out, omitted_out


# ---------------------------------------------------------------------------
# Sección 2: Estadísticas de diferencias de fechas (velocidad de adjudicacion)
# ---------------------------------------------------------------------------

def _process_date_delta(conn, table_name: str, cfg: dict, total_rows: int) -> tuple[dict, dict]:
    """
    Calcula mu/sigma de la diferencia (col_end - col_start) en días.
    Estrategia: Welford sobre las diferencias parseadas correctamente.
    """
    col_start   = cfg["col_start"]
    col_end     = cfg["col_end"]
    stat_name   = cfg["stat_name"]
    date_fmts   = cfg["date_formats"]

    accum   = WelfordAccumulator()
    omitted = 0

    query = f"SELECT {col_start}, {col_end} FROM {table_name}"
    cursor = conn.cursor()
    cursor.execute(query)

    while True:
        rows = cursor.fetchmany(CHUNK_SIZE)
        if not rows:
            break

        for row in rows:
            val_start, val_end = row[0], row[1]

            if not val_start or not val_end:
                omitted += 1
                continue

            dt_start = _try_parse_date(str(val_start), date_fmts)
            dt_end   = _try_parse_date(str(val_end), date_fmts)

            if dt_start is None or dt_end is None:
                omitted += 1
                continue

            delta_days = (dt_end - dt_start).days
            accum.update(float(delta_days))

    res = accum.result()
    omit_pct = (omitted / total_rows * 100) if total_rows > 0 else 0.0

    print(f"    - {stat_name}: mu={res['mu']:.2f} dias, sigma={res['sigma']:.2f} dias, "
          f"n={res['n']:,}, omitidos={omit_pct:.2f}%")

    stats_out   = {stat_name: {"mu": res["mu"], "sigma": res["sigma"], "n": res["n"]}}
    omitted_out = {stat_name: omit_pct}
    return stats_out, omitted_out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_global_statistics(
    config_path: str = "config.json",
    output_path: str = "global_statistics.json",
):
    print("[*] Generando estadisticas globales (pre-computo)...")
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    stats = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "table_shapes":       {},
        "numeric_stats":      {},
        "date_delta_stats":   {},
        "omitted_percentages": {},
    }

    db_paths = {
        "secopii_contratos": config.get("DB_PATH_CONTRATOS"),
        "secopii_invias":    config.get("DB_PATH_INVIAS"),
        "secopii_sanciones": config.get("DB_PATH_SANCIONES"),
        "secopii_users":     config.get("DB_PATH_CONTRATISTAS"),
        "secopii_procesos":  config.get("DB_PATH_PROCESOS"),
    }

    for table_name, db_path in db_paths.items():
        if not db_path or not os.path.exists(db_path):
            print(f"[-] Saltando {table_name}: {db_path} no encontrado.")
            continue

        print(f"\n[+] Procesando {table_name} @ {db_path}...")
        conn = sqlite3.connect(db_path)

        # ── Table shape ──────────────────────────────────────────────────────
        try:
            cur = conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM {table_name}")
            total_rows = cur.fetchone()[0]
        except sqlite3.OperationalError as e:
            print(f"    [!] Tabla no encontrada: {e}")
            conn.close()
            continue

        stats["table_shapes"][table_name] = total_rows
        print(f"    Total filas: {total_rows:,}")

        if total_rows == 0:
            conn.close()
            continue

        # ── Numeric columns ───────────────────────────────────────────────────
        if table_name in NUMERIC_COLUMNS:
            cols = NUMERIC_COLUMNS[table_name]
            s, o = _process_numeric_cols(conn, table_name, cols, total_rows)
            stats["numeric_stats"].setdefault(table_name, {}).update(s)
            stats["omitted_percentages"].setdefault(table_name, {}).update(o)
            gc.collect()

        # ── Date delta columns ────────────────────────────────────────────────
        if table_name in DATE_DELTA_CONFIG:
            cfg = DATE_DELTA_CONFIG[table_name]
            s, o = _process_date_delta(conn, table_name, cfg, total_rows)
            stats["date_delta_stats"].setdefault(table_name, {}).update(s)
            stats["omitted_percentages"].setdefault(table_name, {}).update(o)
            gc.collect()

        # ── Entity counts for x9 ──────────────────────────────────────────────
        if table_name == "secopii_procesos":
            print("    Calculando conteos por entidad (x9)...")
            cur = conn.cursor()
            cur.execute("SELECT nit_entidad, COUNT(*) FROM secopii_procesos GROUP BY nit_entidad")
            stats["entity_counts"] = {str(r[0]): int(r[1]) for r in cur.fetchall()}
            print(f"    - {len(stats['entity_counts']):,} entidades procesadas.")

        conn.close()

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=4)

    print(f"\n[*] {output_path} generado correctamente.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pre-cómputo de estadísticas globales SECOP II.")
    parser.add_argument("--config", default="config.json")
    parser.add_argument("--output", default="global_statistics.json")
    args = parser.parse_args()
    generate_global_statistics(args.config, args.output)
