import unittest
from unittest.mock import patch, MagicMock
import sqlite3
import os

from src.domain.models import SecopUser, SecopContrato, SecopSancion, SecopInvias
from src.infrastructure.adapters.sqlite_contratistas_crud import SQLiteSecopContratistaAdapter
from src.infrastructure.adapters.sqlite_contratos_crud import SQLiteSecopContratoAdapter
from src.infrastructure.adapters.sqlite_sanciones_crud import SQLiteSecopSancionAdapter
from src.infrastructure.adapters.sqlite_invias_crud import SQLiteSecopInviasAdapter

class TestHexagonalCruds(unittest.TestCase):
    def setUp(self):
        # Create in-memory connections to avoid polluting real database
        self.mem_conn_contratistas = sqlite3.connect(":memory:")
        self.mem_conn_contratos = sqlite3.connect(":memory:")
        self.mem_conn_sanciones = sqlite3.connect(":memory:")
        self.mem_conn_invias = sqlite3.connect(":memory:")
        
    def tearDown(self):
        self.mem_conn_contratistas.close()
        self.mem_conn_contratos.close()
        self.mem_conn_sanciones.close()
        self.mem_conn_invias.close()

    @patch("src.infrastructure.adapters.sqlite_contratistas_crud.SQLiteSecopContratistaAdapter._get_connection")
    def test_contratistas_crud(self, mock_get_conn):
        mock_get_conn.return_value = self.mem_conn_contratistas
        
        adapter = SQLiteSecopContratistaAdapter()
        adapter.create_table()
        
        user = SecopUser(codigo="USR123", nombre="Test User", nit="12345")
        adapter.insert(user)
        
        # Verify it was inserted
        cursor = self.mem_conn_contratistas.cursor()
        cursor.execute("SELECT nombre FROM secopii_users WHERE codigo='USR123'")
        self.assertEqual(cursor.fetchone()[0], "Test User")

    @patch("src.infrastructure.adapters.sqlite_contratos_crud.SQLiteSecopContratoAdapter._get_connection")
    def test_contratos_crud(self, mock_get_conn):
        mock_get_conn.return_value = self.mem_conn_contratos
        
        adapter = SQLiteSecopContratoAdapter()
        adapter.create_table()
        
        contrato = SecopContrato(id_contrato="CON123", nombre_entidad="Entidad Test")
        adapter.insert(contrato)
        
        cursor = self.mem_conn_contratos.cursor()
        cursor.execute("SELECT nombre_entidad FROM secopii_contratos WHERE id_contrato='CON123'")
        self.assertEqual(cursor.fetchone()[0], "Entidad Test")

    @patch("src.infrastructure.adapters.sqlite_sanciones_crud.SQLiteSecopSancionAdapter._get_connection")
    def test_sanciones_crud(self, mock_get_conn):
        mock_get_conn.return_value = self.mem_conn_sanciones
        
        adapter = SQLiteSecopSancionAdapter()
        adapter.create_table()
        
        sancion = SecopSancion(numero_de_contrato="SANC123", nit_entidad="999888")
        adapter.insert(sancion)
        
        results = adapter.get_sanciones_by_nit("999888")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].numero_de_contrato, "SANC123")

    @patch("src.infrastructure.adapters.sqlite_invias_crud.SQLiteSecopInviasAdapter._get_connection")
    def test_invias_crud(self, mock_get_conn):
        mock_get_conn.return_value = self.mem_conn_invias
        
        adapter = SQLiteSecopInviasAdapter()
        adapter.create_table()
        
        invias = SecopInvias(id_contrato="INV123", departamento="Bogota")
        adapter.insert(invias)
        
        cursor = self.mem_conn_invias.cursor()
        cursor.execute("SELECT departamento FROM secopii_invias WHERE id_contrato='INV123'")
        self.assertEqual(cursor.fetchone()[0], "Bogota")


class TestProcesosCrud(unittest.TestCase):
    def setUp(self):
        self.mem_conn = sqlite3.connect(":memory:")

    def tearDown(self):
        self.mem_conn.close()

    @patch("src.infrastructure.adapters.sqlite_procesos_crud.SQLiteSecopProcesoAdapter._get_connection")
    def test_procesos_insert_and_query_by_nit_proveedor(self, mock_get_conn):
        from src.domain.models import SecopProceso
        from src.infrastructure.adapters.sqlite_procesos_crud import SQLiteSecopProcesoAdapter

        mock_get_conn.return_value = self.mem_conn

        adapter = SQLiteSecopProcesoAdapter()
        adapter.create_table()

        proceso = SecopProceso(
            id_del_proceso="PROC-001",
            entidad="Gobernacion de Cundinamarca",
            nit_entidad="123456789",
            nit_del_proveedor_adjudicado="987654321",
            modalidad_de_contratacion="Licitacion Publica",
            valor_total_adjudicacion="5000000",
        )
        adapter.insert(proceso)

        # Verify by nit_proveedor (primary analytics axis)
        results = adapter.get_by_nit_proveedor("987654321")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id_del_proceso, "PROC-001")
        self.assertEqual(results[0].modalidad_de_contratacion, "Licitacion Publica")

        # Verify by nit_entidad (secondary axis)
        results_entidad = adapter.get_by_nit_entidad("123456789")
        self.assertEqual(len(results_entidad), 1)

        # Verify count_all
        self.assertEqual(adapter.count_all(), 1)

        # Verify counts
        self.assertEqual(adapter.count_by_nit_proveedor("987654321"), 1)
        self.assertEqual(adapter.count_by_nit_entidad("123456789"), 1)
        self.assertEqual(adapter.count_by_nit_proveedor("000000000"), 0)


if __name__ == '__main__':
    unittest.main()
