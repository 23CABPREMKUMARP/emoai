import { useState, useEffect } from 'react';
import { Menu, X, Brain } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 glass border-x-0 border-t-0 rounded-none' : 'py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 glass rounded-lg group-hover:bg-primary-neon/20 transition-colors">
                        <Brain className="w-8 h-8 text-primary-neon animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold tracking-tight leading-none">
                            EMO<span className="text-primary-neon">AI</span>
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-neon animate-pulse shadow-[0_0_8px_#00f2fe]" />
                            <span className="text-[10px] font-bold text-primary-neon uppercase tracking-[0.2em] opacity-80">Live</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Analytics', 'Process'].map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(link.toLowerCase());
                                if (element) {
                                    window.scrollTo({
                                        top: element.offsetTop - 100,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass rounded-none border-x-0 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                    {['Features', 'Analytics', 'Process'].map((link) => (
                        <a key={link} href={`#${link.toLowerCase()}`} className="text-lg font-medium py-2" onClick={() => {
                            setIsMobileMenuOpen(false);
                            const element = document.getElementById(link.toLowerCase());
                            if (element) {
                                window.scrollTo({
                                    top: element.offsetTop - 100,
                                    behavior: 'smooth'
                                });
                            }
                        }}>
                            {link}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}
