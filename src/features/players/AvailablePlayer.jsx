import { Eye, Flag, Star, User, ArrowRightLeft, Zap } from 'lucide-react';
import TiltCard3D from '../../components/ui/TiltCard3D';
import { playBatShotSound, playClickSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';
import { useTheme } from '../../context/useTheme';
import { getTeamTheme } from '../../utils/teamThemes';

const AvailablePlayer = ({
  player,
  isSelected,
  isAtLimit,
  onAddPlayer,
  onComparePlayer,
  onQuickView,
  style,
}) => {
  const { t } = useTheme();
  const teamTheme = getTeamTheme(player.bplTeam);

  return (
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
          <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1.5">
            {onComparePlayer && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
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
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                if (onQuickView) onQuickView(player);
              }}
              aria-label={`View detailed profile for ${player.playerName}`}
              title={t('quickView', 'Quick View profile')}
              className="p-1.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 text-white/90 hover:text-white border border-white/15 backdrop-blur-md shadow-md active:scale-90 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Hover Overlay with fully clickable Quick View & Compare buttons */}
          <div
            onClick={() => {
              playClickSound();
              if (onQuickView) onQuickView(player);
            }}
            className="absolute inset-0 bg-neutral-950/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex flex-col items-center justify-center gap-2 z-20 cursor-pointer pointer-events-auto"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                if (onQuickView) onQuickView(player);
              }}
              aria-label={`View detailed profile for ${player.playerName}`}
              className="px-4 py-2 rounded-xl bg-white/25 hover:bg-white/35 text-white text-xs font-bold backdrop-blur-md transition flex items-center gap-2 shadow-xl active:scale-95 cursor-pointer border border-white/20"
            >
              <Eye className="w-4 h-4 text-yellow-300" />
              <span>{t('quickView', 'Quick View')}</span>
            </button>

              {onComparePlayer && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onComparePlayer(player);
                  }}
                  aria-label={`Compare ${player.playerName}`}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 text-cyan-300 hover:text-white text-[11px] font-bold backdrop-blur-md transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer border border-cyan-400/30"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>{t('compare', 'Compare Stars')}</span>
                </button>
              )}
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

            <h3
              onClick={() => {
                playClickSound();
                if (onQuickView) onQuickView(player);
              }}
              className="player-name cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400 transition"
              title={t('quickView', 'Quick View profile')}
            >
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
  );
};

export default AvailablePlayer;
