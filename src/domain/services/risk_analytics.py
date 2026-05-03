import json
import os
import numpy as np
import pandas as pd
import scipy.stats as stats
from typing import List, Dict, Any, Optional

from src.application.ports.crud_port import (
    SecopContratistaPort, SecopContratoPort, SecopSancionPort, SecopInviasPort
)

class RiskAnalyticsService:
    def __init__(
        self,
        contratista_port: SecopContratistaPort,
        contrato_port: SecopContratoPort,
        sancion_port: SecopSancionPort,
        invias_port: SecopInviasPort,
        config_path: str = "config.json",
        stats_path: str = "global_statistics.json"
    ):
        self.contratista_port = contratista_port
        self.contrato_port = contrato_port
        self.sancion_port = sancion_port
        self.invias_port = invias_port
        
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = json.load(f)
            
        self.anomaly_thresholds = self.config.get("ANOMALY_THRESHOLDS", [1.0, 1.5, 2.0, 3.0])
        
        if os.path.exists(stats_path):
            with open(stats_path, 'r', encoding='utf-8') as f:
                self.global_stats = json.load(f)
        else:
            print("[!] Advertencia: global_statistics.json no encontrado. Operando de forma no optimizada.")
            self.global_stats = {"table_shapes": {}, "numeric_stats": {}}

    # Feature 1
    def tiene_sancion_previa(self, nit: str) -> list:
        """
        Retorna la lista de sanciones de una empresa basado en su NIT.
        Nota: SECOP I.
        """
        # La advertencia de SECOP I se imprimió en el puerto.
        return self.sancion_port.get_sanciones_by_nit(nit)

    # Feature 2
    def concentracion_de_contratos(self, nit: str) -> dict:
        """
        Calcula la proporción de contratos del NIT / totales. (O(1) para el denominador).
        """
        # Intentamos obtener el conteo de $O(1)$ de la cache global
        total_secop = self.global_stats.get("table_shapes", {}).get("secopii_contratos")
        if total_secop is None:
            total_secop = self.contrato_port.count_all()
            
        total_invias = self.global_stats.get("table_shapes", {}).get("secopii_invias")
        if total_invias is None:
            total_invias = self.invias_port.count_all()
        
        # O(log N) con indices
        nit_secop = self.contrato_port.count_by_nit(nit)
        nit_invias = self.invias_port.count_by_nit(nit)
        
        return {
            "secop_proporcion": nit_secop / total_secop if total_secop > 0 else 0.0,
            "invias_proporcion": nit_invias / total_invias if total_invias > 0 else 0.0
        }

    # Feature 3
    def concentracion_de_modalidad_de_contratacion(self, nit: str) -> dict:
        """
        Retorna la proporción de contratos por clase (modalidad) para el contratista.
        """
        contratos = self.contrato_port.get_by_nit(nit)
        if not contratos:
            return {}
            
        df = pd.DataFrame([vars(c) for c in contratos])
        if 'modalidad_de_contratacion' not in df.columns:
            return {}
            
        return df['modalidad_de_contratacion'].value_counts(normalize=True).to_dict()

    # Feature 4
    def Zscore_para_proporciones(self, proporcion: float, mu: float, sigma: float) -> float:
        if sigma == 0:
            return 0.0
        return (proporcion - mu) / sigma

    # Feature 5
    def Ztest(self, zscore: float) -> float:
        # P-valor de 2 colas
        return float(stats.norm.sf(abs(zscore)) * 2)

    # Feature 6
    def dias_desde_la_creacion(self, nit: str) -> int:
        user = self.contratista_port.get_by_nit(nit)
        if not user or not user.fecha_creacion:
            return -1
            
        try:
            dt = pd.to_datetime(user.fecha_creacion, format='mixed', dayfirst=False)
            return (pd.Timestamp.now() - dt).days
        except Exception:
            return -1

    def _clean_numeric(self, series: pd.Series) -> pd.Series:
        # Data Cleaning
        cleaned = series.astype(str).str.replace(',', '', regex=False).str.replace('$', '', regex=False).str.strip()
        return pd.to_numeric(cleaned, errors='coerce')

    # Feature 7
    def razon_de_anticipo(self, valor_del_contrato: float, valor_de_pago_adelantado: float) -> float:
        if valor_de_pago_adelantado and valor_de_pago_adelantado > 0:
            return valor_del_contrato / valor_de_pago_adelantado
        return 0.0

    def razon_de_anticipo_promedio(self, nit: str) -> float:
        contratos = self.contrato_port.get_by_nit(nit)
        if not contratos:
            return 0.0
            
        df = pd.DataFrame([vars(c) for c in contratos])
        if 'valor_del_contrato' not in df.columns or 'valor_de_pago_adelantado' not in df.columns:
            return 0.0
            
        val_contrato = self._clean_numeric(df['valor_del_contrato'])
        val_adelanto = self._clean_numeric(df['valor_de_pago_adelantado'])
        
        valid = (val_adelanto > 0) & (val_adelanto.notna()) & (val_contrato.notna())
        ratios = val_contrato[valid] / val_adelanto[valid]
        return float(ratios.mean()) if not ratios.empty else 0.0

    # Feature 8
    def razon_de_ejecucion(self, valor_pagado: float, valor_facturado: float) -> float:
        if valor_facturado and valor_facturado > 0:
            return valor_pagado / valor_facturado
        return 0.0

    def razon_de_ejecucion_promedio(self, nit: str) -> float:
        contratos = self.contrato_port.get_by_nit(nit)
        if not contratos:
            return 0.0
            
        df = pd.DataFrame([vars(c) for c in contratos])
        if 'valor_pagado' not in df.columns or 'valor_facturado' not in df.columns:
            return 0.0
            
        val_pagado = self._clean_numeric(df['valor_pagado'])
        val_facturado = self._clean_numeric(df['valor_facturado'])
        
        valid = (val_facturado > 0) & (val_facturado.notna()) & (val_pagado.notna())
        ratios = val_pagado[valid] / val_facturado[valid]
        return float(ratios.mean()) if not ratios.empty else 0.0

    # Feature 8.5
    def zscore_estandarizado(self, arr: List[float]) -> np.ndarray:
        return stats.zscore(arr)

    # Base for 9 and 10
    def _time_series_base(self, nit: str, column_val: Optional[str], sum_vals: bool = False):
        contratos = self.contrato_port.get_by_nit(nit)
        if not contratos:
            return None
            
        df = pd.DataFrame([vars(c) for c in contratos])
        if 'fecha_de_firma' not in df.columns:
            return None
            
        df['fecha_de_firma'] = pd.to_datetime(df['fecha_de_firma'], format='mixed', errors='coerce')
        df = df.dropna(subset=['fecha_de_firma']).set_index('fecha_de_firma')
        
        if df.empty:
            return None
            
        if sum_vals and column_val:
            if column_val not in df.columns:
                return None
            df[column_val] = self._clean_numeric(df[column_val])
            serie = df[column_val].resample('ME').sum().fillna(0)
        else:
            serie = df.resample('ME').size()
            
        # 1/(b-a) int f(x)dx => mean in discrete context
        promedio = serie.mean()
        # f'(x)
        derivada = serie.diff().fillna(0)
        
        mu_d = derivada.mean()
        sigma_d = derivada.std()
        if pd.isna(sigma_d):
            sigma_d = 0.0
            
        anomalias = {}
        for thresh in self.anomaly_thresholds:
            umbral_val = mu_d + (thresh * sigma_d)
            fechas_anomalas = derivada[derivada > umbral_val].index.strftime('%Y-%m').tolist()
            anomalias[str(thresh)] = fechas_anomalas
            
        # Formatting to str dates for dictionary
        serie_dict = {k.strftime('%Y-%m'): v for k, v in serie.to_dict().items()}
        deriv_dict = {k.strftime('%Y-%m'): v for k, v in derivada.to_dict().items()}
            
        return {
            "serie": serie_dict,
            "promedio": float(promedio),
            "derivada": deriv_dict,
            "mu_derivada": float(mu_d),
            "sigma_derivada": float(sigma_d),
            "anomalias": anomalias
        }

    # Feature 9
    def serie_de_tiempo_cantidad_contratos(self, nit: str) -> dict:
        res = self._time_series_base(nit, None, sum_vals=False)
        return res if res else {}

    # Feature 10
    def serie_de_tiempo_sum_valores(self, nit: str) -> dict:
        res = self._time_series_base(nit, 'valor_del_contrato', sum_vals=True)
        return res if res else {}
