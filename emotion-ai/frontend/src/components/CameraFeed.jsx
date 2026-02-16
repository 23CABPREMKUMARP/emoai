import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

const CameraFeed = ({ onEmotionUpdate, customClass }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [initializing, setInitializing] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Load models on mount
    useEffect(() => {
        const loadModels = async () => {
            setInitializing(true);
            try {
                // Determine model URL based on environment
                const MODEL_URL = '/models';

                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                setIsModelLoaded(true);
                console.log("Models Loaded Successfully");
            } catch (err) {
                console.error("Failed to load models:", err);
                setError("Failed to load AI models. Please refresh.");
            }
            setInitializing(false);
        };
        loadModels();
    }, []);

    const startVideo = () => {
        setInitializing(true);
        navigator.mediaDevices
            .getUserMedia({ video: {} })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setInitializing(false);
            })
            .catch((err) => {
                console.error("Camera Error:", err);
                setError("Camera access denied.");
                setInitializing(false);
            });
    };

    const handleVideoPlay = () => {
        if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Ensure the video is ready
        if (video.readyState < 2) {
            video.addEventListener('loadeddata', handleVideoPlay);
            return;
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const interval = setInterval(async () => {
            if (video.paused || video.ended) return;

            try {
                // OPTIMIZATION: Lower inputSize (160/224) for much faster mobile inference
                const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

                const detections = await faceapi
                    .detectAllFaces(video, options)
                    .withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                // Clear canvas
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw detections
                faceapi.draw.drawDetections(canvas, resizedDetections);

                // Custom drawing for emotions or use default:
                // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

                if (detections.length > 0) {
                    const expressions = detections[0].expressions;
                    const dominant = Object.keys(expressions).reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );
                    const score = expressions[dominant];

                    // Draw custom label
                    const box = resizedDetections[0].detection.box;
                    const text = `${dominant} (${(score * 100).toFixed(0)}%)`;
                    const drawBox = new faceapi.draw.DrawBox(box, { label: text, boxColor: '#ec4899' });
                    drawBox.draw(canvas);

                    const capitalizedEmotion = dominant.charAt(0).toUpperCase() + dominant.slice(1);

                    // OPTIMIZATION: Throttle React state updates to prevent UI lag
                    // Only update Dashboard every 500ms
                    const now = Date.now();
                    if (onEmotionUpdate && (now - lastUpdateRef.current > 500)) {
                        onEmotionUpdate({
                            emotion: capitalizedEmotion,
                            score: score
                        });
                        lastUpdateRef.current = now;
                    }
                }
            } catch (err) {
                console.error("Detection Error:", err);
            }
        }, 100);

        return () => clearInterval(interval);
    };

    return (
        <div className={`relative w-full h-full overflow-hidden rounded-3xl bg-black ${customClass}`}>
            {/* Video Element */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline // Crucial for mobile
                onPlay={handleVideoPlay}
                className="absolute top-0 left-0 w-full h-full object-cover z-10"
            />

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full object-cover z-20 pointer-events-none"
            />

            {/* UI Overlays */}
            {(!isModelLoaded || initializing) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                    <p>{!isModelLoaded ? "Loading AI Models..." : "Starting Camera..."}</p>
                </div>
            )}

            {!videoRef.current?.srcObject && !initializing && isModelLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-gray-900/90">
                    <button
                        onClick={startVideo}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        Start Camera
                    </button>
                    {error && <p className="absolute bottom-10 text-red-400">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
