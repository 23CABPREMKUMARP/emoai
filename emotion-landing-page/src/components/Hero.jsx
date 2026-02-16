import { useEffect, useRef } from 'react';
import Scene3D from './Scene3D';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef();
    const titleRef = useRef();
    const subtextRef = useRef();
    const buttonsRef = useRef();

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

        tl.fromTo(titleRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5 })
            .fromTo(subtextRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, '-=1')
            .fromTo(buttonsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=1');
    }, []);

    return (
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20" ref={containerRef}>
            <Scene3D />

            <div className="container mx-auto px-6 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    <h1
                        ref={titleRef}
                        className="text-5xl md:text-8xl font-display font-bold leading-tight mb-8"
                    >
                        Understand <span className="neon-text">Emotions</span> <br />
                        with AI Intelligence
                    </h1>

                    <p
                        ref={subtextRef}
                        className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Experience the future of human-AI interaction. Our real-time emotion detection
                        engine analyzes subtle visual cues to bridge the gap between human feelings
                        and digital responses.
                    </p>

                    <div
                        ref={buttonsRef}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button
                            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary group w-full sm:w-auto"
                        >
                            Start Live Detection
                            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
