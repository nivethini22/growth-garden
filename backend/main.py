from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from backend.crisis import crisis_check
from backend.decision import decide
from backend.responder import generate_response
from transformers import pipeline
from backend.mood_tracker import track_emotion, save_daily_mood
from datetime import date, timedelta
import os

BASE_DIR = os.path.dirname(__file__)

emotion_model = pipeline(
    "text-classification",
    model=os.path.join(BASE_DIR, "..", "models", "emotion_model")
)

intent_model = pipeline(
    "text-classification",
    model=os.path.join(BASE_DIR, "..", "models", "intent_model")
)

app = FastAPI()

# -------------------------------------------------
# CORS
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for hackathon/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------
# DATABASE CONNECTION
# -------------------------------------------------

def get_db():
    return sqlite3.connect("database.db")

# -------------------------------------------------
# DATA MODELS
# -------------------------------------------------

# Auth
class SignUpRequest(BaseModel):
    username: str
    password: str
    age: int
    email: str
    phone: str

class SignInRequest(BaseModel):
    username: str
    password: str

# Chat
class ChatRequest(BaseModel):
    message: str
    user_id: int

# Mood Tracker
class MoodRequest(BaseModel):
    user_id: int
    day: str
    mood: str

# Growth Garden
class CalmSessionRequest(BaseModel):
    user_id: int
    completion_percent: int

# -------------------------------------------------
# ROOT
# -------------------------------------------------

@app.get("/")
def root():
    return {"message": "Backend running successfully"}

# -------------------------------------------------
# AUTH
# -------------------------------------------------

@app.post("/signup")
def signup(data: SignUpRequest):
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (username, password, age, email, phone)
            VALUES (?, ?, ?, ?, ?)
            """,
            (data.username, data.password, data.age, data.email, data.phone)
        )

        user_id = cursor.lastrowid

        cursor.execute(
            """
            INSERT INTO garden (user_id, level, plants, flowers, trees)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, 1, 0, 0, 0)
        )

        conn.commit()
        return {"message": "Signup successful", "user_id": user_id}

    except sqlite3.IntegrityError:
        return {"error": "Username already exists"}

    finally:
        conn.close()


@app.post("/signin")
def signin(data: SignInRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id FROM users
        WHERE username = ? AND password = ?
        """,
        (data.username, data.password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return {"message": "Signin successful", "user_id": user[0]}
    else:
        return {"error": "Invalid username or password"}

# -------------------------------------------------
# CHATBOT (NO STORAGE – PRIVACY FIRST)
# -------------------------------------------------

@app.post("/chat")
def chat(data: dict):
    text = data["message"]

    emotion_output = emotion_model(text)[0]
    emotion = emotion_output["label"]
    emotion_score = round(emotion_output["score"], 3)

    track_emotion(data["user_id"], emotion)
    yesterday = str(date.today() - timedelta(days=1))
    save_daily_mood(data["user_id"], yesterday)

    intent = intent_model(text)[0]["label"]
    crisis = crisis_check(text)

    mode = decide(intent, crisis, emotion)
    reply = generate_response(mode, emotion, text)

    return {
        "emotion": emotion,
        "emotion_score": emotion_score,
        "intent": intent,
        "mode": mode,
        "reply": reply
    }


# -------------------------------------------------
# MOOD TRACKER
# -------------------------------------------------

@app.post("/mood")
def save_mood(data: MoodRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO moods (user_id, day, mood)
        VALUES (?, ?, ?)
        """,
        (data.user_id, data.day, data.mood)
    )

    conn.commit()
    conn.close()

    return {"message": "Mood saved"}


@app.get("/moods/{user_id}")
def get_moods(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT day, mood FROM moods
        WHERE user_id = ?
        """,
        (user_id,)
    )

    moods = cursor.fetchall()
    conn.close()

    return [{"day": d, "mood": m} for d, m in moods]

# -------------------------------------------------
# GROWTH GARDEN
# -------------------------------------------------

@app.post("/calm-session")
def calm_session(data: CalmSessionRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT level, plants, flowers, trees
        FROM garden WHERE user_id = ?
        """,
        (data.user_id,)
    )

    level, plants, flowers, trees = cursor.fetchone()

    if data.completion_percent >= 80:
        trees += 1
    elif data.completion_percent >= 50:
        flowers += 1
    else:
        plants += 1

    level += 1

    if level % 5 == 0:
        plants += 5

    cursor.execute(
        """
        UPDATE garden
        SET level = ?, plants = ?, flowers = ?, trees = ?
        WHERE user_id = ?
        """,
        (level, plants, flowers, trees, data.user_id)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Garden updated",
        "garden": {
            "level": level,
            "plants": plants,
            "flowers": flowers,
            "trees": trees
        }
    }


@app.get("/garden/{user_id}")
def get_garden(user_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT level, plants, flowers, trees
        FROM garden WHERE user_id = ?
        """,
        (user_id,)
    )

    level, plants, flowers, trees = cursor.fetchone()
    conn.close()

    return {
        "level": level,
        "plants": plants,
        "flowers": flowers,
        "trees": trees
    }