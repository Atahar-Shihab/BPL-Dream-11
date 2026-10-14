import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { DATA_JSON_URL, getAssetUrl } from '../utils/assets';
import { triggerConfetti } from '../utils/confetti';
import { playCoinSound, playBatShotSound } from '../utils/soundEffects';
import { SquadContext, STARTING_COINS, TEAM_LIMIT } from './useSquad';

export const SquadProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Persisted state
  const [selectedPlayers, setSelectedPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('bpl_dream11_selected');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coin, setCoin] = useState(() => {
    try {
      const saved = localStorage.getItem('bpl_dream11_coin');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        return Number.isFinite(parsed) ? parsed : STARTING_COINS;
      }
      return STARTING_COINS;
    } catch {
      return STARTING_COINS;
    }
  });

  const [captainId, setCaptainId] = useState(() => {
    try {
      return localStorage.getItem('bpl_dream11_captain') || null;
    } catch {
      return null;
    }
  });

  const [viceCaptainId, setViceCaptainId] = useState(() => {
    try {
      return localStorage.getItem('bpl_dream11_vice_captain') || null;
    } catch {
      return null;
    }
  });

  // Modal open states for centralized access
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [matchSimOpen, setMatchSimOpen] = useState(false);
  const [tournamentModalOpen, setTournamentModalOpen] = useState(false);

  // Fetch players on mount
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

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bpl_dream11_selected', JSON.stringify(selectedPlayers));
    } catch {
      // ignore
    }
  }, [selectedPlayers]);

  useEffect(() => {
    try {
      localStorage.setItem('bpl_dream11_coin', String(coin));
    } catch {
      // ignore
    }
  }, [coin]);

  useEffect(() => {
    try {
      if (captainId) {
        localStorage.setItem('bpl_dream11_captain', captainId);
      } else {
        localStorage.removeItem('bpl_dream11_captain');
      }
    } catch {
      // ignore
    }
  }, [captainId]);

  useEffect(() => {
    try {
      if (viceCaptainId) {
        localStorage.setItem('bpl_dream11_vice_captain', viceCaptainId);
      } else {
        localStorage.removeItem('bpl_dream11_vice_captain');
      }
    } catch {
      // ignore
    }
  }, [viceCaptainId]);

  const addPlayer = useCallback((player) => {
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
  }, [captainId, coin, selectedPlayers, viceCaptainId]);

  const removePlayer = useCallback((playerId) => {
    const player = selectedPlayers.find((selected) => selected.id === playerId);
    if (!player) return;

    setSelectedPlayers((current) => current.filter((selected) => selected.id !== playerId));
    setCoin((current) => current + player.price);

    if (captainId === playerId) setCaptainId(null);
    if (viceCaptainId === playerId) setViceCaptainId(null);

    toast.info(`${player.playerName} released from team.`);
  }, [captainId, selectedPlayers, viceCaptainId]);

  const clearTeam = useCallback(() => {
    setCoin((current) => current + selectedPlayers.reduce((total, player) => total + player.price, 0));
    setSelectedPlayers([]);
    setCaptainId(null);
    setViceCaptainId(null);
    toast.info('Your team has been cleared.');
  }, [selectedPlayers]);

  const handleClaimCoins = useCallback((amount) => {
    setCoin((current) => current + amount);
    playCoinSound();
  }, []);

  const handleRewardCoins = useCallback((amount) => {
    setCoin((current) => current + amount);
  }, []);

  const handleSetCaptain = useCallback((id) => {
    if (viceCaptainId === id) {
      setViceCaptainId(captainId); // Swap
    }
    setCaptainId(id);
    const p = selectedPlayers.find((pl) => pl.id === id);
    if (p) toast.success(`👑 ${p.playerName} is now Team Captain (2x Points)!`);
  }, [captainId, selectedPlayers, viceCaptainId]);

  const handleSetViceCaptain = useCallback((id) => {
    if (captainId === id) {
      setCaptainId(viceCaptainId); // Swap
    }
    setViceCaptainId(id);
    const p = selectedPlayers.find((pl) => pl.id === id);
    if (p) toast.info(`⭐ ${p.playerName} is now Vice-Captain (1.5x Points)!`);
  }, [captainId, selectedPlayers, viceCaptainId]);

  return (
    <SquadContext.Provider
      value={{
        players,
        selectedPlayers,
        coin,
        loading,
        loadError,
        teamLimit: TEAM_LIMIT,
        captainId,
        viceCaptainId,
        claimModalOpen,
        setClaimModalOpen,
        matchSimOpen,
        setMatchSimOpen,
        tournamentModalOpen,
        setTournamentModalOpen,
        addPlayer,
        removePlayer,
        clearTeam,
        handleClaimCoins,
        handleRewardCoins,
        handleSetCaptain,
        handleSetViceCaptain,
      }}
    >
      {children}
    </SquadContext.Provider>
  );
};

export default SquadProvider;
