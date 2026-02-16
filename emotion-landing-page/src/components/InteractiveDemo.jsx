import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import * as faceapi from 'face-api.js';

export default function InteractiveDemo() {
    const [isActive, setIsActive] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize Models
    useEffect(() => {
        const loadModels = async () => {
            setLoading(true);
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                setModelLoaded(true);
                setLoading(false);
            } catch (err) {
                console.error("Model Load Error:", err);
                setError("Failed to load AI models");
                setLoading(false);
            }
        };
        loadModels();
    }, []);

    const startCamera = async () => {
        setLoading(true);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsActive(true);
        } catch (err) {
            console.error(err);
            setError("Camera access denied");
        }
        setLoading(false);
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsActive(false);
        setCurrentEmotion(null);
    };

    const handleVideoPlay = () => {
        if (!videoRef.current || !canvasRef.current || !modelLoaded) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Wait for dimensions if not ready
        if (video.videoWidth === 0) {
            video.addEventListener('loadeddata', handleVideoPlay);
            return;
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const interval = setInterval(async () => {
            if (video.paused || video.ended) return;

            try {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw detection box
                faceapi.draw.drawDetections(canvas, resizedDetections);

                if (detections.length > 0) {
                    const expressions = detections[0].expressions;
                    const dominant = Object.keys(expressions).reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );

                    const capitalizedEmotion = dominant.charAt(0).toUpperCase() + dominant.slice(1);

                    setCurrentEmotion({
                        emotion: capitalizedEmotion,
                        score: expressions[dominant]
                    });
                }
            } catch (err) {
                // ignore frame errors
            }
        }, 100);

        return () => clearInterval(interval);
    };

    const toggleCamera = () => {
        if (isActive) stopCamera();
        else startCamera();
    };

    const getEmotionIcon = (emotion) => {
        const emo = emotion?.toLowerCase() || '';
        if (emo.includes('happy')) return <Smile className="w-4 h-4" />;
        if (emo.includes('sad') || emo.includes('angry')) return <Frown className="w-4 h-4" />;
        return <Meh className="w-4 h-4" />;
    };

    return (
        <section id="demo" className="py-24 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-pink/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary-violet/10 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                            Experience the <span className="neon-text">Precision</span> <br />
                            in Action
                        </h2>
                        <p className="text-white/60 text-lg mb-10 leading-relaxed">
                            Step into the world of AI-driven empathy. Our model doesn't just see pixels;
                            it understands the human story behind every micro-expression.
                            Try our interactive preview below to see how we map emotions in milliseconds.
                        </p>

                        <div className="space-y-6">
                            {[
                                { label: 'System Status', value: isActive ? 'Active' : 'Standby', color: isActive ? '#00f2fe' : 'rgba(255,255,255,0.1)' },
                                { label: 'Neural Accuracy', value: '98.4%', color: '#9d50bb' },
                                { label: 'Processing Latency', value: '24ms', color: '#ff2d95' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-1 h-px glass overflow-hidden flex-grow max-w-[100px]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? '100%' : '0%' }}
                                            className="h-full"
                                            style={{ backgroundColor: stat.color }}
                                        />
                                    </div>
                                    <span className="font-semibold">{stat.value}</span>
                                    <span className="text-white/40">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="relative group">
                            {/* Camera Frame */}
                            <div className="glass rounded-[2rem] p-4 relative overflow-hidden shadow-2xl">
                                <div className="aspect-video bg-black/40 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5">
                                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 glass rounded-full text-xs z-20">
                                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                                        {isActive ? 'LIVE PREVIEW' : 'CAMERA OFF'}
                                    </div>

                                    {/* Video & Canvas */}
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        onPlay={handleVideoPlay}
                                        className={`absolute inset-0 w-full h-full object-cover ${isActive ? '' : 'hidden'}`}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isActive ? '' : 'hidden'}`}
                                    />

                                    {isActive ? (
                                        <div className="w-full h-full relative pointer-events-none">
                                            {/* Detection Overlay */}
                                            <AnimatePresence>
                                                {currentEmotion && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        <div className="relative border-2 border-primary-neon/50 w-48 h-64 rounded-xl">
                                                            <div className="absolute -top-10 left-0 bg-primary-neon text-dark px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2 whitespace-nowrap shadow-lg">
                                                                {getEmotionIcon(currentEmotion.emotion)}
                                                                {currentEmotion.emotion.toUpperCase()} {(currentEmotion.score * 100).toFixed(0)}%
                                                            </div>
                                                            {/* Scanning Line Animation */}
                                                            <motion.div
                                                                animate={{ top: ['0%', '100%', '0%'] }}
                                                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                                className="absolute left-0 right-0 h-0.5 bg-primary-neon/50 shadow-[0_0_15px_rgba(0,242,254,0.8)]"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            {error ? (
                                                <>
                                                    <AlertCircle className="w-16 h-16 text-red-500/50" />
                                                    <p className="text-red-400 text-sm font-medium">{error}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-16 h-16 text-white/10" />
                                                    <p className="text-white/20 text-sm">Click Start Camera to begin</p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {loading && (
                                        <div className="absolute inset-0 glass flex flex-col items-center justify-center z-30">
                                            <RefreshCw className="w-10 h-10 text-primary-neon animate-spin mb-4" />
                                            <span className="text-xs font-bold tracking-widest text-primary-neon">INITIALIZING AI...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={toggleCamera}
                                            disabled={loading || (!modelLoaded && !isActive)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary-neon text-dark hover:bg-primary-neon/80 hover:shadow-primary-neon/30'}`}
                                        >
                                            {isActive ? <RefreshCw className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                            {isActive ? 'Stop Stream' : 'Start Camera'}
                                        </button>
                                        <button className="px-6 py-2 glass rounded-full font-semibold hover:bg-white/10 transition-colors hidden sm:block">
                                            View Analytics
                                        </button>
                                    </div>
                                    <div className="flex -space-x-3">
                                        {/* Emotion Indicators */}
                                        <div className={`w-10 h-10 rounded-full border-2 border-dark-bg transition-all flex items-center justify-center backdrop-blur-sm ${currentEmotion?.emotion?.toLowerCase() === 'happy' ? 'bg-primary-neon scale-110 z-10' : 'bg-primary-violet/20 grayscale'}`}>
                                            <Smile className="w-5 h-5" />
                                        </div>
                                        <div className={`w-10 h-10 rounded-full border-2 border-dark-bg transition-all flex items-center justify-center backdrop-blur-sm ${currentEmotion?.emotion?.toLowerCase() === 'neutral' ? 'bg-primary-neon scale-110 z-10' : 'bg-primary-violet/20 grayscale'}`}>
                                            <Meh className="w-5 h-5" />
                                        </div>
                                        <div className={`w-10 h-10 rounded-full border-2 border-dark-bg transition-all flex items-center justify-center backdrop-blur-sm ${currentEmotion?.emotion?.toLowerCase() === 'sad' ? 'bg-primary-neon scale-110 z-10' : 'bg-primary-violet/20 grayscale'}`}>
                                            <Frown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Accents */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 glass rounded-3xl -z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 glass rounded-full -z-10 group-hover:-translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
