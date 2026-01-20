import random
from backend.llm import gemini_generate

CALM_RESPONSES = {
    "anger": [
        "It sounds like there’s a lot of frustration right now. You don’t have to deal with this alone.",
        "That sounds really overwhelming. I’m here with you, and we can slow things down.",
        "It’s okay to feel angry sometimes. You can take your time here."
    ],
    "sadness": [
        "It seems like things have been weighing on you. I’m here to listen.",
        "That sounds really heavy. You don’t have to carry it all by yourself.",
        "I’m really glad you shared this. You’re not alone in feeling this way."
    ],
    "anxiety": [
        "Your mind sounds really busy right now. Let’s slow this down together.",
        "That sounds stressful. Take a slow breath — you’re safe right now.",
        "It’s okay to feel anxious. We can take this one step at a time."
    ]
}

'''
def generate_response(mode, emotion, text):

    # NEVER let Gemini handle crisis
    if mode == "crisis":
        return (
            "I’m really glad you reached out. You don’t have to face this alone. "
            "Please consider reaching out to someone you trust or a professional."
        )

    prompt = f"""
You are a calm, supportive mental health companion.
Respond briefly, kindly, and non-judgmentally.

User emotion: {emotion}
User message: {text}

Assistant response:
"""

    try:
        return gemini_generate(prompt)
    except:
        return "I’m here with you. You can talk to me."
'''

def generate_response(mode, emotion, text):

    if mode == "crisis":
        return (
        "I’m really glad you reached out. You don’t have to face this alone. "
        "Please consider reaching out to someone you trust or a professional."
    )


    prompt = f"""
You are a calm, supportive mental health companion.
Respond kindly and empathetically in 2-3 sentences.

User emotion: {emotion}
User message: {text}

Respond kindly and empathetically in 2–3 sentences.

"""

    try:
        return gemini_generate(prompt)
    except Exception as e:
        print("Gemini failed:", e)
        return "I’m here with you. You can talk to me."








