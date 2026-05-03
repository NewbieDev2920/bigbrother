import sqlite3
import sqlite3
import pandas as pd
import json


path = None
with open("config.json", "r", encoding='utf-8') as f:
    jobject = json.load(f)
    path = jobject["DB_PATH"]

conn = sqlite3.connect(path)

cursor = conn.cursor()

cursor.execute("SELECT * FROM secopii_users WHERE nit = '1000445203'")

rows = cursor.fetchall()

print(rows)