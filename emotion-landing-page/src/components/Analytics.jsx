import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Clock, Zap } from 'lucide-react';
import { getAnalytics } from '../api';

export default function Analytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const result = await getAnalytics();
                if (result) setData(result);
            } catch (err) {
                console.error("Analytics fetch error", err);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const emotions = data?.distribution ? Object.entries(data.distribution) : [];
    const recent = data?.recent || [];

    const getEmotionColor = (emo) => {
        const e = emo.toLowerCase();
        if (e.includes('happy')) return '#00f2fe'; // Neon
        if (e.includes('sad')) return '#9d50bb'; // Violet
        if (e.includes('angry')) return '#ffffff'; // White/Neutral
        return '#00f2fe';
    };

    return (
        <section id="analytics" className="py-24 relative overflow-hidden bg-dark-bg/30">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-primary-neon mb-4">
                            <Activity className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase">Neural Telemetry</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold">
                            Advanced Affect <span className="neon-text">Metrics</span>
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass px-6 py-4 rounded-2xl flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Frames</span>
                            <span className="text-2xl font-display font-bold text-primary-neon">{data?.total_frames || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Distribution Card */}
                    <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart3 size={120} />
                        </div>

                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Zap className="text-primary-neon" />
                            Emotional Distribution
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                {emotions.map(([emo, score], i) => (
                                    <div key={emo} className="group/item">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold uppercase tracking-wider text-white/70">{emo}</span>
                                            <span className="text-sm font-bold font-mono text-primary-neon">{(score * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score * 100}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="h-full"
                                                style={{ backgroundColor: getEmotionColor(emo) }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {emotions.length === 0 && (
                                    <div className="text-white/20 text-sm italic">Waiting for telemetry stream...</div>
                                )}
                            </div>

                            <div className="flex justify-center">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-white/5"
                                        />
                                        {emotions.map(([emo, score], i) => {
                                            const offset = emotions.slice(0, i).reduce((acc, curr) => acc + curr[1], 0) * 251.2;
                                            return (
                                                <motion.circle
                                                    key={emo}
                                                    cx="50" cy="50" r="40"
                                                    fill="transparent"
                                                    stroke={getEmotionColor(emo)}
                                                    strokeWidth="8"
                                                    strokeDasharray={`${score * 251.2} 251.2`}
                                                    strokeDashoffset={-offset}
                                                    initial={{ strokeDasharray: "0 251.2" }}
                                                    animate={{ strokeDasharray: `${score * 251.2} 251.2` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    strokeLinecap="round"
                                                />
                                            );
                                        })}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Primary</span>
                                        <span className="text-lg font-display font-bold text-white mt-1">
                                            {emotions.length > 0 ? emotions.sort((a, b) => b[1] - a[1])[0][0] : '...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="glass p-8 rounded-[2.5rem] flex flex-col">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Clock className="text-primary-violet" />
                            Real-time Timeline
                        </h3>

                        <div className="flex-1 flex flex-col gap-4 overflow-hidden mask-fade-bottom">
                            <AnimatePresence mode="popLayout">
                                {recent.slice(-8).reverse().map((emo, i) => (
                                    <motion.div
                                        key={`${emo}-${recent.length - i}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-4 p-4 glass bg-white/5 rounded-2xl border-white/5"
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
                                            style={{ color: getEmotionColor(emo) }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold uppercase tracking-wider">{emo}</div>
                                            <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Detected {i === 0 ? 'Just Now' : `${i * 2}s ago`}</div>
                                        </div>
                                        <Zap size={14} className="text-white/10" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {recent.length === 0 && (
                                <div className="flex flex-col items-center justify-center flex-1 text-center opacity-20">
                                    <Clock size={48} className="mb-4" />
                                    <p className="text-sm">No sequence detected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
