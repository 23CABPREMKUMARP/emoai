import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsDashboard = ({ data }) => {
    // Transform distribution object to array for Recharts
    const chartData = data?.distribution
        ? Object.entries(data.distribution).map(([emotion, count]) => ({
            name: emotion,
            value: Number((count * 100).toFixed(1)), // Percentage
            color: emotion === 'Happy' ? '#4ade80' :
                emotion === 'Sad' ? '#60a5fa' :
                    emotion === 'Angry' ? '#f87171' :
                        emotion === 'Neutral' ? '#9ca3af' :
                            emotion === 'Surprise' ? '#fbbf24' :
                                emotion === 'Fear' ? '#a78bfa' : '#d3d3d3'
        })).sort((a, b) => b.value - a.value)
        : [];

    const dominant = chartData.length > 0 ? chartData[0] : null;

    return (
        <div className="glass-panel p-6 w-full h-full flex flex-col gap-6 rounded-3xl bg-white/40 border border-white/60 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            {/* Distribution Chart - More compact */}
            <div className="flex-1 min-h-[250px] bg-white/50 rounded-2xl p-4 shadow-sm border border-white/60">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Emotion Distribution</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tick={{ fill: '#666', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', background: 'rgba(255,255,255,0.95)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f3f4f6', radius: [0, 4, 4, 0] }}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || '#ff69b4'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                        Waiting for data...
                    </div>
                )}
            </div>

            {/* Recent Timeline - More visual */}
            <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-white/60">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Live Timeline</h3>
                <div className="flex gap-1 overflow-hidden h-10 rounded-lg bg-gray-100/50 p-1 border border-gray-100 items-center mask-image-gradient">
                    {data?.recent?.slice(-40).map((emo, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-full rounded-sm transition-all duration-300"
                            style={{
                                backgroundColor:
                                    emo === 'Happy' ? '#4ade80' :
                                        emo === 'Sad' ? '#60a5fa' :
                                            emo === 'Angry' ? '#f87171' :
                                                emo === 'Neutral' ? '#9ca3af' :
                                                    emo === 'Surprise' ? '#fbbf24' :
                                                        emo === 'Fear' ? '#a78bfa' : '#d3d3d3'
                            }}
                            title={emo}
                        />
                    ))}
                    {(!data?.recent || data.recent.length === 0) && (
                        <span className="text-xs text-gray-300 w-full text-center">No active session</span>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center text-sm px-2">
                <span className="text-gray-500">Total Frames</span>
                <span className="font-mono font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded text-xs">{data?.total_frames || 0}</span>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
