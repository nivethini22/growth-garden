from collections import defaultdict
from datetime import date
import sqlite3
import os

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "database.db")

# In-memory emotion accumulator
daily_emotions = defaultdict(list)

def track_emotion(user_id: int, emotion: str):
    today = str(date.today())
    daily_emotions[(user_id, today)].append(emotion)

def compute_daily_mood(user_id: int, day: str):
    emotions = daily_emotions.get((user_id, day), [])
    if not emotions:
        return None
    return max(set(emotions), key=emotions.count)

def save_daily_mood(user_id: int, day: str):
    mood = compute_daily_mood(user_id, day)
    if not mood:
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO moods (user_id, day, mood)
        VALUES (?, ?, ?)
        """,
        (user_id, day, mood)
    )

    conn.commit()
    conn.close()
