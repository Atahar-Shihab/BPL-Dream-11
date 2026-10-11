import { Heart, Globe, ChevronUp, Code2, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollAnimations';
import { LOGO_FOOTER } from '../../utils/assets';

const Footer = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <footer
      ref={ref}
      id="footer"
      className={`site-footer relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Animated gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-500 animate-gradient-x" />

      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#e7fb25_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full px-6">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-b border-white/10">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img src={LOGO_FOOTER} alt="Cricket" className="footer-logo" />
            <p className="text-white/60 text-sm max-w-xs text-center sm:text-left">
              Build your dream cricket team, one player at a time. Compete with the best.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <h4 className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">Navigate</h4>
              <a href="#top" className="text-white/50 hover:text-white transition">Home</a>
              <a href="#players" className="text-white/50 hover:text-white transition">Players</a>
              <a href="#footer" className="text-white/50 hover:text-white transition">About</a>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1">Connect</h4>
              <a href="https://github.com/Atahar-Shihab" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> GitHub
              </a>
              <a href="#footer" className="text-white/50 hover:text-white transition flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Twitter
              </a>
              <a href="#footer" className="text-white/50 hover:text-white transition flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <small className="text-white/40 text-xs">
            © {new Date().getFullYear()} Dream 11 Cricket — Built with{' '}
            <Heart className="w-3 h-3 inline text-red-400 fill-current" /> by Atahar Shihab
          </small>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-yellow-400 transition"
          >
            <ChevronUp className="w-3.5 h-3.5" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
