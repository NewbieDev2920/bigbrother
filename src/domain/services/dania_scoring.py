"""
dania_scoring.py
----------------
Implementación corregida con soporte para fechas MM/DD/YYYY y nuevas fórmulas.
"""

from __future__ import annotations

import json
import math
import os
import sqlite3
from typing import Optional, List, Dict
from datetime import datetime

import numpy as np

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalize_nit(nit: str) -> str:
    if not nit: return ""
    return str(nit).replace(".", "").replace(",", "").replace("-", "").strip()

def clean_value(val) -> float:
    if val is None or val == "": return 0.0
    try:
        if isinstance(val, (int, float)): return float(val)
        s = str(val).replace("$", "").replace(",", "").strip()
        return float(s)
    except: return 0.0

def parse_secop_date(date_str: str) -> Optional[datetime]:
    """Parsea fechas en formato MM/DD/YYYY (común en SECOP II)."""
    if not date_str or not isinstance(date_str, str): return None
    try:
        # Intentar MM/DD/YYYY
        parts = date_str.split('/')
        if len(parts) == 3:
            # MM, DD, YYYY
            return datetime(int(parts[2]), int(parts[0]), int(parts[1]))
        # Fallback YYYY-MM-DD
        parts = date_str.split('-')
        if len(parts) == 3:
            return datetime(int(parts[0]), int(parts[1]), int(parts[2]))
    except:
        pass
    return None

NUM_FEATURES = 11
_WEIGHT_KEYS = [
    "x1_sanciones", "x2_concentracion_contratos", "x3_max_modalidad",
    "x4_dias_desde_creacion", "x5_razon_anticipo", "x6_razon_ejecucion",
    "x7_max_log_growth_count", "x8_max_log_growth_value",
    "x9_max_concentracion_entidad_proveedor", "x10_velocidad_adjudicacion_dias",
    "x11_prob_ganar_adjudicacion"
]

class DaniaScoringService:
    def __init__(
        self,
        contratista_port=None, contrato_port=None, sancion_port=None,
        invias_port=None, proceso_port=None,
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

        raw_weights = self.config.get("DANIA_WEIGHTS", {})
        default_weights = [1, 7, 3, 12, 14, 14, 10, 5, 12, 5, 11]
        self.weights = np.array([float(raw_weights.get(k, default_weights[i])) for i, k in enumerate(_WEIGHT_KEYS)])

        fs = self.global_stats.get("feature_stats", {})
        self._mu = np.zeros(NUM_FEATURES)
        self._sigma = np.ones(NUM_FEATURES)
        for i in range(NUM_FEATURES):
            key = f"x{i+1}"
            if key in fs:
                self._mu[i] = fs[key].get("mu", 0.0)
                self._sigma[i] = fs[key].get("sigma", 1.0)

        self.conns = {
            "contratos": sqlite3.connect(self.config["DB_PATH_CONTRATOS"], check_same_thread=False),
            "sanciones": sqlite3.connect(self.config["DB_PATH_SANCIONES"], check_same_thread=False),
            "procesos":  sqlite3.connect(self.config["DB_PATH_PROCESOS"], check_same_thread=False),
            "users":     sqlite3.connect(self.config["DB_PATH_CONTRATISTAS"], check_same_thread=False)
        }
        self.conns["users"].row_factory = sqlite3.Row
        self.entity_counts: Dict[str, int] = self.global_stats.get("entity_counts", {})

    # ── Features ─────────────────────────────────────────────────────────────

    def _x1(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["sanciones"].cursor()
        cur.execute("SELECT COUNT(*) FROM secopii_sanciones WHERE REPLACE(REPLACE(documento_contratista, '-', ''), '.', '') = ?", (nit_norm,))
        return float(cur.fetchone()[0])

    def _x2(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        total = self.global_stats.get("table_shapes", {}).get("secopii_contratos") or 1
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT COUNT(*) FROM secopii_contratos WHERE REPLACE(documento_proveedor, ',', '') = ?", (nit_norm,))
        return float(cur.fetchone()[0]) / total

    def _x3(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT COUNT(*) FROM secopii_contratos WHERE REPLACE(documento_proveedor, ',', '') = ? GROUP BY modalidad_de_contratacion", (nit_norm,))
        counts = [r[0] for r in cur.fetchall()]
        if not counts: return 0.0
        return float(max(counts)) / sum(counts)

    def _x4(self, nit: str) -> float:
        cur = self.conns["users"].cursor()
        cur.execute("SELECT \"Fecha Creación\" FROM secopii_users WHERE NIT = ? LIMIT 1", (nit,))
        row = cur.fetchone()
        if row and row[0]:
            dt = parse_secop_date(row[0])
            if dt: return float(max((datetime.now() - dt).days, 0))
        return 0.0

    def _x5(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT valor_del_contrato, valor_de_pago_adelantado FROM secopii_contratos WHERE REPLACE(documento_proveedor, ',', '') = ?", (nit_norm,))
        ratios = []
        for vc_s, va_s in cur.fetchall():
            vc = clean_value(vc_s); va = clean_value(va_s)
            if vc > 0: ratios.append(va / vc)
        return float(np.mean(ratios)) if ratios else 0.0

    def _x6(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT valor_pagado, valor_facturado FROM secopii_contratos WHERE REPLACE(documento_proveedor, ',', '') = ?", (nit_norm,))
        ratios = []
        for vp_s, vf_s in cur.fetchall():
            vp = clean_value(vp_s); vf = clean_value(vf_s)
            if vf > 0: ratios.append(vp / vf)
        return float(np.mean(ratios)) if ratios else 0.0

    def _x7_x8(self, nit: str) -> tuple[float, float]:
        nit_norm = normalize_nit(nit)
        cur = self.conns["contratos"].cursor()
        cur.execute("SELECT fecha_de_firma, valor_del_contrato FROM secopii_contratos WHERE REPLACE(documento_proveedor, ',', '') = ? AND fecha_de_firma IS NOT NULL", (nit_norm,))
        rows = cur.fetchall()
        if not rows: return 0.0, 0.0
        monthly_counts = {}; monthly_values = {}
        for f_s, v_s in rows:
            dt = parse_secop_date(f_s)
            if dt:
                m_key = dt.strftime("%Y-%m")
                monthly_counts[m_key] = monthly_counts.get(m_key, 0) + 1
                monthly_values[m_key] = monthly_values.get(m_key, 0.0) + clean_value(v_s)
        if not monthly_counts: return 0.0, 0.0
        
        sorted_m = sorted(monthly_counts.keys())
        counts = [float(monthly_counts[m]) for m in sorted_m]
        values = [monthly_values[m] for m in sorted_m]
        
        def calc_growth(v_list, eps=1.0):
            if len(v_list) < 2: return 0.0
            v = np.array(v_list)
            lg = np.log((v[1:] + eps) / (v[:-1] + eps))
            return float(max(np.max(lg), 0.0))
        
        eps_v = max(float(np.percentile(values, 75)) if np.any(np.array(values) > 0) else 1.0, 1.0)
        return calc_growth(counts, 1.0), calc_growth(values, eps_v)

    def _x9(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute("SELECT nit_entidad, COUNT(*) FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? GROUP BY nit_entidad", (nit_norm,))
        max_ratio = 0.0
        for ent_nit, cnt_i in cur.fetchall():
            total_e = self.entity_counts.get(str(ent_nit), 0)
            if total_e > 0: max_ratio = max(max_ratio, cnt_i / total_e)
        return float(max_ratio)

    def _x10(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute("SELECT fecha_de_publicacion_del_proceso, fecha_adjudicacion FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? AND fecha_adjudicacion IS NOT NULL AND fecha_de_publicacion_del_proceso IS NOT NULL", (nit_norm,))
        deltas = []
        for pub_s, adj_s in cur.fetchall():
            d_pub = parse_secop_date(pub_s); d_adj = parse_secop_date(adj_s)
            if d_pub and d_adj: deltas.append((d_adj - d_pub).days)
        return float(min(deltas)) if deltas else 0.0

    def _x11(self, nit: str) -> float:
        nit_norm = normalize_nit(nit)
        cur = self.conns["procesos"].cursor()
        cur.execute("SELECT 1.0/proveedores_unicos_con_respuestas FROM secopii_procesos WHERE REPLACE(nit_del_proveedor_adjudicado, ',', '') = ? AND proveedores_unicos_con_respuestas > 0", (nit_norm,))
        inv_nks = [r[0] for r in cur.fetchall()]
        return float(np.mean(inv_nks)) if inv_nks else 0.0

    # ── Scoring ──────────────────────────────────────────────────────────────

    def _calculate_score(self, nit: str):
        x = np.zeros(11)
        x[0] = self._x1(nit); x[1] = self._x2(nit); x[2] = self._x3(nit); x[3] = self._x4(nit)
        x[4] = self._x5(nit); x[5] = self._x6(nit); x[6], x[7] = self._x7_x8(nit)
        x[8] = self._x9(nit); x[9] = self._x10(nit); x[10] = self._x11(nit)
        
        # Transform features
        v = np.zeros(11)
        v[0] = x[0]
        v[1] = x[1]
        v[2] = x[2]
        v[3] = 1.0 / (x[3] + 0.1)
        v[4] = x[4] 
        v[5] = 1.0 / (x[5]**2 + 0.001) # Razon Ejecucion especificada por usuario
        v[6] = x[6]
        v[7] = x[7]
        v[8] = x[8]
        v[9] = 1.0 / (x[9] + 0.1)
        v[10] = x[10]
        
        sigma_safe = np.where(self._sigma == 0, 1.0, self._sigma)
        z = (v - self._mu) / sigma_safe
        z[10] = abs(z[10])
        
        delta = float(np.dot(self.weights, z))
        dania = math.log1p(math.exp(delta)) + 0.03 if delta <= 500 else delta + 0.03
        riesgo = "alto" if dania >= 0.7 else "medio" if dania >= 0.3 else "bajo"
        
        return dict(zip(_WEIGHT_KEYS, x.tolist())), delta, dania, riesgo

    def get_company_info(self, nit: str):
        nit_clean = nit.replace(".", "").replace(",", "").replace("-", "").strip()
        # Use the users connection from self.conns
        cur = self.conns["users"].cursor()
        cur.execute("SELECT * FROM secopii_users WHERE NIT = ?", (nit_clean,))
        row = cur.fetchone()
        if not row:
            cur.execute("SELECT * FROM secopii_users WHERE NIT LIKE ?", (f"%{nit_clean}%",))
            row = cur.fetchone()
        
        if row:
            # Handle Row object
            return {k: row[k] for k in row.keys() if k != 'index'}
        return None

    def score(self, nit: str):
        # 1. Get features and score
        vector_x, delta, d, riesgo = self._calculate_score(nit)
        
        # 2. Get company info
        company_info = self.get_company_info(nit)
        
        return {
            "nit": nit,
            "vector_x": vector_x,
            "delta": delta,
            "d": d,
            "riesgo": riesgo,
            "company_info": company_info
        }

    def __del__(self):
        if hasattr(self, 'conns'):
            for c in self.conns.values():
                try:
                    c.close()
                except:
                    pass
