import { useState, useEffect } from 'react';
import { Flame, ChevronRight } from 'lucide-react';

const NEWS_ITEMS = [
  '⚡ BREAKING: Shakib Al Hasan signs with Fortune Barishal for record auction price!',
  '🏏 MATCH ALERT: Comilla Victorians vs Rangpur Riders thriller set for tonight at Mirpur!',
  '👑 FANTASY TIP: Captain (C) earns 2.0x points — Pick a top all-rounder for maximum yield!',
  '🔥 RECORD: Over 120,000 cricket fans have assembled their Dream XI squads this season!',
  '🎯 DEATH OVERS: Mustafizur & Bumrah lead tournament dot-ball statistics!',
  '🌍 OVERSEAS RULE: Remember maximum 4 international players allowed in your playing XI.',
];

const LiveTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      aria-label="Live cricket news ticker"
      className="bg-neutral-950 text-white border-b border-neutral-800 text-xs py-2 px-4 overflow-hidden select-none"
    >
      <div className="page-container flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-none">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-wider shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE BPL
          </span>
          <span className="text-amber-400 font-bold hidden sm:inline flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Updates:
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <p
            key={index}
            className="text-neutral-300 font-medium truncate animate-fadeIn text-center sm:text-left"
          >
            {NEWS_ITEMS[index]}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-none text-[11px] text-neutral-400">
          <span>Season 11 Fantasy League</span>
          <ChevronRight className="w-3 h-3 text-yellow-400" />
        </div>
      </div>
    </aside>
  );
};

export default LiveTicker;
