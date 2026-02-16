import { useState, useEffect } from 'react';

// Client-side analytics state
const useAnalytics = (currentEmotion) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (currentEmotion) {
            setHistory(prev => {
                const newHistory = [...prev, currentEmotion.emotion];
                if (newHistory.length > 50) newHistory.shift(); // Keep last 50
                return newHistory;
            });
        }
    }, [currentEmotion]);

    const calculateStats = () => {
        if (history.length === 0) return null;

        const counts = history.reduce((acc, emo) => {
            acc[emo] = (acc[emo] || 0) + 1;
            return acc;
        }, {});

        const distribution = {};
        Object.keys(counts).forEach(key => {
            distribution[key] = counts[key] / history.length;
        });

        return {
            distribution,
            recent: history.slice(-20),
            total_frames: history.length
        };
    };

    return calculateStats();
};

export default useAnalytics;
