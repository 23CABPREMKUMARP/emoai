# Emotion AI - Real-time Emotion Detection System

A production-ready AI application that detects human emotions from a live camera feed using deep learning. Built with a modern pink-themed UI, glassmorphism design, and real-time analytics.

## 🚀 Key Features

- **Real-time Face Detection**: Tracks faces with high accuracy.
- **Emotion Recognition**: Classifies Happy, Sad, Angry, Neutral, Surprise, Fear, Disgust.
- **Live Analytics**: Visual dashboard with emotion distribution percentiles.
- **Modern UI**: Pink gradient theme with glassmorphism effects.
- **Privacy First**: All processing is local; no images are stored.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Lucide Icons, Recharts, CSS Modules
- **Backend**: Python (FastAPI), OpenCV, FER (Deep Learning), Uvicorn
- **AI/ML**: TensorFlow/Keras based FER model

## 📂 Project Structure

```
/emotion-ai
├── backend/            # Python FastAPI Server
│   ├── main.py         # API Endpoints & Streaming
│   ├── camera.py       # Computer Vision Logic
│   └── requirements.txt
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── api.js      # API Client
│   │   └── index.css   # Styling (Pink Theme)
└── README.md
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1. Setup Backend

```bash
cd backend
pip install -r requirements.txt
# If using MTCNN (higher accuracy):
pip install mtcnn tensorflow
```

Run the server:
```bash
python main.py
# Server starts at http://localhost:8000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

## 📝 API Documentation

- `GET /video_feed`: MJPEG stream of processed video.
- `GET /current_emotion`: Returns JSON `{ emotion: "Happy", score: 0.95 }`.
- `GET /analytics`: Returns session statistics.

## 🎨 UI Customization

The theme is defined in `frontend/src/index.css` via CSS variables:
- `--primary-pink`: `#ff69b4`
- `--bg-gradient`: Linear gradient for background.

## 🔒 Logic & Privacy

- The system processes frames in memory.
- No video is saved to disk.
- Face data is discarded immediately after inference.

---
Developed for Advanced Emotion Detection Task.
