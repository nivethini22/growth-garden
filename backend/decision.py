def decide(intent, crisis, emotion):
    if crisis:
        return "crisis"

    if intent == "seeking_advice":
        return "advice"

    if intent == "coping_help":
        return "coping"

    return "calm"
