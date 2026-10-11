import { useEffect, useState } from 'react';
import BannerImage from '/assets/banner-main.png';
import Bg from '/assets/bg-shadow.png';
import ThreeCricketStadium from '../ThreeCanvas/ThreeCricketStadium';
import { useScrollReveal } from '../../hooks/useScrollAnimations';

const TYPE_STRINGS = [
  'Ultimate Dream 11 Cricket Team',
  'BPL Championship Squad',
  'World Class Starting XI',
];

const Banner = () => {
  const { ref: bannerRef, isVisible } = useScrollReveal({ threshold: 0.05 });
  const [typedText, setTypedText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentString = TYPE_STRINGS[stringIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedText(currentString.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);

          if (charIndex + 1 === currentString.length) {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          setTypedText(currentString.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);

          if (charIndex <= 1) {
            setIsDeleting(false);
            setStringIndex((prev) => (prev + 1) % TYPE_STRINGS.length);
          }
        }
      },
      isDeleting ? 35 : 65
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, stringIndex]);

  return (
    <section
      ref={bannerRef}
      id="top"
      className={`banner relative isolate mx-4 min-h-100 overflow-hidden rounded-2xl bg-neutral-950 py-12 sm:mx-6 sm:min-h-120 sm:py-16 lg:mx-auto lg:max-w-7xl lg:py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <img
        src={Bg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-top opacity-95 sm:object-center"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-neutral-950/10 to-neutral-950/55" />

      {/* Animated dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-5 opacity-[0.06] bg-[radial-gradient(#e7fb25_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-8">
        <img
          src={BannerImage}
          alt="A cricket player holding a bat"
          className="mb-5 w-full max-w-xs sm:mb-6 sm:max-w-sm animate-float"
        />

        {/* 3D Interactive Cricket Ball */}
        <ThreeCricketStadium />

        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Assemble Your{' '}
          <span className="text-yellow-400 inline-block min-w-[12ch]">
            {typedText}
            <span className="animate-blink text-yellow-300">|</span>
          </span>
        </h1>
        <p className="banner-subtitle">Build a team that plays beyond boundaries.</p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8">
          <a href="#players" className="primary-button">
            Explore Players
          </a>
          <a
            href="#footer"
            className="secondary-button bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            Learn More
          </a>
        </div>

        {/* Floating Stats Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 sm:mt-10">
          <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <span className="text-xl font-black text-yellow-400">32+</span>
            <span className="text-[11px] text-white/70 font-semibold">Star Players</span>
          </div>
          <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <span className="text-xl font-black text-emerald-400">10+</span>
            <span className="text-[11px] text-white/70 font-semibold">Countries</span>
          </div>
          <div className="stat-badge animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <span className="text-xl font-black text-blue-400">6</span>
            <span className="text-[11px] text-white/70 font-semibold">Dream XI Slots</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
