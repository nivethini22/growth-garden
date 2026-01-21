import sqlite3

def get_connection():
    conn = sqlite3.connect("database.db")
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # USERS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        age INTEGER,
        email TEXT,
        phone TEXT
    )
    """)

    # MOODS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        day TEXT,
        mood TEXT
    )
    """)

    # GROWTH GARDEN TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS garden (
        user_id INTEGER PRIMARY KEY,
        level INTEGER,
        plants INTEGER,
        flowers INTEGER,
        trees INTEGER
    )
    """)

    conn.commit()
    conn.close()
create_tables()