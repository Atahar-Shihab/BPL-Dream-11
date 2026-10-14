import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { playWhooshSound } from '../../utils/soundEffects';

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, percent)));
      setShowButton(scrollTop > 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    playWhooshSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      {/* Top Neon Scroll Progress Line */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-400 shadow-[0_0_12px_rgba(231,251,37,0.8)] transition-all duration-75"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Floating Back To Top circular button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900/90 text-yellow-300 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-neutral-900 hover:shadow-yellow-400/30 active:scale-95 border border-white/10 ${
          showButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-yellow-400 transition-all duration-75"
          />
        </svg>
        <ArrowUp className="w-5 h-5 relative z-10" />
      </button>
    </>
  );
};

export default ScrollProgress;
