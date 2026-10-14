import { useScrollReveal } from '../../hooks/useScrollAnimations';
import { Trophy, Target, Flame, MapPin } from 'lucide-react';
import bplRecords from '../../data/bplRecords.json';
import stadiumVenues from '../../data/stadiumVenues.json';

const StatsMarquee = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const recordCards = [
    {
      icon: Trophy,
      label: 'Highest Team Total',
      value: `${bplRecords.highestTeamScore.score}/${bplRecords.highestTeamScore.overs}`,
      sub: bplRecords.highestTeamScore.team,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Target,
      label: 'Best Bowling Spell',
      value: bplRecords.bestBowlingFigures.figures,
      sub: bplRecords.bestBowlingFigures.player,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'All-Time Tournament Runs',
      value: `${bplRecords.mostTournamentRuns.runs.toLocaleString()} Runs`,
      sub: bplRecords.mostTournamentRuns.player,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: MapPin,
      label: 'Tournament Host Venues',
      value: `${stadiumVenues.length} Stadiums`,
      sub: 'Mirpur · Chattogram · Sylhet',
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section
      ref={ref}
      className={`page-container py-8 sm:py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recordCards.map((record, i) => {
          const Icon = record.icon;
          return (
            <div
              key={record.label}
              className="flex flex-col items-center text-center gap-1.5 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm hover:shadow-md hover:border-yellow-400/40 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`p-3 rounded-xl mb-1 ${record.bg}`}>
                <Icon className={`w-5 h-5 ${record.color}`} />
              </div>
              <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
                {record.value}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {record.label}
              </span>
              <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 truncate max-w-full">
                {record.sub}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsMarquee;
