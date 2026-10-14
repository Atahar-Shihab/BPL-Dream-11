import { useState, useMemo } from 'react';
import AvailablePlayer from './AvailablePlayer';
import SelectedPlayers from '../squad/SelectedPlayers';
import { useStaggerReveal, useScrollReveal } from '../../hooks/useScrollAnimations';
import { playWhooshSound } from '../../utils/soundEffects';
import { Search, ArrowRightLeft } from 'lucide-react';
import PlayerGridSkeleton from '../../components/ui/PlayerGridSkeleton';
import PlayerCompareModal from './PlayerCompareModal';
import { useSquad } from '../../context/useSquad';
import { useTheme } from '../../context/useTheme';

const PLAYER_TYPES = ['All Roles', 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper-Batsman'];

const FRANCHISES = [
  'All Franchises',
  'Fortune Barishal',
  'Comilla Victorians',
  'Rangpur Riders',
  'Sylhet Strikers',
  'Chattogram Challengers',
  'International',
];

const Players = (props) => {
  const squad = useSquad();
  const players = props.players || squad.players;
  const selectedPlayers = props.selectedPlayers || squad.selectedPlayers;
  const onAddPlayer = props.onAddPlayer || squad.addPlayer;
  const onRemovePlayer = props.onRemovePlayer || squad.removePlayer;
  const onClearTeam = props.onClearTeam || squad.clearTeam;
  const loading = props.loading !== undefined ? props.loading : squad.loading;
  const loadError = props.loadError !== undefined ? props.loadError : squad.loadError;
  const teamLimit = props.teamLimit || squad.teamLimit;
  const captainId = props.captainId !== undefined ? props.captainId : squad.captainId;
  const viceCaptainId = props.viceCaptainId !== undefined ? props.viceCaptainId : squad.viceCaptainId;
  const onSetCaptain = props.onSetCaptain || squad.handleSetCaptain;
  const onSetViceCaptain = props.onSetViceCaptain || squad.handleSetViceCaptain;
  const coin = props.coin !== undefined ? props.coin : squad.coin;
  const onOpenMatchSim = props.onOpenMatchSim || (() => squad.setMatchSimOpen(true));

  const { t } = useTheme();
  const [selectedType, setSelectedType] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterFranchise, setFilterFranchise] = useState('All Franchises');
  const [sortBy, setSortBy] = useState('name');
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const selectedIds = new Set(selectedPlayers.map((player) => player.id));
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.05 });

  // Filter and sort available players
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.playerName.toLowerCase().includes(q) ||
          p.playerCountry.toLowerCase().includes(q) ||
          p.playerType.toLowerCase().includes(q) ||
          (p.bplTeam && p.bplTeam.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (filterRole !== 'All Roles') {
      result = result.filter((p) => p.playerType === filterRole);
    }

    // Franchise filter
    if (filterFranchise !== 'All Franchises') {
      result = result.filter((p) => p.bplTeam === filterFranchise);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => a.playerName.localeCompare(b.playerName));
    }

    return result;
  }, [players, searchQuery, filterRole, filterFranchise, sortBy]);

  const stagger = useStaggerReveal(filteredPlayers.length, 50);

  return (
    <section
      ref={sectionRef}
      id="players"
      className={`players-section page-container transition-all duration-700 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="players-heading">
        <h2>
          {selectedType === 'available'
            ? t('available', 'Available Players')
            : `${t('selected', 'Selected Squad')} (${selectedPlayers.length}/${teamLimit})`}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Compare Players trigger */}
          {players.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                playWhooshSound();
                setCompareModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-yellow-500" /> {t('compare', 'Compare Stars')}
            </button>
          )}

          <div className="player-tabs" role="tablist" aria-label="Player lists">
            <button
              type="button"
              role="tab"
              aria-selected={selectedType === 'available'}
              onClick={() => {
                playWhooshSound();
                setSelectedType('available');
              }}
              className={selectedType === 'available' ? 'player-tab is-active cursor-pointer' : 'player-tab cursor-pointer'}
            >
              {t('available', 'Available')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedType === 'selected'}
              onClick={() => {
                playWhooshSound();
                setSelectedType('selected');
              }}
              className={selectedType === 'selected' ? 'player-tab is-active cursor-pointer' : 'player-tab cursor-pointer'}
            >
              {t('selectedText', 'Selected')} <span className="tab-count">({selectedPlayers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar (visible only for Available tab) */}
      {selectedType === 'available' && !loading && !loadError && (
        <div className="flex flex-wrap items-center gap-2.5 mb-6 animate-fadeIn">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', 'Search by name, team, country...')}
              aria-label="Search players by name, team, or country"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              aria-label="Filter players by role"
              className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:border-yellow-400 outline-none cursor-pointer"
            >
              {PLAYER_TYPES.map((type) => (
                <option key={type} value={type} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Franchise Filter */}
          <div className="relative">
            <select
              value={filterFranchise}
              onChange={(e) => setFilterFranchise(e.target.value)}
              aria-label="Filter players by franchise"
              className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:border-yellow-400 outline-none cursor-pointer"
            >
              {FRANCHISES.map((team) => (
                <option key={team} value={team} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort players"
            className="px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:border-yellow-400 outline-none cursor-pointer"
          >
            <option value="name" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">Sort: Name (A-Z)</option>
            <option value="rating" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">Sort: Top Rating ★</option>
            <option value="price-low" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">Sort: Price (Low → High)</option>
            <option value="price-high" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">Sort: Price (High → Low)</option>
          </select>

          {/* Results count pill */}
          <span className="text-xs text-neutral-500 dark:text-neutral-300 font-bold px-2.5 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            {filteredPlayers.length} / {players.length} Players
          </span>
        </div>
      )}

      {loading ? (
        <PlayerGridSkeleton count={6} />
      ) : loadError ? (
        <div className="players-message error-message" role="alert">{loadError}</div>
      ) : selectedType === 'available' ? (
        filteredPlayers.length ? (
          <div className="player-grid">
            {filteredPlayers.map((player, index) => (
              <div
                key={player.id}
                ref={stagger.setRef(index)}
                className={`transition-all duration-500 ${
                  stagger.isVisible(index)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <AvailablePlayer
                  player={player}
                  isSelected={selectedIds.has(player.id)}
                  isAtLimit={selectedPlayers.length >= teamLimit}
                  onAddPlayer={onAddPlayer}
                  onRemovePlayer={onRemovePlayer}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="players-message">
            {searchQuery || filterRole !== 'All Roles' || filterFranchise !== 'All Franchises'
              ? 'No players match your search criteria. Try adjusting your filters.'
              : 'No players are available right now.'}
          </div>
        )
      ) : (
        <SelectedPlayers
          players={selectedPlayers}
          onRemovePlayer={onRemovePlayer}
          onClearTeam={onClearTeam}
          onAddMore={() => setSelectedType('available')}
          captainId={captainId}
          viceCaptainId={viceCaptainId}
          onSetCaptain={onSetCaptain}
          onSetViceCaptain={onSetViceCaptain}
          coin={coin}
          onOpenMatchSim={onOpenMatchSim}
          teamLimit={teamLimit}
        />
      )}

      {/* Head-to-Head Compare Modal */}
      <PlayerCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        allPlayers={players}
      />
    </section>
  );
};

export default Players;
