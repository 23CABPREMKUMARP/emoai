import React, { useState } from 'react';
import { Send, ArrowRight, Type, Smile, Frown, Sparkles, MessageSquare } from 'lucide-react';
import EmotionDialog from './EmotionDialog';
import { API_URL } from '../api';

const TextAnalyzer = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const analyzeText = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/analyze_text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();

            if (response.ok) {
                // Backend returns normalized emotion names matching our EmotionDialog expectations
                setResult(data);
            } else {
                setError("Analysis failed. Please try simply describing a feeling.");
            }
        } catch (err) {
            console.error(err);
            setError("Could not connect to analysis engine.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start animate-fade-in-up">

            {/* Input Section */}
            <div className="flex-1 w-full glass-panel p-8 rounded-3xl bg-white/40 border-pink-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-pink-100 p-3 rounded-2xl text-pink-600">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Text Emotion Analysis</h2>
                        <p className="text-sm text-gray-500 font-medium">Type anything to detect underlying emotions</p>
                    </div>
                </div>

                <form onSubmit={analyzeText} className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ideally, type a sentence about how you feel right now..."
                        className="w-full h-40 p-6 rounded-2xl border-2 border-white/50 bg-white/50 text-lg font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-200/50 focus:border-pink-300 transition-all resize-none shadow-inner"
                    ></textarea>

                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">
                            {text.length} characters
                        </span>
                        <button
                            type="submit"
                            disabled={loading || !text}
                            className={`
                                flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg 
                                transition-all transform hover:-translate-y-1 active:scale-95 duration-200
                                ${loading || !text ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-300/50'}
                            `}
                        >
                            {loading ? (
                                <>
                                    <Sparkles className="animate-spin" size={18} />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Detect Emotion</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                        <Frown size={16} />
                        {error}
                    </div>
                )}
            </div>

            {/* Result Section */}
            <div className="w-full md:w-96 flex flex-col items-center justify-center min-h-[300px]">
                {result ? (
                    <div className="w-full animate-pop">
                        <EmotionDialog emotion={result.emotion} score={result.score} />

                        <div className="mt-6 glass-panel p-4 rounded-2xl bg-white/30 border border-white/50">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Confidence Breakdown</h4>
                            <div className="space-y-3">
                                {result.breakdown && Object.entries(result.breakdown)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 4)
                                    .map(([emo, score]) => (
                                        <div key={emo} className="flex items-center gap-2 text-sm">
                                            <span className="w-16 font-medium text-gray-600 truncate">{emo}</span>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-pink-400 rounded-full"
                                                    style={{ width: `${score * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono w-8 text-right">{(score * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-panel p-8 rounded-3xl bg-white/20 border border-white/30 text-center w-full h-full flex flex-col items-center justify-center border-dashed border-2 border-purple-100/50">
                        <div className="w-20 h-20 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 text-purple-300 animate-pulse">
                            <Type size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-400">No Analysis Yet</h3>
                        <p className="text-sm text-gray-400/80 mt-1 max-w-[200px]">Enter text and hit detect to see linguistic emotion decoding</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TextAnalyzer;
