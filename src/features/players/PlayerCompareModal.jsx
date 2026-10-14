import { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { playWhooshSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';

const PlayerCompareModal = ({ isOpen, onClose, allPlayers }) => {
  const [player1Id, setPlayer1Id] = useState(allPlayers[0]?.id || 1);
  const [player2Id, setPlayer2Id] = useState(allPlayers[1]?.id || 2);

  if (!isOpen || !allPlayers.length) return null;

  const p1 = allPlayers.find((p) => p.id === Number(player1Id)) || allPlayers[0];
  const p2 = allPlayers.find((p) => p.id === Number(player2Id)) || allPlayers[1];

  const compareMetrics = [
    { label: 'Rating', val1: p1.rating, val2: p2.rating, higherBetter: true, unit: '★' },
    { label: 'Runs Scored', val1: p1.runs || 0, val2: p2.runs || 0, higherBetter: true, unit: '' },
    { label: 'Batting Strike Rate', val1: p1.strikeRate || 0, val2: p2.strikeRate || 0, higherBetter: true, unit: '' },
    { label: 'Wickets Taken', val1: p1.wickets || 0, val2: p2.wickets || 0, higherBetter: true, unit: '' },
    { label: 'Bowling Economy', val1: p1.economy || 0, val2: p2.economy || 0, higherBetter: false, unit: '' },
    { label: 'Matches', val1: p1.matches || 0, val2: p2.matches || 0, higherBetter: true, unit: '' },
    { label: 'Market Fee', val1: p1.price, val2: p2.price, higherBetter: false, unit: '$' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
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
              <h3 className="text-base sm:text-lg font-black">
                Head-to-Head Player Comparison
              </h3>
              <p className="text-xs text-neutral-400">
                Compare cricket metrics and fantasy performance side-by-side
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
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
                setPlayer1Id(e.target.value);
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
                setPlayer2Id(e.target.value);
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

        {/* Players Card Heads */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-neutral-800 bg-neutral-900 text-center">
          <div className="flex flex-col items-center">
            <img
              src={p1.playerImg}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-yellow-400/60 bg-neutral-800 shadow-md"
              onError={(e) => { e.currentTarget.src = USER_PLACEHOLDER; }}
            />
            <h4 className="font-extrabold text-sm mt-2 text-white">{p1.playerName}</h4>
            <span className="text-[10px] text-neutral-400">{p1.playerCountry} · {p1.playerType}</span>
            <span className="text-xs font-bold text-yellow-400 mt-1">${p1.price.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={p2.playerImg}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-cyan-400/60 bg-neutral-800 shadow-md"
              onError={(e) => { e.currentTarget.src = USER_PLACEHOLDER; }}
            />
            <h4 className="font-extrabold text-sm mt-2 text-white">{p2.playerName}</h4>
            <span className="text-[10px] text-neutral-400">{p2.playerCountry} · {p2.playerType}</span>
            <span className="text-xs font-bold text-cyan-400 mt-1">${p2.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric Comparisons */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {compareMetrics.map((m, idx) => {
            const isP1Better = m.higherBetter ? m.val1 > m.val2 : m.val1 < m.val2 && m.val1 > 0;
            const isP2Better = m.higherBetter ? m.val2 > m.val1 : m.val2 < m.val1 && m.val2 > 0;
            const maxVal = Math.max(m.val1, m.val2, 1);
            const p1Pct = Math.min(100, (m.val1 / maxVal) * 100);
            const p2Pct = Math.min(100, (m.val2 / maxVal) * 100);

            return (
              <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
                <div className="flex justify-between items-center mb-1 font-bold">
                  <span className={isP1Better ? 'text-emerald-400 font-extrabold' : 'text-neutral-400'}>
                    {m.unit === '$' ? `$${m.val1.toLocaleString()}` : `${m.val1} ${m.unit}`}
                  </span>
                  <span className="text-neutral-300 uppercase tracking-wider text-[11px] font-semibold">
                    {m.label}
                  </span>
                  <span className={isP2Better ? 'text-emerald-400 font-extrabold' : 'text-neutral-400'}>
                    {m.unit === '$' ? `$${m.val2.toLocaleString()}` : `${m.val2} ${m.unit}`}
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
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCompareModal;
