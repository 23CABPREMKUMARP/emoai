import cv2
import numpy as np
import time
import base64
import random
import threading

# Try to import FER, otherwise use mock
try:
    from fer import FER
    MODEL_LOADED = True
except ImportError:
    print("⚠️  Warning: FER library not found or failed to load. Running in MOCK mode.")
    MODEL_LOADED = False

class VideoCamera:
    def __init__(self):
        # Initialize video capture to None - will be opened on demand
        self.video = None
        self.is_capture_enabled = False
        self.lock = threading.Lock()
        self.frame = None
        self.success = False
        self.thread = None
        self.stop_event = threading.Event()
        self.active_users = 0
        
        if MODEL_LOADED:
            # Load FER model for emotion detection
            try:
                # Use Haar Cascade (mtcnn=False) by default for better real-time performance on CPU
                print("Loading FER model (Haar Cascade mode)...")
                self.detector = FER(mtcnn=False) 
            except Exception as e:
                print(f"⚠️  FER init failed ({e})")
                self.detector = None
        else:
            self.detector = None

        self.last_emotion = "Neutral"
        self.last_score = 0.0
        self.raw_emotions = []
        self.frame_count = 0
        self.last_detections = []
        self.last_release_time = 0
        
    def _capture_loop(self):
        """Background thread to capture frames constantly to avoid buffer lag."""
        print("🎥 AI System: Syncing with Hardware Sensor...")
        while not self.stop_event.is_set():
            # Safely get current video object
            with self.lock:
                cap = self.video
            
            if cap and cap.isOpened():
                try:
                    success, frame = cap.read()
                    if success:
                        with self.lock:
                            self.frame = frame
                            self.success = True
                    else:
                        with self.lock:
                            self.success = False
                except Exception as e:
                    print(f"⚠️ Capture Error: {e}")
                    break
            else:
                self.stop_event.wait(0.1)
            # Minimal sleep to keep loop tight but not 100% CPU
            time.sleep(0.005)
        print("🎥 AI System: Sensor Sync Stopped.")

    def start(self):
        """Increment user count and ensure camera is open with cooldown protection."""
        with self.lock:
            # Enforce 1 second cooldown to let OS drivers stabilize
            time_since_release = time.time() - self.last_release_time
            if time_since_release < 1.0:
                print(f"⏳ AI System: Throttling request (Cooldown: {1.0-time_since_release:.1f}s)")
                time.sleep(1.0 - time_since_release)

            self.active_users += 1
            self.is_capture_enabled = True
            
            if self.video is None or not self.video.isOpened():
                print(f"🚀 AI System: Initializing Camera Hardware (Users: {self.active_users})...")
                # Try multiple indices if 0 fails
                for index in [0, 1]:
                    # Use AVFOUNDATION backend explicitly if on Mac
                    self.video = cv2.VideoCapture(index)
                    if self.video.isOpened():
                        self.video.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                        self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                        print(f"✅ AI System: Sensor active on index {index}")
                        
                        self.frame = None
                        self.success = False
                        self.stop_event.clear()
                        
                        self.thread = threading.Thread(target=self._capture_loop, daemon=True)
                        self.thread.start()
                        
                        time.sleep(0.3) # Wait for hardware stabilization
                        return True
                    else:
                        if self.video:
                            self.video.release()
                
                print("❌ AI System Error: Physical device missing or blocked.")
                return False
            else:
                print(f"🛰️ AI System: Attaching to existing stream (Users: {self.active_users})")
                return True

    def stop(self):
        """Decrement user count and release only if no one is watching."""
        # Wait a moment for any pending generator iterations to finish their get_frame call
        time.sleep(0.05)
        
        with self.lock:
            if self.active_users > 0:
                self.active_users -= 1
            
            print(f"📉 AI System: User disconnected. (Remaining: {self.active_users})")
            
            if self.active_users == 0:
                print("💤 AI System: Releasing Hardware Resources...")
                self.is_capture_enabled = False
                self.stop_event.set()
                
                # IMPORTANT: Wait for thread to finish before releasing hardware
                if self.thread:
                    temp_thread = self.thread
                    self.thread = None
                    # Join outside lock would be better but we need to ensure no one else starts
                    # while we are killing it. 
                    temp_thread.join() # Ensure the thread is dead before releasing hardware
                
                if self.video and self.video.isOpened():
                    self.video.release()
                
                self.video = None
                self.last_release_time = time.time()
                print("✅ AI System: Hardware released successfully.")

    def get_frame(self):
        # We assume start() has been called
        if not self.is_capture_enabled or self.video is None:
            return None, None
            
        frame = None
        with self.lock:
            if not self.success or self.frame is None:
                return None, None
            frame = self.frame.copy()
            
        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        self.frame_count += 1
        
        # Performance optimization: Run detection every 7th frame
        if self.frame_count % 7 == 0:
            try:
                if MODEL_LOADED and self.detector:
                    detect_frame = cv2.resize(frame, (0, 0), fx=0.4, fy=0.4)
                    raw_detections = self.detector.detect_emotions(detect_frame)
                    
                    self.last_detections = []
                    for det in raw_detections:
                        box = det['box']
                        scaled_box = [int(b * 2.5) for b in box] # 1/0.4 = 2.5
                        det['box'] = scaled_box
                        self.last_detections.append(det)
                else:
                    if random.random() < 0.05 or not hasattr(self, 'mock_emotion'): 
                         self.mock_emotion = random.choice(["Happy", "Happy", "Neutral", "Surprise", "Angry"])
                    
                    h, w, _ = frame.shape
                    center_box = [int(w/2)-100, int(h/2)-100, 200, 200]
                    self.last_detections = [{
                        "box": center_box,
                        "emotions": {getattr(self, 'mock_emotion', 'Happy'): 0.88 + random.random()*0.1}
                    }]
            except Exception as e:
                print(f"Error in detection: {e}")
                self.last_detections = []
        
        detections = self.last_detections

        emotion_data = {}
        if detections:
            primary_face = max(detections, key=lambda x: x['box'][2] * x['box'][3])
            box = primary_face['box']
            emotions = primary_face['emotions']
            dominant_emotion = max(emotions, key=emotions.get)
            score = emotions[dominant_emotion]
            
            self.last_emotion = dominant_emotion
            self.last_score = score
            self.raw_emotions.append({"timestamp": time.time(), "emotion": dominant_emotion, "score": score})
            
            emotion_data = {"emotion": dominant_emotion, "score": float(score), "box": box}

            cv2.rectangle(frame, (box[0], box[1]), (box[0]+box[2], box[1]+box[3]), (254, 242, 0), 2)
            label = f"{dominant_emotion}: {score:.2f}"
            cv2.putText(frame, label, (box[0], box[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (254, 242, 0), 2)

        # High-performance encoding
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
        ret, jpeg = cv2.imencode('.jpg', frame, encode_param)
        return jpeg.tobytes(), emotion_data

    def get_analytics(self):
        if not self.raw_emotions:
            return {}
        import pandas as pd
        df = pd.DataFrame(self.raw_emotions)
        counts = df['emotion'].value_counts(normalize=True).to_dict()
        recent = df.tail(20)['emotion'].tolist()
        return {
            "distribution": counts,
            "recent": recent,
            "total_frames": len(df)
        }
