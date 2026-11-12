import { useState, useMemo } from 'react';
import AvailablePlayer from './AvailablePlayer';
import SelectedPlayers from '../squad/SelectedPlayers';
import PlayerModal from './PlayerModal';
import { useStaggerReveal, useScrollReveal } from '../../hooks/useScrollAnimations';
import { playWhooshSound, playClickSound } from '../../utils/soundEffects';
import { Search, ArrowRightLeft, X, Sparkles, ArrowRight } from 'lucide-react';
import PlayerGridSkeleton from '../../components/ui/PlayerGridSkeleton';
import PlayerCompareModal from './PlayerCompareModal';
import { useSquad } from '../../context/useSquad';
import { useTheme } from '../../context/useTheme';

const PLAYER_TYPES = ['All Roles', 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper-Batsman'];

const ROLE_PILLS = [
  { id: 'All Roles', label: 'All Players', icon: null },
  { id: 'Batsman', label: 'Batsmen', icon: '🏏' },
  { id: 'Bowler', label: 'Bowlers', icon: '🎯' },
  { id: 'All-Rounder', label: 'All-Rounders', icon: '⚡' },
  { id: 'Wicketkeeper-Batsman', label: 'Wicketkeepers', icon: '🧤' },
  { id: 'Overseas', label: 'Overseas Stars', icon: '🌍' },
];

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
  const autoDraftTeam = props.autoDraftTeam || squad.autoDraftTeam;
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
  const [comparePlayer1Id, setComparePlayer1Id] = useState(null);
  const [quickViewPlayer, setQuickViewPlayer] = useState(null);

  const selectedIds = new Set(selectedPlayers.map((player) => player.id));
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollReveal({ threshold: 0.05 });

  // Role category counts
  const roleCounts = useMemo(() => {
    return {
      'All Roles': players.length,
      'Batsman': players.filter((p) => p.playerType === 'Batsman').length,
      'Bowler': players.filter((p) => p.playerType === 'Bowler').length,
      'All-Rounder': players.filter((p) => p.playerType === 'All-Rounder').length,
      'Wicketkeeper-Batsman': players.filter((p) => p.playerType === 'Wicketkeeper-Batsman').length,
      'Overseas': players.filter((p) => p.isOverseas).length,
    };
  }, [players]);

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
    if (filterRole === 'Overseas') {
      result = result.filter((p) => p.isOverseas);
    } else if (filterRole !== 'All Roles') {
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
          {/* Smart Auto-Draft Optimal XI trigger */}
          {selectedType === 'available' && (
            <button
              type="button"
              onClick={() => {
                playWhooshSound();
                if (autoDraftTeam) autoDraftTeam();
              }}
              disabled={selectedPlayers.length >= teamLimit}
              title={
                selectedPlayers.length >= teamLimit
                  ? 'Dream XI squad complete'
                  : 'Automatically draft balanced Dream XI with top stars and leadership'
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                selectedPlayers.length >= teamLimit
                  ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-400 text-neutral-950 hover:brightness-105 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
              <span>
                {selectedPlayers.length === 0
                  ? `✨ ${t('autoPick', 'Auto-Pick Dream XI')}`
                  : selectedPlayers.length >= teamLimit
                  ? `${t('teamFull', 'Team Full')} ✓`
                  : `✨ ${t('autoFill', 'Auto-Fill Squad')}`}
              </span>
            </button>
          )}

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

      {/* Quick Role Category Filter Chips */}
      {selectedType === 'available' && !loading && !loadError && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 mb-4 no-scrollbar">
          {ROLE_PILLS.map((pill) => {
            const isActive = filterRole === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setFilterRole(pill.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-neutral-950 shadow-sm border border-yellow-500/30 font-extrabold'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {pill.icon && <span>{pill.icon}</span>}
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-neutral-950/15 text-neutral-950' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {roleCounts[pill.id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filter Bar (visible only for Available tab) */}
      {selectedType === 'available' && !loading && !loadError && (
        <div className="flex flex-wrap items-center gap-2.5 mb-6 animate-fadeIn">
          {/* Search Box with Clear Button */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder', 'Search by name, team, country...')}
              aria-label="Search players by name, team, or country"
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSearchQuery('');
                }}
                aria-label="Clear search"
                title="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => {
                playClickSound();
                setFilterRole(e.target.value);
              }}
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
              onChange={(e) => {
                playClickSound();
                setFilterFranchise(e.target.value);
              }}
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
            onChange={(e) => {
              playClickSound();
              setSortBy(e.target.value);
            }}
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
                  onQuickView={(p) => setQuickViewPlayer(p)}
                  onComparePlayer={(p) => {
                    setComparePlayer1Id(p.id);
                    setCompareModalOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 my-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 text-yellow-500 mx-auto flex items-center justify-center mb-3 text-xl">
              🔍
            </div>
            <h3 className="text-base font-extrabold text-neutral-800 dark:text-white">
              No matching players found
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              We couldn't find any players matching "{searchQuery || filterRole}". Try resetting your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setSearchQuery('');
                setFilterRole('All Roles');
                setFilterFranchise('All Franchises');
                setSortBy('name');
              }}
              className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Reset All Filters
            </button>
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

      {/* Floating Quick Squad Dock (Only visible in Available Players tab when squad has members) */}
      {selectedType === 'available' && selectedPlayers.length > 0 && (
        <aside
          aria-label="Floating squad progress bar"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl p-3 px-4 rounded-2xl bg-neutral-950/90 text-white border border-white/15 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-slideUp"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-none">
              <div
                className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center shadow ${
                  selectedPlayers.length === teamLimit
                    ? 'bg-emerald-400 text-neutral-950 ring-2 ring-emerald-300/50'
                    : 'bg-yellow-400 text-neutral-950 ring-2 ring-yellow-300/50'
                }`}
              >
                {selectedPlayers.length}/{teamLimit}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white truncate">Dream XI Roster</span>
                <span className="text-[11px] font-mono text-yellow-300 font-bold flex-none">
                  ${coin.toLocaleString()} left
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate">
                <span>
                  {selectedPlayers.filter((p) => p.playerType.toLowerCase().includes('wicketkeeper')).length} WK
                </span>
                ·<span>{selectedPlayers.filter((p) => p.playerType === 'Batsman').length} BAT</span>·
                <span>{selectedPlayers.filter((p) => p.playerType === 'All-Rounder').length} AR</span>·
                <span>{selectedPlayers.filter((p) => p.playerType === 'Bowler').length} BOWL</span>
                {selectedPlayers.filter((p) => p.isOverseas).length > 0 && (
                  <span className="text-blue-300 font-medium">
                    · {selectedPlayers.filter((p) => p.isOverseas).length} 🌍
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playWhooshSound();
              setSelectedType('selected');
              const el = document.getElementById('players');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-none px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-black transition flex items-center gap-1.5 shadow active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>{selectedPlayers.length === teamLimit ? 'Field View & XI' : 'Review Squad'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Single Quick View Player Profile Modal */}
      {quickViewPlayer && (
        <PlayerModal
          player={quickViewPlayer}
          isOpen={Boolean(quickViewPlayer)}
          onClose={() => setQuickViewPlayer(null)}
          isSelected={selectedIds.has(quickViewPlayer.id)}
          isAtLimit={selectedPlayers.length >= teamLimit}
          onAddPlayer={onAddPlayer}
          onRemovePlayer={onRemovePlayer}
        />
      )}

      {/* Head-to-Head Compare Modal */}
      {compareModalOpen && (
        <PlayerCompareModal
          key={comparePlayer1Id || 'compare-modal'}
          isOpen={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          allPlayers={players}
          initialPlayer1Id={comparePlayer1Id}
        />
      )}
    </section>
  );
};

export default Players;
