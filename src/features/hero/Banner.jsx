import { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import ThreeCricketStadium from './ThreeCricketStadium';
import { useScrollReveal } from '../../hooks/useScrollAnimations';
import { BG_SHADOW_IMG } from '../../utils/assets';
import { useSquad } from '../../context/useSquad';
import { useTheme } from '../../context/useTheme';

const TYPE_STRINGS_EN = [
  'Ultimate Dream XI',
  'BPL Championship Squad',
  'World-Class Starting XI',
];

const TYPE_STRINGS_BN = [
  'সেরা ড্রিম একাদশ',
  'বিপিএল চ্যাম্পিয়ন স্কোয়াড',
  'বিশ্বমানের সেরা একাদশ',
];

const Banner = () => {
  const { ref: bannerRef, isVisible } = useScrollReveal({ threshold: 0.05 });
  const { setTournamentModalOpen } = useSquad();
  const { language, t } = useTheme();

  const typeStrings = language === 'bn' ? TYPE_STRINGS_BN : TYPE_STRINGS_EN;

  const [typedText, setTypedText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentString = typeStrings[stringIndex % typeStrings.length] || '';

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedText(currentString.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);

          if (charIndex + 1 >= currentString.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setTypedText(currentString.slice(0, Math.max(0, charIndex - 1)));
          setCharIndex((prev) => prev - 1);

          if (charIndex <= 1) {
            setIsDeleting(false);
            setStringIndex((prev) => (prev + 1) % typeStrings.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, stringIndex, typeStrings]);

  return (
    <section
      ref={bannerRef}
      id="top"
      className={`banner relative isolate mx-4 min-h-100 overflow-hidden rounded-3xl bg-neutral-950 py-12 sm:mx-6 sm:py-16 lg:mx-auto lg:max-w-7xl lg:py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <img
        src={BG_SHADOW_IMG}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-top opacity-95 sm:object-center"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950/80" />

      {/* Animated dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-5 opacity-[0.06] bg-[radial-gradient(#e7fb25_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          {/* Left Column (7 cols): Heading, Typewriter, CTAs & Stat Badges */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Season Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-300 text-xs font-bold tracking-wide mb-4 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t('seasonBadge', 'Official BPL 2026 Edition')}</span>
            </div>

            <h1 className="max-w-xl text-white font-extrabold tracking-tight">
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-bold">
                {t('assembleYour', 'Assemble Your')}
              </span>
              <span className="block mt-1 sm:mt-1.5 h-11 sm:h-14 lg:h-16 flex items-center justify-center lg:justify-start overflow-hidden whitespace-nowrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-lime-300 inline-flex items-center">
                  {typedText}
                  <span className="animate-blink text-yellow-300 ml-0.5">|</span>
                </span>
              </span>
            </h1>

            <p className="banner-subtitle max-w-lg mt-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
              {t('bannerSubtitle', 'Build a championship squad that plays beyond boundaries. Draft 32 world-class superstars, deploy tactical pitch formations, and compete for victory coins.')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6 sm:mt-8">
              <a href="#players" className="primary-button">
                {t('explorePlayers', 'Explore Players')}
              </a>
              <button
                type="button"
                onClick={() => setTournamentModalOpen(true)}
                className="secondary-button bg-white/10 text-white border border-white/20 hover:bg-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>{t('standings', 'Standings')}</span>
              </button>
            </div>

            {/* 3 Compact Glassmorphic Stat Badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 sm:mt-10 w-full max-w-md">
              <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <span className="text-xl font-black text-yellow-400">32+</span>
                <span className="text-[11px] text-white/70 font-semibold">{t('starPlayers', 'Star Players')}</span>
              </div>
              <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.4s' }}>
                <span className="text-xl font-black text-emerald-400">2.0x</span>
                <span className="text-[11px] text-white/70 font-semibold">{t('captain', 'Captain')} 2x</span>
              </div>
              <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.6s' }}>
                <span className="text-xl font-black text-blue-400">65K</span>
                <span className="text-[11px] text-white/70 font-semibold">{t('coins', 'Coins')}</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive 3D Stadium Sphere with Radial Ambient Glow */}
          <div className="lg:col-span-5 flex items-center justify-center relative mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-emerald-400/10 to-transparent blur-3xl pointer-events-none rounded-full transform scale-90" />
            <div className="relative z-10 w-full max-w-sm flex justify-center">
              <ThreeCricketStadium />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
