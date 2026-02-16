import { motion } from 'framer-motion';

const steps = [
    {
        num: "01",
        title: "Optical Capture",
        desc: "Seamlessly integrate with any web or mobile camera stream."
    },
    {
        num: "02",
        title: "Neural Analysis",
        desc: "Proprietary transformers map facial landmarks in 3D space."
    },
    {
        num: "03",
        title: "Affect Derivation",
        desc: "Deep learning models classify emotions and micro-expressions."
    },
    {
        num: "04",
        title: "Adaptive Response",
        desc: "Generate empathetic actions or data reports instantly."
    }
];

export default function Process() {
    return (
        <section id="process" className="py-24 bg-dark-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">How It <span className="neon-text">Works</span></h2>
                    <p className="text-white/60">A highly optimized pipeline for real-time emotional intelligence.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 rounded-2xl glass mb-8 flex items-center justify-center text-3xl font-display font-bold text-primary-neon shadow-lg shadow-primary-neon/10">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
