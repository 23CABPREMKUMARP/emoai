import React, { useEffect, useState } from 'react';

const EmotionDialog = ({ emotion, score }) => {
    const [animateKey, setAnimateKey] = useState(0);

    // Reset animation when emotion changes
    useEffect(() => {
        setAnimateKey(prev => prev + 1);
    }, [emotion]);

    const getEmotionConfig = (emo) => {
        switch (emo) {
            case 'Happy': return {
                emoji: '😄',
                color: 'from-green-400 to-green-600',
                shadow: 'shadow-green-500/50',
                anim: 'anim-bounce',
                text: 'Radiating Positivity!'
            };
            case 'Sad': return {
                emoji: '😢',
                color: 'from-blue-400 to-blue-600',
                shadow: 'shadow-blue-500/50',
                anim: 'anim-float',
                text: 'Feeling Down?'
            };
            case 'Angry': return {
                emoji: '😡',
                color: 'from-red-500 to-red-700',
                shadow: 'shadow-red-500/50',
                anim: 'anim-shake',
                text: 'Intense Energy here'
            };
            case 'Surprise': return {
                emoji: '😲',
                color: 'from-yellow-400 to-orange-500',
                shadow: 'shadow-orange-500/50',
                anim: 'anim-pop',
                text: 'Wow! Unexpected!'
            };
            case 'Fear': return {
                emoji: '😨',
                color: 'from-purple-600 to-indigo-800',
                shadow: 'shadow-indigo-500/50',
                anim: 'pulse',
                text: 'Spooky Vibes...'
            };
            case 'Neutral': return {
                emoji: '😐',
                color: 'from-gray-400 to-gray-600',
                shadow: 'shadow-gray-500/50',
                anim: '',
                text: 'Calm & Composed'
            };
            default: return {
                emoji: '🤔',
                color: 'from-pink-400 to-pink-600',
                shadow: 'shadow-pink-500/50',
                anim: '',
                text: 'Analyzing...'
            };
        }
    };

    const config = getEmotionConfig(emotion);

    return (
        <div key={animateKey} className="w-full max-w-lg mx-auto transform perspective-1000">
            <div className={`
                relative overflow-hidden
                bg-gradient-to-br ${config.color} 
                rounded-3xl p-1 
                shadow-2xl ${config.shadow}
                anim-pop
                transition-all duration-500
            `}>
                {/* Glass Effect Overlay */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[20px] p-6 h-full flex items-center gap-6 relative z-10">

                    {/* Animated Emoji Circle */}
                    <div className={`
                        w-24 h-24 flex-shrink-0 
                        bg-gradient-to-tr ${config.color} 
                        rounded-full flex items-center justify-center 
                        text-5xl shadow-lg border-4 border-white
                        ${config.anim}
                    `}>
                        {config.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Detected Emotion</h3>
                                <h1 className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${config.color}`}>
                                    {emotion}
                                </h1>
                                <p className="text-gray-500 text-sm mt-1 font-medium italic">"{config.text}"</p>
                            </div>

                            {/* Confidence Gauge */}
                            <div className="text-right">
                                <div className="text-3xl font-black text-gray-800">
                                    {(score * 100).toFixed(0)}<span className="text-lg text-gray-400">%</span>
                                </div>
                                <div className="text-xs text-gray-400 font-bold uppercase">Confidence</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                                className={`h-full bg-gradient-to-r ${config.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${score * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Decorative Background Glows */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black opacity-10 rounded-full blur-xl"></div>
            </div>
        </div>
    );
};

export default EmotionDialog;
