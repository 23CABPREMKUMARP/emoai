from fastapi import FastAPI, Response, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import cv2
import json
import asyncio
from pydantic import BaseModel
from camera import VideoCamera

import google.generativeai as genai
import os
import importlib.metadata

# Gemini API Configuration

# Configure Gemini
# You can set this via environment variable or replace the string below
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

try:
    if GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("⚠️  Gemini API Key not set. Text analysis will likely fail or require key.")
        GEMINI_AVAILABLE = False
    else:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        GEMINI_AVAILABLE = True
        print("✅ Gemini API Configured")
except Exception as e:
    print(f"⚠️ Gemini Config Failed: {e}")
    GEMINI_AVAILABLE = False

app = FastAPI()

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"🔍 REQUEST: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class TextRequest(BaseModel):
    text: str

camera = None

def get_camera():
    global camera
    if camera is None:
        camera = VideoCamera()
    return camera

@app.get("/")
def read_root():
    return {"message": "Emotion AI Backend Running"}

def gen(camera):
    print("🎥 Generator: Started")
    try:
        while camera.is_capture_enabled:
            frame, _ = camera.get_frame()
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            else:
                import time
                time.sleep(0.1)
                if not camera.is_capture_enabled:
                    break
    except Exception as e:
        print(f"🎥 Generator Error: {e}")
    finally:
        print("🎥 Generator: Stopped")
        camera.stop()

@app.get("/video_feed")
def video_feed():
    print("📢 Request: /video_feed received")
    try:
        cam = get_camera()
        if cam.start():
            return StreamingResponse(gen(cam), media_type="multipart/x-mixed-replace; boundary=frame")
        else:
            return {"error": "Could not start camera"}
    except Exception as e:
        print(f"❌ Error in /video_feed: {e}")
        return {"error": str(e)}

@app.post("/stop_camera")
def stop_camera():
    global camera
    if camera:
        camera.stop()
    return {"message": "Camera session ended"}

@app.get("/analytics")
def get_analytics():
    cam = get_camera()
    return cam.get_analytics()

@app.get("/current_emotion")
def get_current_emotion():
    cam = get_camera()
    return {
        "emotion": cam.last_emotion,
        "score": cam.last_score
    }

@app.post("/analyze_text")
async def analyze_text_endpoint(request: TextRequest):
    if not GEMINI_AVAILABLE:
        # Fallback Mock logic if Gemini not configured
        return {
            "emotion": "Neutral",
            "score": 0.5,
            "breakdown": {"Neutral": 0.5, "Happy": 0.3},
            "error": "Gemini API Key Not Configured"
        }
    
    try:
        prompt = f"""
        Analyze the underlying emotion of this text: "{request.text}"
        
        Return a JSON object with:
        1. "emotion": The dominant emotion (Choose from: Happy, Sad, Angry, Fear, Surprise, Neutral)
        2. "score": A confidence score between 0.0 and 1.0
        3. "breakdown": A dictionary of suspected emotions and their probabilities.
        
        Example JSON:
        {{ "emotion": "Happy", "score": 0.9, "breakdown": {{ "Happy": 0.9, "Excitement": 0.1 }} }}
        """
        
        response = model.generate_content(prompt)
        text_response = response.text
        
        # simple cleaning
        clean_text = text_response.replace("```json", "").replace("```", "").strip()
        
        data = json.loads(clean_text)
        
        return data

    except Exception as e:
        print(f"Error in Gemini analysis: {e}")
        # Return fallback instead of crashing
        return {
            "emotion": "Neutral", 
            "score": 0.0, 
            "breakdown": {},
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
