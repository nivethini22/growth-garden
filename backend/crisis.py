CRISIS_KEYWORDS = [
    "kill myself",
    "hurt myself",
    "end my life",
    "want to die",
    "can't go on",
    "don't want to live"
]

def crisis_check(text: str) -> bool:
    text = text.lower()
    return any(k in text for k in CRISIS_KEYWORDS)
