import { useState } from 'react';
import { Crown, Star, X } from 'lucide-react';
import { playBatShotSound, playWhooshSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';

const CricketPitchView = ({
  selectedPlayers,
  captainId,
  viceCaptainId,
  onSetCaptain,
  onSetViceCaptain,
  onRemovePlayer,
  teamLimit = 6,
}) => {
  const [activePlayer, setActivePlayer] = useState(null);

  // Ordered list of selected players to place into 6 tactical slots
  const slots = [
    { title: 'WK / Keeper End', top: '12%', left: '50%' },
    { title: 'Slip / Gully', top: '26%', left: '25%' },
    { title: 'Cover / Offside', top: '35%', left: '75%' },
    { title: 'Mid-Wicket Crease', top: '56%', left: '30%' },
    { title: 'Inner Circle / All-Round', top: '62%', left: '70%' },
    { title: 'Bowling Strike End', top: '84%', left: '50%' },
  ];

  return (
    <div className="cricket-pitch-container relative overflow-hidden rounded-3xl border-4 border-emerald-600/60 shadow-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 select-none min-h-[580px] p-4 sm:p-6 text-white flex flex-col justify-between">
      {/* Stadium Pitch Grass Stripes & Circles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,#000_0px,#000_28px,transparent_28px,transparent_56px)]" />

      {/* 30-yard inner circle line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[72%] rounded-full border-2 border-dashed border-white/25 pointer-events-none" />

      {/* 22-yard pitch strip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 h-[68%] bg-amber-200/25 border-x-2 border-white/40 shadow-inner rounded-sm pointer-events-none flex flex-col justify-between py-4 items-center">
        {/* Batting Crease & Stumps */}
        <div className="w-16 h-1 bg-white/70 shadow" />
        <div className="w-8 h-2 bg-amber-400/80 rounded-xs" />
        <div className="w-16 h-0.5 bg-white/30" />
        {/* Bowling Crease & Stumps */}
        <div className="w-8 h-2 bg-amber-400/80 rounded-xs" />
        <div className="w-16 h-1 bg-white/70 shadow" />
      </div>

      {/* Pitch Header Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Tactical 2.5D Formation View
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-yellow-300 font-bold">
            <Crown className="w-3.5 h-3.5 fill-current" /> (C) = 2x Points
          </span>
          <span className="flex items-center gap-1 text-blue-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" /> (VC) = 1.5x Points
          </span>
        </div>
      </div>

      {/* Field Player Nodes */}
      <div className="relative z-10 w-full h-[460px] my-4">
        {slots.map((slot, index) => {
          const player = selectedPlayers[index];
          const isCaptain = player && player.id === captainId;
          const isViceCaptain = player && player.id === viceCaptainId;

          return (
            <div
              key={index}
              style={{ top: slot.top, left: slot.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group"
            >
              {player ? (
                <div className="flex flex-col items-center">
                  {/* Badge Token */}
                  <div
                    onClick={() => {
                      playWhooshSound();
                      setActivePlayer(activePlayer?.id === player.id ? null : player);
                    }}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 cursor-pointer transition-transform duration-200 hover:scale-110 shadow-xl ${
                      isCaptain
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 ring-4 ring-yellow-400/60'
                        : isViceCaptain
                        ? 'bg-gradient-to-tr from-blue-500 to-cyan-300 ring-4 ring-cyan-400/60'
                        : 'bg-white/90 ring-2 ring-white/40'
                    }`}
                  >
                    <img
                      src={player.playerImg}
                      alt={player.playerName}
                      className="w-full h-full rounded-full object-cover object-top bg-neutral-800"
                      onError={(e) => {
                        e.currentTarget.src = USER_PLACEHOLDER;
                      }}
                    />

                    {/* Captain Badge Pill */}
                    {isCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-yellow-400 text-neutral-950 font-black text-[11px] flex items-center justify-center shadow-lg border border-white">
                        C
                      </span>
                    )}

                    {/* Vice-Captain Badge Pill */}
                    {isViceCaptain && (
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-500 text-white font-black text-[11px] flex items-center justify-center shadow-lg border border-white">
                        VC
                      </span>
                    )}

                    {/* Overseas Icon */}
                    {player.isOverseas && (
                      <span className="absolute -bottom-1 -left-1 text-[10px] bg-black/80 px-1 rounded-full">
                        🌍
                      </span>
                    )}
                  </div>

                  {/* Player Name Tag */}
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 text-center shadow-md max-w-[120px]">
                    <p className="text-[11px] font-bold truncate text-white leading-tight">
                      {player.playerName}
                    </p>
                    <p className="text-[9px] text-yellow-300 font-semibold leading-tight">
                      ${player.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quick Action Popover */}
                  {activePlayer?.id === player.id && (
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-xl bg-neutral-900 border border-white/20 shadow-2xl text-[11px] animate-fadeIn whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playBatShotSound();
                          onSetCaptain(player.id);
                          setActivePlayer(null);
                        }}
                        className={`px-2 py-1 rounded-lg font-bold transition ${
                          isCaptain
                            ? 'bg-yellow-400 text-neutral-950'
                            : 'bg-white/10 hover:bg-yellow-400 hover:text-neutral-950'
                        }`}
                      >
                        Make (C)
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playBatShotSound();
                          onSetViceCaptain(player.id);
                          setActivePlayer(null);
                        }}
                        className={`px-2 py-1 rounded-lg font-bold transition ${
                          isViceCaptain
                            ? 'bg-blue-400 text-neutral-950'
                            : 'bg-white/10 hover:bg-blue-400 hover:text-neutral-950'
                        }`}
                      >
                        Make (VC)
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePlayer(player.id);
                          setActivePlayer(null);
                        }}
                        className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Remove Player"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty Position Slot */
                <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center bg-black/20 text-xs font-bold text-white/70">
                    +{index + 1}
                  </div>
                  <span className="mt-1 text-[10px] bg-black/50 px-2 py-0.5 rounded-full text-white/70">
                    {slot.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Field Footer Guidelines */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-white/80">
        <span>Click any player badge to assign <strong>Captain (C)</strong> or <strong>Vice-Captain (VC)</strong></span>
        <span className="font-bold text-yellow-300">
          Squad: {selectedPlayers.length} / {teamLimit} Players
        </span>
      </div>
    </div>
  );
};

export default CricketPitchView;
