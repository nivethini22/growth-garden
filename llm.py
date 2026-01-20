'''
from transformers import pipeline

llm = pipeline(
    "text-generation",
    model="distilgpt2",
    max_new_tokens=60,
    do_sample=True,
    temperature=0.6,
    top_p=0.9,
    repetition_penalty=1.3,
    pad_token_id=50256
)

'''

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Create Gemini client with API key
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def gemini_generate(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )
    return response.text.strip()

