import { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, Trash2, Trophy, LayoutList, Shield, Crown, Star } from 'lucide-react';
import { playRemoveSound, playBatShotSound, playWhooshSound } from '../../utils/soundEffects';
import { triggerGrandCelebration } from '../../utils/confetti';
import { useStaggerReveal } from '../../hooks/useScrollAnimations';
import CricketPitchView from './CricketPitchView';
import TeamAnalytics from './TeamAnalytics';
import { USER_PLACEHOLDER } from '../../utils/assets';
import { useSquad } from '../../context/useSquad';
import { useTheme } from '../../context/useTheme';

const SelectedPlayers = (props) => {
  const squad = useSquad();
  const players = props.players || squad.selectedPlayers;
  const onRemovePlayer = props.onRemovePlayer || squad.removePlayer;
  const onClearTeam = props.onClearTeam || squad.clearTeam;
  const onAddMore = props.onAddMore;
  const captainId = props.captainId !== undefined ? props.captainId : squad.captainId;
  const viceCaptainId = props.viceCaptainId !== undefined ? props.viceCaptainId : squad.viceCaptainId;
  const onSetCaptain = props.onSetCaptain || squad.handleSetCaptain;
  const onSetViceCaptain = props.onSetViceCaptain || squad.handleSetViceCaptain;
  const coin = props.coin !== undefined ? props.coin : squad.coin;
  const onOpenMatchSim = props.onOpenMatchSim || (() => squad.setMatchSimOpen(true));
  const teamLimit = props.teamLimit || squad.teamLimit;
  const { t } = useTheme();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'pitch'
  const stagger = useStaggerReveal(players.length, 70);
  const celebratedRef = useRef(false);

  // Celebrate when team reaches full limit
  useEffect(() => {
    if (players.length === teamLimit && !celebratedRef.current) {
      celebratedRef.current = true;
      triggerGrandCelebration();
    }
    if (players.length < teamLimit) {
      celebratedRef.current = false;
    }
  }, [players.length, teamLimit]);

  if (!players.length) {
    return (
      <div className="empty-team">
        <Users className="w-10 h-10 text-neutral-300 mb-2" />
        <p>{t('emptySquad', 'Your squad is empty. Sign star players to assemble your Dream XI.')}</p>
        <button type="button" className="primary-button cursor-pointer" onClick={onAddMore}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          {t('browsePlayers', 'Browse Players')}
        </button>
      </div>
    );
  }

  return (
    <div className="selected-section space-y-4">
      {/* Team Analytics Bar */}
      <TeamAnalytics
        selectedPlayers={players}
        captainId={captainId}
        viceCaptainId={viceCaptainId}
        coin={coin}
        teamLimit={teamLimit}
        onOpenMatchSim={onOpenMatchSim}
      />

      {/* View Switcher Tabs & Squad Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Trophy className={`w-5 h-5 flex-none ${players.length === teamLimit ? 'text-yellow-500' : 'text-neutral-400'}`} />
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Squad Progress: <strong className="text-yellow-500">{players.length}/{teamLimit}</strong>
          </span>
        </div>

        {/* View Switch Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              playWhooshSound();
              setViewMode('list');
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" /> List View
          </button>
          <button
            type="button"
            onClick={() => {
              playWhooshSound();
              setViewMode('pitch');
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === 'pitch'
                ? 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 2.5D Field Formation
          </button>
        </div>
      </div>

      {players.length === teamLimit && (
        <div className="text-center py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold animate-bounce">
          🏆 Dream XI Squad Completed! Ready for tournament glory!
        </div>
      )}

      {/* Render selected view mode */}
      {viewMode === 'pitch' ? (
        <CricketPitchView
          selectedPlayers={players}
          captainId={captainId}
          viceCaptainId={viceCaptainId}
          onSetCaptain={onSetCaptain}
          onSetViceCaptain={onSetViceCaptain}
          onRemovePlayer={onRemovePlayer}
          teamLimit={teamLimit}
        />
      ) : (
        <div className="selected-list">
          {players.map((player, index) => {
            const isCaptain = player.id === captainId;
            const isViceCaptain = player.id === viceCaptainId;

            return (
              <article
                key={player.id}
                ref={stagger.setRef(index)}
                className={`selected-player transition-all duration-400 ${
                  stagger.isVisible(index)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-6'
                } ${
                  isCaptain
                    ? 'border-yellow-400/80 bg-yellow-50/20'
                    : isViceCaptain
                    ? 'border-blue-400/80 bg-blue-50/20'
                    : ''
                }`}
              >
                <div className="relative flex-none">
                  <img
                    src={player.playerImg}
                    alt=""
                    className="selected-player-image"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = USER_PLACEHOLDER; }}
                  />
                  {isCaptain && (
                    <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-full bg-yellow-400 text-neutral-950 text-[10px] font-black shadow border border-white">
                      C
                    </span>
                  )}
                  {isViceCaptain && (
                    <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black shadow border border-white">
                      VC
                    </span>
                  )}
                </div>

                <div className="selected-player-info">
                  <h3 className="flex items-center gap-2">
                    {player.playerName}
                    {player.isOverseas && <span className="text-xs" title="Overseas Player">🌍</span>}
                  </h3>
                  <p>{player.playerRole || player.playerType} · {player.playerCountry} · {player.bplTeam || 'Franchise'}</p>
                </div>

                {/* Captain / VC Quick Toggle Buttons */}
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    type="button"
                    onClick={() => {
                      playBatShotSound();
                      onSetCaptain(player.id);
                    }}
                    title="Set as Captain (2x Points)"
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1 ${
                      isCaptain
                        ? 'bg-yellow-400 text-neutral-950 shadow'
                        : 'border border-neutral-200 text-neutral-500 hover:border-yellow-400 hover:text-yellow-600'
                    }`}
                  >
                    <Crown className="w-3 h-3" /> C
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playBatShotSound();
                      onSetViceCaptain(player.id);
                    }}
                    title="Set as Vice-Captain (1.5x Points)"
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition flex items-center gap-1 ${
                      isViceCaptain
                        ? 'bg-blue-500 text-white shadow'
                        : 'border border-neutral-200 text-neutral-500 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    <Star className="w-3 h-3" /> VC
                  </button>
                </div>

                <p className="selected-player-price">${player.price.toLocaleString()}</p>

                <button
                  type="button"
                  className="remove-player"
                  aria-label={`Remove ${player.playerName}`}
                  onClick={() => {
                    playRemoveSound();
                    onRemovePlayer(player.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 transition" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="team-actions flex flex-wrap gap-2 pt-2">
        <button type="button" className="primary-button cursor-pointer" onClick={onAddMore}>
          <UserPlus className="w-4 h-4 mr-1" /> {t('addMore', 'Add More Players')}
        </button>
        <button type="button" className="secondary-button cursor-pointer" onClick={onClearTeam}>
          <Trash2 className="w-4 h-4 mr-1" /> {t('clearTeam', 'Clear Team')}
        </button>
        {players.length >= 4 && (
          <button
            type="button"
            onClick={onOpenMatchSim}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Trophy className="w-4 h-4" /> {t('simulateMatch', 'Simulate BPL Match')}
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectedPlayers;
