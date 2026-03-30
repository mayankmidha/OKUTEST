from fastapi import FastAPI, Request
from pydantic import BaseModel
import random

app = FastAPI()

class ChatInput(BaseModel):
    message: str
    user_id: str = "anonymous"

CRISIS_RESOURCES = [
    "I hear that things are very heavy right now. Please know you are not alone.",
    "If you are in immediate danger, please reach out to AASRA (India): +91-9820466726 or Vandrevala Foundation: 1860 2662 345.",
    "Let's try a grounding exercise together. Can you name 5 things you can see right now?",
    "Your safety is the most important thing. I am an AI, but there are humans ready to hold space for you."
]

GROUNDING_TECHNIQUES = [
    "Focus on your breath. Breathe in for 4 counts, hold for 4, and exhale for 6.",
    "Press your feet firmly into the floor. Feel the support of the earth beneath you.",
    "Can you find 3 things you can hear in this moment?"
]

@app.post("/api/python/crisis-support")
async def get_crisis_support(data: ChatInput):
    msg = data.message.lower()
    
    # Advanced reasoning simulation for emergency detection
    keywords = ["hurt", "end", "suicide", "kill", "die", "alone", "help", "emergency"]
    is_crisis = any(k in msg for k in keywords)
    
    if is_crisis:
        response = random.choice(CRISIS_RESOURCES)
    else:
        response = random.choice(GROUNDING_TECHNIQUES)
        
    return {
        "status": "monitored",
        "response": response,
        "is_crisis": is_crisis,
        "advice": "This is a safe space. Take your time."
    }
