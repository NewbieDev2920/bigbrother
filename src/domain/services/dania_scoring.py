"""
dania_scoring.py
----------------
Implementación estricta y optimizada del Índice Dania según especificación.
"""

from __future__ import annotations

import json
import math
import os
import sqlite3
from typing import Optional, List

import numpy as np
import pandas as pd

from src.application.ports.crud_port import (
    SecopContratistaPort,
    SecopContratoPort,
    SecopSancionPort,
    SecopInviasPort,
    SecopProcesoPort,
)

# ---------------------------------------------------------------------------
# Constantes del modelo
# ---------------------------------------------------------------------------

NUM_FEATURES = 11
_WEIGHT_KEYS = [
    "x1_sanciones",
    "x2_concentracion_contratos",
    "x3_max_modalidad",
    "x4_dias_desde_creacion",
    "x5_razon_anticipo",
    "x6_razon_ejecucion",
    "x7_max_log_growth_count",
    "x8_max_log_growth_value",
    "x9_max_concentracion_entidad_proveedor",
    "x10_velocidad_adjudicacion_dias",
    "x11_prob_ganar_adjudicacion",
]

# ─────────────────────────────────────────────────────────────────────────────
# Normalización y Limpieza
# ─────────────────────────────────────────────────────────────────────────────

def normalize_nit(nit: str) -> str:
    """Estandariza el NIT eliminando puntos, comas y guiones."""
    if not nit: return ""
    return str(nit).replace(".", "").replace(",", "").replace("-", "").strip()

def clean_value(val) -> float:
    """Limpia strings de moneda/números a float."""
    if val is None or val == "": return 0.0
    try:
        s = str(val).replace("$", "").replace(",", "").strip()
        return float(s)
    except:
        return 0.0

# ─────────────────────────────────────────────────────────────────────────────
# Servicio DaniaScoringService
# ─────────────────────────────────────────────────────────────────────────────

class DaniaScoringService:
    def __init__(
        self,
        contratista_port: SecopContratistaPort,
        contrato_port:    SecopContratoPort,
        sancion_port:     SecopSancionPort,
        invias_port:      SecopInviasPort,
        proceso_port:     SecopProcesoPort,
        config_path: str = "config.json",
        stats_path:  str = "global_statistics.json",
    ):
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        if os.path.exists(stats_path):
            with open(stats_path, "r", encoding="utf-8") as f:
                self.global_stats = json.load(f)
        else:
            self.global_stats = {}

        # Pesos fijos según especificación (o desde config si existen)
        raw_weights = self.config.get("DANIA_WEIGHTS", {})
        default_weights = [1, 7, 3, 12, 14, 14, 10, 5, 12, 5, 11]
        self.weights = np.array([float(raw_weights.get(k, default_weights[i])) for i, k in enumerate(_WEIGHT_KEYS)])

        # Cargar mu y sigma para estandarización Z
        # Nota: Si no hay feature_stats en global_stats, usamos mu=0 sigma=1
        self._mu = np.zeros(NUM_FEATURES)
        self._sigma = np.ones(NUM_FEATURES)
        fs = self.global_stats.get("feature_stats", {})
        for i in range(NUM_FEATURES):
            key = f"x{i+1}"
            if key in fs:
                self._mu[i] = fs[key].get("mu", 0.0)
                self._sigma[i] = fs[key].get("sigma", 1.0)

        # Conexiones SQLite persistentes (Optimización O(log N))
        self.conns = {
            "contratos": sqlite3.connect(self.config["DB_PATH_CONTRATOS"], check_same_thread=False),
            "sanciones": sqlite3.connect(self.config["DB_PATH_SANCIONES"], check_same_thread=False),
            "procesos":  sqlite3.connect(self.config["DB_PATH_PROCESOS"], check_same_thread=False),
            "users":     sqlite3.connect(self.config["DB_PATH_CONTRATISTAS"], check_same_thread=False)
        }

    # ── Calculadores de Features Individuales ────────────────────────────────

    def _x1(self, nit: str) -> float:
        """x1: Cantidad de sanciones previas (sobre documento_contratista)."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["sanciones"].cursor()
        cur.execute(
            "SELECT COUNT(*) FROM secopii_sanciones WHERE REPLACE(REPLACE(documento_contratista, '-', ''), '.', '') = ?",
            (nit_norm,)
        )
        return float(cur.fetchone()[0])

    def _x2(self, nit: str) -> float:
        """x2: Concentración de contratos (count_nit / count_all)."""
        nit_norm = normalize_nit(nit)
        total = self.global_stats.get("table_shapes", {}).get("secopii_contratos") or 1
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT COUNT(*) FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?", (nit_norm,))
        count = cur.fetchone()[0]
        return float(count) / total

    def _x3(self, nit: str) -> float:
        """x3: Máxima concentración de modalidad."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute(
            "SELECT COUNT(*) as c FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ? GROUP BY modalidad_de_contratacion",
            (nit_norm,)
        )
        counts = [r[0] for r in cur.fetchall()]
        if not counts: return 0.0
        return float(max(counts)) / sum(counts)

    def _x4(self, nit: str) -> float:
        """x4: Días desde la creación (Columna NIT en mayúsculas)."""
        cur = self.conns["users"].cursor()
        # Intentar varias variantes de nombre de columna por temas de codificación
        possible_cols = ['"Fecha Creación"', '"Fecha Creacin"', '"Fecha Creacin"', 'Fecha_Creacion']
        for col in possible_cols:
            try:
                cur.execute(f"SELECT {col} FROM secopii_users WHERE NIT = ? LIMIT 1", (nit,))
                row = cur.fetchone()
                if row and row[0]:
                    dt = pd.to_datetime(row[0], errors='coerce', dayfirst=False)
                    if pd.notna(dt):
                        return float(max((pd.Timestamp.now() - dt).days, 0))
            except: continue
        return 0.0

    def _x5(self, nit: str) -> float:
        """x5: Razón de anticipo (mean(va / vc))."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute(
            "SELECT valor_del_contrato, valor_de_pago_adelantado FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?",
            (nit_norm,)
        )
        rows = cur.fetchall()
        ratios = []
        for vc_s, va_s in rows:
            vc = clean_value(vc_s)
            va = clean_value(va_s)
            if vc > 0: ratios.append(va / vc)
        return float(np.mean(ratios)) if ratios else 0.0

    def _x6(self, nit: str) -> float:
        """x6: Razón de ejecución (mean(vp / vf))."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute(
            "SELECT valor_pagado, valor_facturado FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ?",
            (nit_norm,)
        )
        rows = cur.fetchall()
        ratios = []
        for vp_s, vf_s in rows:
            vp = clean_value(vp_s)
            vf = clean_value(vf_s)
            if vf > 0: ratios.append(vp / vf)
        return float(np.mean(ratios)) if ratios else 0.0

    def _x7_x8(self, nit: str) -> tuple[float, float]:
        """x7 y x8: Crecimiento logarítmico de cantidad y valor."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute(
            "SELECT fecha_de_firma, valor_del_contrato FROM secopii_contratos WHERE REPLACE(nit_entidad, ',', '') = ? AND fecha_de_firma IS NOT NULL",
            (nit_norm,)
        )
        rows = cur.fetchall()
        if not rows: return 0.0, 0.0
        
        data = []
        for f, v in rows:
            dt = pd.to_datetime(f, errors='coerce', dayfirst=False)
            if pd.notna(dt):
                data.append({"fecha": dt, "val": clean_value(v)})
        
        if not data: return 0.0, 0.0
        df = pd.DataFrame(data).set_index("fecha").sort_index()
        # Remuestrear a mensual (ME = Month End)
        s_count = df.resample("ME").size().astype(float)
        s_val = df["val"].resample("ME").sum().fillna(0)
        
        def calc_growth(s, is_value=False):
            if len(s) < 2: return 0.0
            vals = s.values
            if is_value:
                # epsilon = P75 (P3) de la serie según especificación
                eps = max(float(np.percentile(vals, 75)) if np.any(vals > 0) else 1.0, 1.0)
            else:
                eps = 1.0
            lg = np.log((vals[1:] + eps) / (vals[:-1] + eps))
            return float(np.maximum(lg, 0).max())
            
        return calc_growth(s_count), calc_growth(s_val, True)

    def _x9(self, nit: str) -> float:
        """x9: Máxima concentración entidad-proveedor."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute(
            "SELECT COUNT(*) as c FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? GROUP BY nit_entidad",
            (nit_norm,)
        )
        counts = [r[0] for r in cur.fetchall()]
        if not counts: return 0.0
        return float(max(counts)) / sum(counts)

    def _x10(self, nit: str) -> float:
        """x10: Velocidad de adjudicación (días)."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute(
            "SELECT fecha_de_publicacion_del_proceso, fecha_adjudicacion FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? AND fecha_adjudicacion IS NOT NULL",
            (nit_norm,)
        )
        rows = cur.fetchall()
        deltas = []
        for pub, adj in rows:
            d_pub = pd.to_datetime(pub, errors='coerce')
            d_adj = pd.to_datetime(adj, errors='coerce')
            if pd.notna(d_pub) and pd.notna(d_adj):
                deltas.append((d_adj - d_pub).days)
        return float(np.mean(deltas)) if deltas else 0.0

    def _x11(self, nit: str) -> float:
        """x11: Probabilidad uniforme de ganar (1/nk)."""
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute(
            "SELECT proveedores_unicos_con_respuestas FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? AND proveedores_unicos_con_respuestas > 0",
            (nit_norm,)
        )
        inv_nks = [1.0/float(r[0]) for r in cur.fetchall() if r[0]]
        return float(np.mean(inv_nks)) if inv_nks else 0.0

    # ── Orquestación de Scoring ──────────────────────────────────────────────

    def score(self, nit: str) -> dict:
        """Calcula el vector de features y el Índice Dania final."""
        # 1. Calcular vector crudo x
        x = np.zeros(11)
        x[0] = self._x1(nit)
        x[1] = self._x2(nit)
        x[2] = self._x3(nit)
        x[3] = self._x4(nit)
        x[4] = self._x5(nit)
        x[5] = self._x6(nit)
        x[6], x[7] = self._x7_x8(nit)
        x[8] = self._x9(nit)
        x[9] = self._x10(nit)
        x[10] = self._x11(nit)

        # 2. Transformar a vector v para estandarización
        # v = (x1, x2, x3, 1/(x4+0.1), x5, x6, x7, x8, x9, 1/(x10+0.1), x11)
        v = x.copy()
        v[3] = 1.0 / (x[3] + 0.1)
        v[9] = 1.0 / (x[9] + 0.1)

        # 3. Estandarización Z
        sigma_safe = np.where(self._sigma == 0, 1.0, self._sigma)
        z = (v - self._mu) / sigma_safe
        z[10] = abs(z[10]) # Valor absoluto para x11 según especificación

        # 4. Scoring Lineal delta
        delta = float(np.dot(self.weights, z))

        # 5. Índice Dania (Softplus + Offset)
        # d = ln(1 + e^delta) + 0.03
        if delta > 500:
            dania = delta + 0.03
        else:
            dania = math.log1p(math.exp(delta)) + 0.03

        feature_labels = _WEIGHT_KEYS
        return {
            "nit": nit,
            "features_raw": dict(zip(feature_labels, x.tolist())),
            "features_v":   dict(zip(feature_labels, v.tolist())),
            "features_z":   dict(zip(feature_labels, z.tolist())),
            "delta":        delta,
            "indice_dania": dania
        }

    def __del__(self):
        if hasattr(self, 'conns'):
            for c in self.conns.values(): c.close()
