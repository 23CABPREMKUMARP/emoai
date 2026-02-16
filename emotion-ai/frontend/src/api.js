export const API_URL = "http://localhost:8000";

export const getAnalytics = async () => {
    try {
        const response = await fetch(`${API_URL}/analytics`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return null;
    }
};

export const getCurrentEmotion = async () => {
    try {
        const response = await fetch(`${API_URL}/current_emotion`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching emotion:", error);
        return null;
    }
};

export const getVideoFeedUrl = () => {
    return `${API_URL}/video_feed`;
};

export const stopCamera = async () => {
    try {
        await fetch(`${API_URL}/stop_camera`, { method: 'POST' });
    } catch (error) {
        console.error("Error stopping camera:", error);
    }
};
