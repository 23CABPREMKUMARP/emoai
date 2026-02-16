import { motion } from 'framer-motion';
import { Camera, Shield, BarChart3, Users, Volume2, Cpu } from 'lucide-react';

const features = [
    {
        title: "Real-Time Detection",
        desc: "Analyze emotions instantly with sub-millisecond latency using our proprietary model.",
        icon: Camera,
        color: "#00f2fe"
    },
    {
        title: "Privacy First",
        desc: "Complete on-device processing. We never store or transmit your visual data.",
        icon: Shield,
        color: "#9d50bb"
    },
    {
        title: "Analytics Dashboard",
        desc: "Deep dive into emotional trends with intuitive data visualizations and reporting.",
        icon: BarChart3,
        color: "#00f2fe"
    },
    {
        title: "Multi-Emotion Support",
        desc: "Identify micro-expressions across 8 core emotions and subtle mix-states.",
        icon: Users,
        color: "#4facfe"
    },
    {
        title: "Voice Feedback",
        desc: "Empathetic AI responses that adapt to the detected emotional state of the user.",
        icon: Volume2,
        color: "#f093fb"
    },
    {
        title: "Edge Computing",
        desc: "Optimized for mobile browsers and low-power devices without sacrificing accuracy.",
        icon: Cpu,
        color: "#5eead4"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-dark-bg/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Beyond Simple <span className="neon-text">Recognition</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Our platform combines cutting-edge computer vision with deep psychological
                        research to provide the most accurate emotional analysis available.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                            className="glass-card p-10 flex flex-col gap-6 group relative overflow-hidden"
                        >
                            <div
                                className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
                                style={{ backgroundColor: item.color }}
                            />

                            <div className="w-14 h-14 glass flex items-center justify-center rounded-xl group-hover:bg-white/10 transition-colors">
                                <item.icon className="w-7 h-7" style={{ color: item.color }} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
                                <p className="text-white/60 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
