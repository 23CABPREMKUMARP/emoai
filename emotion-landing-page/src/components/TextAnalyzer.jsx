import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, Type, Smile, Frown, Sparkles, MessageSquare, Meh } from 'lucide-react';
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
                setResult(data);
            } else {
                setError("Analysis failed. Please try a different sentence.");
            }
        } catch (err) {
            console.error(err);
            setError("Could not connect to analysis engine.");
        } finally {
            setLoading(false);
        }
    };

    const getEmotionIcon = (emotion) => {
        const emo = emotion?.toLowerCase() || '';
        if (emo.includes('happy')) return <Smile className="w-12 h-12 text-primary-neon" />;
        if (emo.includes('sad') || emo.includes('angry')) return <Frown className="w-12 h-12 text-primary-pink" />;
        return <Meh className="w-12 h-12 text-primary-violet" />;
    };

    return (
        <section id="text-analysis" className="py-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-violet/5 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Linguistic <span className="neon-text">Sentiments</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Our AI doesn't just see emotions; it hears them. Analyze text passages
                        to uncover the underlying emotional frequency of any message.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Input Section */}
                    <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 glass rounded-2xl text-primary-neon">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Text Decoder</h3>
                                <p className="text-sm text-white/40">Enter text to begin analysis</p>
                            </div>
                        </div>

                        <form onSubmit={analyzeText} className="relative z-10">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="How are you feeling today? Describe it in a sentence..."
                                className="w-full h-48 p-6 rounded-2xl border border-white/10 bg-white/5 text-lg font-medium text-white placeholder-white/20 focus:outline-none focus:border-primary-pink/50 transition-all resize-none"
                            ></textarea>

                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-white/20 uppercase tracking-widest pl-2">
                                    {text.length} characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading || !text}
                                    className={`
                                        flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-dark shadow-lg 
                                        transition-all transform hover:-translate-y-1 active:scale-95 duration-200
                                        ${loading || !text ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' : 'bg-primary-neon hover:shadow-primary-neon/30'}
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={18} />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Analyze Affect</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium border border-red-500/20 flex items-center gap-2 relative z-10"
                            >
                                <Frown size={16} />
                                {error}
                            </motion.div>
                        )}
                    </div>

                    {/* Result Section */}
                    <div className="md:w-80 flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="h-full flex flex-col gap-6"
                                >
                                    <div className="glass p-8 rounded-[2rem] border-white/5 text-center flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-neon/10 to-transparent opacity-50" />

                                        <div className="relative z-10 mb-4">
                                            {getEmotionIcon(result.emotion)}
                                        </div>
                                        <h4 className="text-3xl font-display font-bold text-white mb-2 relative z-10 uppercase tracking-wider">
                                            {result.emotion}
                                        </h4>
                                        <div className="px-4 py-1 glass rounded-full text-xs font-bold text-primary-neon relative z-10">
                                            {(result.score * 100).toFixed(0)}% CONFIDENCE
                                        </div>
                                    </div>

                                    <div className="glass p-6 rounded-[2rem] border-white/5">
                                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Confidence Distribution</h4>
                                        <div className="space-y-4">
                                            {result.breakdown && Object.entries(result.breakdown)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 3)
                                                .map(([emo, score]) => (
                                                    <div key={emo} className="space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="text-white/60">{emo}</span>
                                                            <span className="text-primary-neon">{(score * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${score * 100}%` }}
                                                                className="h-full bg-primary-neon"
                                                            ></motion.div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full glass p-8 rounded-[2rem] border-white/5 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-40"
                                >
                                    <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="text-white/40" />
                                    </div>
                                    <h3 className="font-bold text-white/60">Awaiting Input</h3>
                                    <p className="text-xs text-white/40 mt-2">Frequency analysis will appear here</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextAnalyzer;
