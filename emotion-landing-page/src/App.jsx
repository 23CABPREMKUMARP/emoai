import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import InteractiveDemo from './components/InteractiveDemo';
import Process from './components/Process';
import TextAnalyzer from './components/TextAnalyzer';
import Analytics from './components/Analytics';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4ba6
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger for section reveals
    const sections = document.querySelectorAll('.reveal');

    sections.forEach((section) => {
      gsap.fromTo(section,
        {
          opacity: 0,
          y: 60,
          scale: 0.98,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="relative bg-dark selection:bg-primary-neon/30">
      <Navbar />
      <Hero />
      <div className="reveal">
        <Features />
      </div>
      <div className="reveal">
        <InteractiveDemo />
      </div>
      <div className="reveal">
        <Analytics />
      </div>
      <div className="reveal">
        <TextAnalyzer />
      </div>
      <div className="reveal">
        <Process />
      </div>
      <Footer />

      {/* Global Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-neon/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-violet/5 blur-[150px] rounded-full" />
      </div>
    </main>
  );
}

export default App;
