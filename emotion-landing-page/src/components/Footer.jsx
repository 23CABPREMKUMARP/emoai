import { Github, Twitter, Linkedin, Brain } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-20 bg-dark border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Brain className="w-8 h-8 text-primary-neon" />
                            <span className="text-2xl font-display font-bold">EMO<span className="text-primary-neon">AI</span></span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Bridging the gap between human emotion and digital intelligence through advanced neural architecture.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-white/50 text-sm">
                            <li><a href="#" className="hover:text-primary-neon transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary-neon transition-colors">Use Cases</a></li>
                            <li><a href="#" className="hover:text-primary-neon transition-colors">API Docs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-white/50 text-sm">
                            <li><a href="#" className="hover:text-primary-violet transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary-violet transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary-violet transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary-violet transition-colors">Terms</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Newsletter</h4>
                        <p className="text-white/40 text-sm mb-4">Get the latest on AI empathy.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full glass py-3 px-4 rounded-xl text-sm focus:outline-none focus:border-primary-neon transition-colors"
                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-primary-neon text-dark px-4 rounded-lg text-xs font-bold hover:bg-primary-neon/80 transition-colors">
                                SIGN UP
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
                    <p className="text-white/20 text-xs">
                        © 2026 EMOAI Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-white/30 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-white/30 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="text-white/30 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
