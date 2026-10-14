import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import LiveTicker from './components/layout/LiveTicker';
import Newsletter from './components/layout/Newsletter';
import Banner from './features/hero/Banner';
import StatsMarquee from './features/hero/StatsMarquee';
import Players from './features/players/Players';
import ClaimCoinsModal from './features/tournament/ClaimCoinsModal';
import MatchSimulatorModal from './features/simulator/MatchSimulatorModal';
import TournamentModal from './features/tournament/TournamentModal';
import { ThemeProvider } from './context/ThemeContext';
import { SquadProvider } from './context/SquadContext';
import { useSquad } from './context/useSquad';

function MainAppContent() {
  const {
    claimModalOpen,
    setClaimModalOpen,
    matchSimOpen,
    setMatchSimOpen,
    tournamentModalOpen,
    setTournamentModalOpen,
    selectedPlayers,
    captainId,
    viceCaptainId,
    handleClaimCoins,
    handleRewardCoins,
  } = useSquad();

  return (
    <>
      <ScrollProgress />
      <LiveTicker />
      <Navbar />
      <main>
        <Banner />
        <StatsMarquee />
        <Players />
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

function App() {
  return (
    <ThemeProvider>
      <SquadProvider>
        <MainAppContent />
      </SquadProvider>
    </ThemeProvider>
  );
}

export default App;
