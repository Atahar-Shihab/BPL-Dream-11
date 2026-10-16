import { useEffect } from 'react';
import { X, Star, Activity, Plus, Award } from 'lucide-react';
import { playBatShotSound, playClickSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';
import { getTeamTheme } from '../../utils/teamThemes';
import milestonesData from '../../data/playerMilestones.json';

const PlayerModal = ({
  player,
  isOpen,
  onClose,
  isSelected,
  isAtLimit,
  onAddPlayer,
  onRemovePlayer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !player) return null;

  const teamTheme = getTeamTheme(player.bplTeam);

  // Identify milestone records
  const lowerName = (player.playerName || '').toLowerCase();
  let verifiedMilestones = null;
  if (lowerName.includes('shakib') && milestonesData?.shakib) {
    verifiedMilestones = [
      { label: 'Centuries', value: milestonesData.shakib.centuries, icon: '🏏' },
      { label: 'BPL Wickets', value: milestonesData.shakib.wickets, icon: '🎯' },
      { label: 'MVP Awards', value: milestonesData.shakib.mvpAwards, icon: '👑' },
    ];
  } else if (lowerName.includes('tamim') && milestonesData?.tamim) {
    verifiedMilestones = [
      { label: 'Centuries', value: milestonesData.tamim.centuries, icon: '💯' },
      { label: 'Fifties', value: milestonesData.tamim.fifties, icon: '🏏' },
      { label: 'Boundaries', value: milestonesData.tamim.boundaries, icon: '🔥' },
    ];
  } else if (lowerName.includes('mustafiz') && milestonesData?.mustafiz) {
    verifiedMilestones = [
      { label: 'Maiden Overs', value: milestonesData.mustafiz.maidens, icon: '🎯' },
      { label: 'Death Econ', value: milestonesData.mustafiz.deathEconomy, icon: '⚡' },
      { label: 'Dot Balls', value: milestonesData.mustafiz.dotBalls, icon: '🛑' },
    ];
  }

  // Calculate skill ratings for bar meters
  const battingScore = Math.min(99, Math.round((player.strikeRate || 100) * 0.65));
  const bowlingScore = player.wickets ? Math.min(98, 70 + Math.round(player.wickets / 5)) : 45;
  const fieldingScore = Math.min(99, Math.round((player.rating || 9.0) * 10));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner Cover */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-emerald-950 overflow-hidden flex items-end p-6">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7fb25_1px,transparent_1px)] [background-size:16px_16px]" />

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/70 backdrop-blur-sm transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-yellow-400/80 shadow-xl bg-neutral-800 flex-none">
              <img
                src={player.playerImg}
                alt={player.playerName}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = USER_PLACEHOLDER;
                }}
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-black text-yellow-300">
                #{player.jerseyNumber || 10}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-400 text-neutral-950">
                  {player.playerType}
                </span>
                <span className="text-xs text-white/70">
                  {player.playerCountry} {player.isOverseas ? '🌍' : '🇧🇩'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1 leading-tight">
                {player.playerName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${teamTheme.bg} ${teamTheme.border} ${teamTheme.text}`}>
                  {player.bplTeam || 'Franchise Star'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Bio */}
          {player.bio && (
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
              "{player.bio}"
            </p>
          )}

          {/* Hall of Fame Career Milestones Banner (if verified) */}
          {verifiedMilestones && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-2">
                <Award className="w-4 h-4" /> BPL Career Records & Hall of Fame
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {verifiedMilestones.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-yellow-500/20">
                    <span className="text-base">{m.icon}</span>
                    <p className="text-sm font-black text-neutral-900 dark:text-yellow-300">{m.value}</p>
                    <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <p className="text-[10px] uppercase font-bold text-neutral-400">Rating</p>
              <p className="text-base font-black text-yellow-500 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {player.rating}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <p className="text-[10px] uppercase font-bold text-neutral-400">Matches</p>
              <p className="text-base font-black text-neutral-800 dark:text-neutral-100">
                {player.matches || 45}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <p className="text-[10px] uppercase font-bold text-neutral-400">Runs</p>
              <p className="text-base font-black text-emerald-500">
                {player.runs || 120}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <p className="text-[10px] uppercase font-bold text-neutral-400">Wickets</p>
              <p className="text-base font-black text-blue-500">
                {player.wickets || 12}
              </p>
            </div>
          </div>

          {/* Style Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Batting Style</span>
              <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{player.battingStyle || 'Right-hand bat'}</strong>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Bowling Style</span>
              <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{player.bowlingStyle || 'Right-arm medium'}</strong>
            </div>
          </div>

          {/* Skill Performance Meters */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-yellow-500" /> Skill Assessment
            </h4>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Batting Power & Strike Rate</span>
                <span className="text-yellow-500">{battingScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${battingScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Bowling & Wicket Threat</span>
                <span className="text-blue-500">{bowlingScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${bowlingScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Fielding & Clutch Value</span>
                <span className="text-emerald-500">{fieldingScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${fieldingScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-400 block font-medium">Player Fee</span>
            <span className="text-xl font-black text-neutral-900 dark:text-yellow-300">
              ${(player.price || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSelected ? (
              <button
                type="button"
                onClick={() => {
                  onRemovePlayer(player.id);
                  onClose();
                }}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Release Player
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playBatShotSound();
                  onAddPlayer(player);
                  onClose();
                }}
                disabled={isAtLimit}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-yellow-400 text-neutral-950 hover:bg-yellow-300 disabled:opacity-50 transition shadow-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {isAtLimit ? 'Team Limit Reached' : 'Sign to Dream XI'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
