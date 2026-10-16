import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRightLeft, Trophy, Check } from 'lucide-react';
import { playWhooshSound, playClickSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';
import { getTeamTheme } from '../../utils/teamThemes';

const PlayerCompareModal = ({ isOpen, onClose, allPlayers, initialPlayer1Id }) => {
  const [player1Id, setPlayer1Id] = useState(
    initialPlayer1Id ? Number(initialPlayer1Id) : (allPlayers[0]?.id || 1)
  );
  const [player2Id, setPlayer2Id] = useState(
    allPlayers.length > 1 && allPlayers[1]?.id !== (initialPlayer1Id ? Number(initialPlayer1Id) : 1)
      ? allPlayers[1]?.id
      : (allPlayers[2]?.id || 2)
  );

  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !allPlayers.length || typeof document === 'undefined') return null;

  const p1 = allPlayers.find((p) => p.id === Number(player1Id)) || allPlayers[0];
  const p2 = allPlayers.find((p) => p.id === Number(player2Id)) || allPlayers[1];

  const theme1 = getTeamTheme(p1.bplTeam);
  const theme2 = getTeamTheme(p2.bplTeam);

  const compareMetrics = [
    { label: 'Rating', val1: p1.rating, val2: p2.rating, higherBetter: true, unit: '★' },
    { label: 'Runs Scored', val1: p1.runs || 0, val2: p2.runs || 0, higherBetter: true, unit: '' },
    { label: 'Batting Strike Rate', val1: p1.strikeRate || 0, val2: p2.strikeRate || 0, higherBetter: true, unit: '' },
    { label: 'Wickets Taken', val1: p1.wickets || 0, val2: p2.wickets || 0, higherBetter: true, unit: '' },
    { label: 'Bowling Economy', val1: p1.economy || 0, val2: p2.economy || 0, higherBetter: false, unit: '' },
    { label: 'Matches', val1: p1.matches || 0, val2: p2.matches || 0, higherBetter: true, unit: '' },
    { label: 'Market Value', val1: p1.price, val2: p2.price, higherBetter: false, unit: '$' },
  ];

  let p1Wins = 0;
  let p2Wins = 0;
  compareMetrics.forEach((m) => {
    const isP1Better = m.higherBetter ? m.val1 > m.val2 : m.val1 < m.val2 && m.val1 > 0;
    const isP2Better = m.higherBetter ? m.val2 > m.val1 : m.val2 < m.val1 && m.val2 > 0;
    if (isP1Better) p1Wins += 1;
    if (isP2Better) p2Wins += 1;
  });

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-400/20 text-cyan-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                Head-to-Head Player Comparison
              </h3>
              <p className="text-xs text-neutral-400">
                Compare cricket performance and fantasy metrics side-by-side
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            aria-label="Close modal"
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Selection Dropdowns */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-950/40 border-b border-neutral-800">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Player 1
            </label>
            <select
              value={player1Id}
              onChange={(e) => {
                playWhooshSound();
                setPlayer1Id(Number(e.target.value));
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white font-bold outline-none cursor-pointer"
            >
              {allPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.playerName} ({p.playerType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Player 2
            </label>
            <select
              value={player2Id}
              onChange={(e) => {
                playWhooshSound();
                setPlayer2Id(Number(e.target.value));
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white font-bold outline-none cursor-pointer"
            >
              {allPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.playerName} ({p.playerType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Head-to-Head Summary Scorecard */}
        <div className="py-2.5 px-4 bg-gradient-to-r from-yellow-500/10 via-neutral-900 to-cyan-500/10 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-yellow-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>{p1.playerName.split(' ')[0]}: {p1Wins}</span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
            {p1Wins > p2Wins
              ? `${p1.playerName} Leads`
              : p2Wins > p1Wins
              ? `${p2.playerName} Leads`
              : 'Statistical Tie'}
          </span>
          <div className="flex items-center gap-1.5 font-bold text-cyan-400">
            <span>{p2.playerName.split(' ')[0]}: {p2Wins}</span>
            <Trophy className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Players Card Heads */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-neutral-800 bg-neutral-900 text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={p1.playerImg}
                alt={p1.playerName}
                className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-yellow-400/80 bg-neutral-800 shadow-md"
                onError={(e) => { e.currentTarget.src = USER_PLACEHOLDER; }}
              />
              {p1.jerseyNumber && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-yellow-300 border border-white/20">
                  #{p1.jerseyNumber}
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-sm mt-2 text-white">{p1.playerName}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${theme1.bg} ${theme1.text}`}>
                {theme1.short}
              </span>
              <span className="text-[10px] text-neutral-400">{p1.playerType}</span>
            </div>
            <span className="text-xs font-bold text-yellow-400 mt-1">${p1.price.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={p2.playerImg}
                alt={p2.playerName}
                className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-cyan-400/80 bg-neutral-800 shadow-md"
                onError={(e) => { e.currentTarget.src = USER_PLACEHOLDER; }}
              />
              {p2.jerseyNumber && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-cyan-300 border border-white/20">
                  #{p2.jerseyNumber}
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-sm mt-2 text-white">{p2.playerName}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${theme2.bg} ${theme2.text}`}>
                {theme2.short}
              </span>
              <span className="text-[10px] text-neutral-400">{p2.playerType}</span>
            </div>
            <span className="text-xs font-bold text-cyan-400 mt-1">${p2.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric Comparisons */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {compareMetrics.map((m, idx) => {
            const isP1Better = m.higherBetter ? m.val1 > m.val2 : m.val1 < m.val2 && m.val1 > 0;
            const isP2Better = m.higherBetter ? m.val2 > m.val1 : m.val2 < m.val1 && m.val2 > 0;
            const maxVal = Math.max(m.val1, m.val2, 1);
            const p1Pct = Math.min(100, (m.val1 / maxVal) * 100);
            const p2Pct = Math.min(100, (m.val2 / maxVal) * 100);

            return (
              <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
                <div className="flex justify-between items-center mb-1 font-bold">
                  <span className={`flex items-center gap-1 ${isP1Better ? 'text-emerald-400 font-extrabold' : 'text-neutral-400'}`}>
                    {isP1Better && <Check className="w-3 h-3 text-emerald-400" />}
                    {m.unit === '$' ? `$${m.val1.toLocaleString()}` : `${m.val1} ${m.unit}`}
                  </span>
                  <span className="text-neutral-300 uppercase tracking-wider text-[11px] font-semibold">
                    {m.label}
                  </span>
                  <span className={`flex items-center gap-1 ${isP2Better ? 'text-emerald-400 font-extrabold' : 'text-neutral-400'}`}>
                    {m.unit === '$' ? `$${m.val2.toLocaleString()}` : `${m.val2} ${m.unit}`}
                    {isP2Better && <Check className="w-3 h-3 text-emerald-400" />}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 h-1.5 rounded-full overflow-hidden bg-neutral-800">
                  <div className="flex justify-end">
                    <div
                      className={`h-full rounded-l-full ${isP1Better ? 'bg-yellow-400' : 'bg-neutral-600'}`}
                      style={{ width: `${p1Pct}%` }}
                    />
                  </div>
                  <div className="flex justify-start">
                    <div
                      className={`h-full rounded-r-full ${isP2Better ? 'bg-cyan-400' : 'bg-neutral-600'}`}
                      style={{ width: `${p2Pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-right">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PlayerCompareModal;
