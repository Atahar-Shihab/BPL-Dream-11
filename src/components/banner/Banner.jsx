import { useEffect, useState } from 'react';
import BannerImage from '/assets/banner-main.png';
import Bg from '/assets/bg-shadow.png';
import ThreeCricketStadium from '../ThreeCanvas/ThreeCricketStadium';
import { useScrollReveal } from '../../hooks/useScrollAnimations';

const TYPE_STRINGS = [
  'Ultimate Dream XI',
  'BPL Championship Squad',
  'World-Class Starting XI',
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
            setTimeout(() => setIsDeleting(true), 2000);
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
      isDeleting ? 30 : 60
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

        <h1 className="mt-4 max-w-3xl text-white font-extrabold tracking-tight">
          <span className="block text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-bold">
            Assemble Your
          </span>
          <span className="block mt-1 sm:mt-1.5 h-11 sm:h-14 lg:h-16 flex items-center justify-center overflow-hidden">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-lime-300 whitespace-nowrap inline-flex items-center">
              {typedText}
              <span className="animate-blink text-yellow-300 ml-0.5">|</span>
            </span>
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
