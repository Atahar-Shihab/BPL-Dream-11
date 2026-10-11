import { useState } from 'react';
import { FaFlag, FaStar, FaUser } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import TiltCard3D from '../common/TiltCard3D';
import PlayerModal from '../modals/PlayerModal';
import { playBatShotSound } from '../../utils/soundEffects';
import { USER_PLACEHOLDER } from '../../utils/assets';

const AvailablePlayer = ({ player, isSelected, isAtLimit, onAddPlayer, onRemovePlayer, style }) => {
  const [modalOpen, setModalOpen] = useState(false);

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
            {/* Hover overlay with quick-view */}
            <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label={`View detailed profile for ${player.playerName}`}
                className="px-3.5 py-2 rounded-xl bg-white/20 text-white text-xs font-bold backdrop-blur-md hover:bg-white/30 transition flex items-center gap-1.5 shadow-lg active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" /> Quick View
              </button>
            </div>
            {/* Player type badge */}
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-yellow-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              {player.playerType}
            </span>
            {player.isOverseas && (
              <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md">
                Overseas
              </span>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="player-card-body">
            <h3 className="player-name"><FaUser aria-hidden="true" />{player.playerName}</h3>
            <div className="player-meta">
              <span><FaFlag aria-hidden="true" />{player.playerCountry}</span>
              <span className="player-role">{player.playerType}</span>
            </div>
            <div className="player-rating"><span>Rating</span><strong><FaStar aria-hidden="true" /> {player.rating}</strong></div>
            <div className="player-styles">
              <span>{player.battingStyle}</span>
              <span>{player.bowlingStyle}</span>
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
                className={isSelected ? 'choose-button is-selected' : 'choose-button'}
              >
                {isSelected ? 'Selected ✓' : isAtLimit ? 'Team Full' : 'Choose Player'}
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
