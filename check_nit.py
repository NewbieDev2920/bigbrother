import sqlite3
import os

db_path = 'storage/secopii_contratistas.db'
nit = '79874340'

if not os.path.exists(db_path):
    print(f"DB not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute('SELECT NIT, Nombre FROM secopii_users WHERE NIT = ?', (nit,))
res = cur.fetchall()
print(f"Exact match for {nit}: {res}")

cur.execute('SELECT NIT, Nombre FROM secopii_users WHERE NIT LIKE ?', (f'%{nit}%',))
res = cur.fetchall()
print(f"Partial match for {nit}: {res}")

conn.close()
