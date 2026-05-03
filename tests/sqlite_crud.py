import sqlite3
import sqlite3

class CRUD_Cursor:

    def __init__(self, db_path):
        conn = sqlite3.connect(db_path)
        self.cursor = conn.cursor()

    def create(self, user_model):
        self.cursor.execute("")