import React, { useEffect, useState, useRef } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { getVideoFeedUrl, getCurrentEmotion, stopCamera } from '../api';

const CameraFeed = ({ onEmotionUpdate, customClass }) => {
    const [isActive, setIsActive] = useState(false);
    const [feedUrl, setFeedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            setFeedUrl(getVideoFeedUrl());
            intervalRef.current = setInterval(async () => {
                const data = await getCurrentEmotion();
                if (data && onEmotionUpdate) {
                    onEmotionUpdate(data);
                }
            }, 500);
        } else {
            setFeedUrl('');
            if (intervalRef.current) clearInterval(intervalRef.current);
            stopCamera();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, onEmotionUpdate]);

    const toggleCamera = () => {
        if (isActive) {
            setIsActive(false);
        } else {
            setLoading(true);
            setTimeout(() => {
                setIsActive(true);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className={`flex flex-col items-center w-full h-full transition-all duration-500 ${customClass || ''}`}>
            <div className="relative w-full h-full bg-gray-900/5 overflow-hidden rounded-3xl flex items-center justify-center border border-white/20 shadow-inner group">
                {isActive ? (
                    <img
                        src={feedUrl}
                        alt="Live Camera Feed"
                        className="w-full h-full object-cover"
                        onError={() => setIsActive(false)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <div className="w-24 h-24 bg-pink-100/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Camera size={40} className="text-pink-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-pink-900/70 mb-2">Camera is Off</h3>
                        <p className="text-pink-800/40 font-medium">Activate detection to start the magic</p>
                    </div>
                )}

                {/* Floating Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={toggleCamera}
                        className={`
                            flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-2xl backdrop-blur-xl transition-all transform hover:scale-105 active:scale-95
                            ${isActive
                                ? 'bg-red-500/90 hover:bg-red-600 border border-red-400/50 shadow-red-500/30'
                                : 'bg-gradient-to-r from-pink-600 to-purple-600 border border-white/30 shadow-purple-500/30'}
                        `}
                    >
                        <Camera size={20} className={isActive ? "animate-pulse" : ""} />
                        <span>{isActive ? "Stop Stream" : "Start Camera"}</span>
                    </button>
                </div>

                {/* Always visible toggle hint if inactive */}
                {!isActive && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                        <button
                            onClick={toggleCamera}
                            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-2xl backdrop-blur-xl bg-gradient-to-r from-pink-600 to-purple-600 border border-white/30 shadow-purple-500/30 animate-bounce-subtle"
                        >
                            <Camera size={20} />
                            <span>Start Camera</span>
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-lg z-30">
                        <RefreshCw size={40} className="text-pink-600 animate-spin mb-4" />
                        <span className="text-pink-900 font-bold tracking-widest text-sm uppercase">Initializing AI Module...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraFeed;
