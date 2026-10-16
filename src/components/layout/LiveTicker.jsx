import { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import { playClickSound } from '../../utils/soundEffects';

const NEWS_ITEMS_EN = [
  { tag: 'BREAKING', color: 'red', text: 'Shakib Al Hasan signs with Fortune Barishal for record auction price!' },
  { tag: 'MATCH ALERT', color: 'amber', text: 'Comilla Victorians vs Rangpur Riders thriller set for tonight at Mirpur!' },
  { tag: 'FANTASY TIP', color: 'emerald', text: 'Captain (C) earns 2.0x points — Pick a top all-rounder for maximum yield!' },
  { tag: 'RECORD', color: 'purple', text: 'Over 120,000 cricket fans have assembled their Dream XI squads this season!' },
  { tag: 'DEATH OVERS', color: 'cyan', text: 'Mustafizur & Bumrah lead tournament dot-ball statistics!' },
  { tag: 'RULE', color: 'blue', text: 'Remember maximum 4 international players allowed in your playing XI.' },
];

const NEWS_ITEMS_BN = [
  { tag: 'ব্রেকিং', color: 'red', text: 'রেকর্ড মূল্যে ফরচুন বরিশালে যোগ দিলেন সাকিব আল হাসান!' },
  { tag: 'ম্যাচ এলার্ট', color: 'amber', text: 'আজ রাতে মিরপুরে মুখোমুখি কুমিল্লা ভিক্টোরিয়ান্স বনাম রংপুর রাইডার্স!' },
  { tag: 'ফ্যান্টাসি টিপস', color: 'emerald', text: 'অধিনায়ক (C) দ্বিগুণ পয়েন্ট পান — অলরাউন্ডার বাছাই করে বেশি পয়েন্ট নিন!' },
  { tag: 'রেকর্ড', color: 'purple', text: '১২০,০০০-এর বেশি ক্রিকেট ভক্ত তাদের ড্রিম একাদশ সাজিয়েছেন!' },
  { tag: 'ডেথ ওভার', color: 'cyan', text: 'মুস্তাফিজুর ও বুমরাহ টুর্নামেন্টের ডট বল তালিকায় শীর্ষে!' },
  { tag: 'নিয়মাবলী', color: 'blue', text: 'একাদশে সর্বোচ্চ ৪ জন বিদেশি খেলোয়াড় রাখা যাবে।' },
];

const TAG_STYLES = {
  red: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
  amber: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  purple: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
  cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  blue: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
};

const LiveTicker = () => {
  const { language } = useTheme();
  const newsList = language === 'bn' ? NEWS_ITEMS_BN : NEWS_ITEMS_EN;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % newsList.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying, newsList.length]);

  const handlePrev = () => {
    playClickSound();
    setIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
  };

  const handleNext = () => {
    playClickSound();
    setIndex((prev) => (prev + 1) % newsList.length);
  };

  const togglePlay = () => {
    playClickSound();
    setIsPlaying((prev) => !prev);
  };

  const currentItem = newsList[index % newsList.length];
  const tagClass = TAG_STYLES[currentItem.color] || TAG_STYLES.emerald;

  return (
    <aside
      aria-label="Live cricket news ticker"
      className="bg-neutral-950 text-white border-b border-neutral-800 text-xs py-2 px-3 sm:px-4 select-none relative z-30"
    >
      <div className="page-container flex items-center justify-between gap-2 sm:gap-3">
        {/* Live Pill & Header */}
        <div className="flex items-center gap-2 flex-none">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-[10px] uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE BPL
          </span>
          <span className="text-amber-400 font-bold hidden md:inline-flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {language === 'bn' ? 'সংবাদ:' : 'Flash:'}
          </span>
        </div>

        {/* Dynamic Category Pill & Headline */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0">
          <span
            key={`tag-${index}`}
            className={`flex-none px-2 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-black uppercase tracking-wider animate-fadeIn ${tagClass}`}
          >
            {currentItem.tag}
          </span>
          <p
            key={`text-${index}`}
            className="text-neutral-300 font-medium text-xs truncate animate-fadeIn flex-1"
          >
            {currentItem.text}
          </p>
        </div>

        {/* Interactive Playback Controls */}
        <div className="flex items-center gap-1 flex-none text-neutral-400">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous headline"
            title="Previous headline"
            className="p-1 rounded-md hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause ticker' : 'Resume ticker'}
            title={isPlaying ? 'Pause' : 'Resume'}
            className="p-1 rounded-md hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-neutral-300" />
            ) : (
              <Play className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next headline"
            title="Next headline"
            className="p-1 rounded-md hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="hidden lg:inline text-[10px] font-mono text-neutral-500 pl-1.5 border-l border-neutral-800">
            {index + 1}/{newsList.length}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default LiveTicker;
