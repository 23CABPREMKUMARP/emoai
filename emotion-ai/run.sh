#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo ""
    echo "Stopping Emotion AI..."
    [ -n "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null
    [ -n "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null
    
    # Extra cleanup to be sure
    LSOF_8000=$(lsof -t -i:8000)
    if [ -n "$LSOF_8000" ]; then
        kill -9 $LSOF_8000 2>/dev/null
    fi
    exit
}

trap cleanup SIGINT

echo "Starting Emotion AI System..."

# Pre-start Cleanup: Kill anything on our ports
echo "Cleaning up ports..."
PORT_8000=$(lsof -t -i:8000)
if [ -n "$PORT_8000" ]; then
    echo "Freeing port 8000..."
    kill -9 $PORT_8000 2>/dev/null
fi

PORT_5173=$(lsof -t -i:5173)
if [ -n "$PORT_5173" ]; then
    echo "Freeing port 5173..."
    kill -9 $PORT_5173 2>/dev/null
fi

# Determine Script Directory
BASE_DIR=$(pwd)

# Start Backend
echo "Initializing Backend (FastAPI)..."
cd "$BASE_DIR/backend"
python3 main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Start Frontend (Futuristic Landing Page)
echo "Initializing Futuristic Landing Page (React)..."
cd "$BASE_DIR/../emotion-landing-page"
if [ ! -d "node_modules" ]; then
    echo "Installing landing page dependencies..."
    npm install --silent
fi
npm run dev -- --host > "$BASE_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo "------------------------------------------------"
echo "✅ System Operational"
echo "📹 Backend API: http://localhost:8000"
echo "💻 Frontend UI: http://localhost:5173"
echo "📄 Logs stored in backend.log and frontend.log"
echo "------------------------------------------------"
echo "Press Ctrl+C to stop"

# Keep script running
wait
