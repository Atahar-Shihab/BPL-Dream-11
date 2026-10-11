import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Banner from './components/banner/Banner';
import StatsMarquee from './components/Stats/StatsMarquee';
import Players from './components/players/Players';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import LiveTicker from './components/common/LiveTicker';
import ClaimCoinsModal from './components/modals/ClaimCoinsModal';
import MatchSimulatorModal from './components/modals/MatchSimulatorModal';
import TournamentModal from './components/modals/TournamentModal';
import { triggerConfetti } from './utils/confetti';
import { playCoinSound, playBatShotSound } from './utils/soundEffects';

import { DATA_JSON_URL, getAssetUrl } from './utils/assets';

const STARTING_COINS = 65000;
const TEAM_LIMIT = 6;

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [coin, setCoin] = useState(STARTING_COINS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [matchSimOpen, setMatchSimOpen] = useState(false);
  const [tournamentModalOpen, setTournamentModalOpen] = useState(false);
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetch(DATA_JSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load the player list.');
        return response.json();
      })
      .then((data) => {
        if (isActive) {
          const resolved = data.map((p) => ({
            ...p,
            playerImg: p.playerImg && p.playerImg.startsWith('http')
              ? p.playerImg
              : getAssetUrl(p.playerImg || 'assets/user.png'),
          }));
          setPlayers(resolved);
        }
      })
      .catch(() => {
        if (isActive) setLoadError('Players could not be loaded. Please refresh the page.');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => { isActive = false; };
  }, []);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addPlayer = (player) => {
    if (selectedPlayers.some((selected) => selected.id === player.id)) {
      toast.info(`${player.playerName} is already in your team.`);
      return;
    }
    if (selectedPlayers.length >= TEAM_LIMIT) {
      toast.error(`Your team can have up to ${TEAM_LIMIT} players.`);
      return;
    }
    if (coin < player.price) {
      toast.error('You do not have enough coins. Claim a free grant in the top bar!');
      return;
    }

    setSelectedPlayers((current) => [...current, player]);
    setCoin((current) => current - player.price);

    // Auto-assign Captain / VC if first two players
    if (!captainId) {
      setCaptainId(player.id);
    } else if (!viceCaptainId) {
      setViceCaptainId(player.id);
    }

    playBatShotSound();
    triggerConfetti();
    toast.success(`${player.playerName} signed to your Dream XI!`);
  };

  const removePlayer = (playerId) => {
    const player = selectedPlayers.find((selected) => selected.id === playerId);
    if (!player) return;

    setSelectedPlayers((current) => current.filter((selected) => selected.id !== playerId));
    setCoin((current) => current + player.price);

    if (captainId === playerId) setCaptainId(null);
    if (viceCaptainId === playerId) setViceCaptainId(null);

    toast.info(`${player.playerName} released from team.`);
  };

  const clearTeam = () => {
    setCoin((current) => current + selectedPlayers.reduce((total, player) => total + player.price, 0));
    setSelectedPlayers([]);
    setCaptainId(null);
    setViceCaptainId(null);
    toast.info('Your team has been cleared.');
  };

  const handleClaimCoins = (amount) => {
    setCoin((current) => current + amount);
    playCoinSound();
  };

  const handleRewardCoins = (amount) => {
    setCoin((current) => current + amount);
  };

  const handleSetCaptain = (id) => {
    if (viceCaptainId === id) {
      setViceCaptainId(captainId); // Swap
    }
    setCaptainId(id);
    const p = selectedPlayers.find((pl) => pl.id === id);
    if (p) toast.success(`👑 ${p.playerName} is now Team Captain (2x Points)!`);
  };

  const handleSetViceCaptain = (id) => {
    if (captainId === id) {
      setCaptainId(viceCaptainId); // Swap
    }
    setViceCaptainId(id);
    const p = selectedPlayers.find((pl) => pl.id === id);
    if (p) toast.info(`⭐ ${p.playerName} is now Vice-Captain (1.5x Points)!`);
  };

  return (
    <>
      <ScrollProgress />
      <LiveTicker />
      <Navbar
        coin={coin}
        onOpenClaimModal={() => setClaimModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenTournamentModal={() => setTournamentModalOpen(true)}
      />
      <main>
        <Banner />
        <StatsMarquee />
        <Players
          players={players}
          selectedPlayers={selectedPlayers}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onClearTeam={clearTeam}
          loading={loading}
          loadError={loadError}
          teamLimit={TEAM_LIMIT}
          captainId={captainId}
          viceCaptainId={viceCaptainId}
          onSetCaptain={handleSetCaptain}
          onSetViceCaptain={handleSetViceCaptain}
          coin={coin}
          onOpenMatchSim={() => setMatchSimOpen(true)}
        />
        <Newsletter />
      </main>
      <Footer />

      {/* Claim Sponsorship Modal */}
      <ClaimCoinsModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaimCoins={handleClaimCoins}
      />

      {/* BPL Live Match Simulator Modal */}
      <MatchSimulatorModal
        isOpen={matchSimOpen}
        onClose={() => setMatchSimOpen(false)}
        selectedPlayers={selectedPlayers}
        captainId={captainId}
        viceCaptainId={viceCaptainId}
        onRewardCoins={handleRewardCoins}
      />

      {/* BPL Tournament Standings & Trophy Room Modal */}
      <TournamentModal
        isOpen={tournamentModalOpen}
        onClose={() => setTournamentModalOpen(false)}
        selectedCount={selectedPlayers.length}
        hasCaptain={Boolean(captainId && viceCaptainId)}
        hasOverseas={selectedPlayers.some((p) => p.isOverseas)}
        onOpenMatchSim={() => {
          setTournamentModalOpen(false);
          setMatchSimOpen(true);
        }}
      />

      <ToastContainer position="top-right" autoClose={2600} newestOnTop />
    </>
  );
}

export default App;
