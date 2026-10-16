import { useState } from 'react';
import { Eye, Flag, Star, User, ArrowRightLeft, Zap } from 'lucide-react';
import TiltCard3D from '../../components/ui/TiltCard3D';
import PlayerModal from './PlayerModal';
import { playBatShotSound, playClickSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';
import { useTheme } from '../../context/useTheme';
import { getTeamTheme } from '../../utils/teamThemes';

const AvailablePlayer = ({
  player,
  isSelected,
  isAtLimit,
  onAddPlayer,
  onRemovePlayer,
  onComparePlayer,
  style,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTheme();
  const teamTheme = getTeamTheme(player.bplTeam);

  return (
    <>
      <TiltCard3D className="player-card-3d" style={style}>
        <article className="player-card">
          <div className="player-photo-wrap relative group">
            <img
              src={player.playerImg}
              alt={player.playerName}
              className="player-photo"
              loading="lazy"
              onError={(event) => { event.currentTarget.src = USER_PLACEHOLDER; }}
            />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                {player.playerType}
              </span>
              {player.jerseyNumber && (
                <span className="px-2 py-0.5 rounded-full bg-black/75 text-yellow-300 font-mono text-[10px] font-black shadow-md border border-white/20">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>

            {player.isOverseas && (
              <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md">
                Overseas 🌍
              </span>
            )}

            {/* Quick Action Floating Buttons on Image */}
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5">
              {onComparePlayer && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onComparePlayer(player);
                  }}
                  aria-label={`Compare ${player.playerName}`}
                  title={t('compare', 'Compare Stars')}
                  className="p-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 text-cyan-300 hover:text-white border border-cyan-400/30 backdrop-blur-md shadow-md active:scale-90 transition cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setModalOpen(true);
                }}
                aria-label={`View detailed profile for ${player.playerName}`}
                title={t('quickView', 'Quick View profile')}
                className="p-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 text-white/90 hover:text-white border border-white/15 backdrop-blur-md shadow-md active:scale-90 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hover overlay on desktop */}
            <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-2 z-10 pointer-events-none">
              <span className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Eye className="w-3.5 h-3.5" /> {t('quickView', 'Quick View')}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="player-card-body">
            {/* Franchise Team Badge */}
            <div className="mb-1 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${teamTheme.bg} ${teamTheme.border} ${teamTheme.text}`}>
                {player.bplTeam || 'BPL Franchise'}
              </span>
              {player.strikeRate > 0 && (
                <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-amber-400" /> SR {player.strikeRate}
                </span>
              )}
            </div>

            <h3 className="player-name">
              <User className="w-4 h-4 inline mr-1 text-neutral-400" aria-hidden="true" />
              {player.playerName}
            </h3>

            <div className="player-meta">
              <span>
                <Flag className="w-3.5 h-3.5 inline mr-1 text-neutral-400" aria-hidden="true" />
                {player.playerCountry}
              </span>
              <span className="player-role">{player.playerType}</span>
            </div>

            <div className="player-rating">
              <span>{t('rating', 'Rating')}</span>
              <strong>
                <Star className="w-3.5 h-3.5 inline mr-1 text-amber-400 fill-amber-400" aria-hidden="true" />
                {player.rating}
              </strong>
            </div>

            <div className="player-styles flex flex-wrap gap-1.5 my-2">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium">
                {player.battingStyle}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] text-xs font-medium">
                {player.bowlingStyle}
              </span>
            </div>

            <div className="player-card-footer">
              <strong>${player.price.toLocaleString()}</strong>
              <button
                type="button"
                onClick={() => {
                  if (!isSelected && !isAtLimit) playBatShotSound();
                  onAddPlayer(player);
                }}
                disabled={isSelected || isAtLimit}
                aria-label={isSelected ? `${player.playerName} is selected` : isAtLimit ? 'Team limit reached' : `Add ${player.playerName} to squad for $${player.price.toLocaleString()}`}
                className={isSelected ? 'choose-button is-selected cursor-pointer' : 'choose-button cursor-pointer'}
              >
                {isSelected ? `${t('selectedText', 'Selected')} ✓` : isAtLimit ? t('teamFull', 'Team Full') : t('choosePlayer', 'Choose Player')}
              </button>
            </div>
          </div>
        </article>
      </TiltCard3D>

      <PlayerModal
        player={player}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSelected={isSelected}
        isAtLimit={isAtLimit}
        onAddPlayer={onAddPlayer}
        onRemovePlayer={onRemovePlayer}
      />
    </>
  );
};

export default AvailablePlayer;
