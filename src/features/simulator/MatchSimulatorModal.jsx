import { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Trophy, Star, Crown, Award, Loader2, Sparkles } from 'lucide-react';
import { playBatShotSound, playCheerSound, playRemoveSound } from '../../utils/soundEffects';
import { triggerGrandCelebration, triggerCoinShower } from '../../utils/confetti';
import { toast } from 'react-toastify';
import fantasyScoringTable from '../../data/fantasyScoringTable.json';

const OPPONENT_TEAMS = [
  { id: 'comilla', name: 'Comilla Victorians', rating: 9.4, color: 'from-red-600 to-rose-500' },
  { id: 'barishal', name: 'Fortune Barishal', rating: 9.3, color: 'from-orange-500 to-amber-500' },
  { id: 'rangpur', name: 'Rangpur Riders', rating: 9.2, color: 'from-blue-600 to-indigo-500' },
  { id: 'sylhet', name: 'Sylhet Strikers', rating: 9.1, color: 'from-emerald-600 to-teal-500' },
];

const generateOpponentTarget = () => ({
  runs: Math.floor(45 + Math.random() * 25),
  wickets: Math.floor(2 + Math.random() * 3),
});

const MatchSimulatorModal = ({
  isOpen,
  onClose,
  selectedPlayers,
  captainId,
  viceCaptainId,
  onRewardCoins,
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState(OPPONENT_TEAMS[0]);
  const [matchStatus, setMatchStatus] = useState('idle'); // idle | simulating | finished
  const [currentBall, setCurrentBall] = useState(0);
  const [userScore, setUserScore] = useState({ runs: 0, wickets: 0 });
  const [opponentScore, setOpponentScore] = useState({ runs: 0, wickets: 0 });
  const [commentary, setCommentary] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [fantasyPoints, setFantasyPoints] = useState({});

  const totalOvers = 5;
  const totalBalls = totalOvers * 6;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const captain = selectedPlayers.find((p) => p.id === captainId) || selectedPlayers[0];
  const viceCaptain = selectedPlayers.find((p) => p.id === viceCaptainId) || selectedPlayers[1] || selectedPlayers[0];

  const startSimulation = () => {
    setMatchStatus('simulating');
    setCurrentBall(0);
    setUserScore({ runs: 0, wickets: 0 });
    setCommentary([]);
    setMatchResult(null);

    // Initial opponent target to beat
    const target = generateOpponentTarget();
    setOpponentScore(target);

    let runs = 0;
    let wickets = 0;
    let ball = 0;
    const playerPoints = {};
    selectedPlayers.forEach((p) => {
      playerPoints[p.id] = 0;
    });

    const ballInterval = setInterval(() => {
      ball += 1;
      setCurrentBall(ball);

      // Random outcome
      const rand = Math.random();
      const currentBatter = selectedPlayers[Math.floor(Math.random() * selectedPlayers.length)];
      let ballText = '';

      if (rand < 0.12 && wickets < 5) {
        // Wicket
        wickets += 1;
        playRemoveSound();
        ballText = `🔴 WICKET! ${currentBatter.playerName} is caught out! (${runs}/${wickets})`;
      } else if (rand < 0.28) {
        // Dot ball
        ballText = `⚪ Dot ball. Good tight line and length.`;
      } else if (rand < 0.55) {
        // Single or 2 runs - 1 pt per run
        const r = Math.random() > 0.6 ? 2 : 1;
        runs += r;
        const pts = r * fantasyScoringTable.batting.run;
        playerPoints[currentBatter.id] = (playerPoints[currentBatter.id] || 0) + pts;
        ballText = `🏏 ${currentBatter.playerName} rotates strike for ${r} run${r > 1 ? 's' : ''} (+${pts} pts).`;
      } else if (rand < 0.82) {
        // FOUR! - 4 runs + fourBonus (1) = 5 pts
        runs += 4;
        playBatShotSound();
        const fourPts = (4 * fantasyScoringTable.batting.run) + fantasyScoringTable.batting.fourBonus;
        playerPoints[currentBatter.id] = (playerPoints[currentBatter.id] || 0) + fourPts;
        ballText = `💥 FOUR! ${currentBatter.playerName} crunches it through covers (+${fourPts} pts)!`;
      } else {
        // SIX! - 6 runs + sixBonus (2) = 8 pts
        runs += 6;
        playBatShotSound();
        const sixPts = (6 * fantasyScoringTable.batting.run) + fantasyScoringTable.batting.sixBonus;
        playerPoints[currentBatter.id] = (playerPoints[currentBatter.id] || 0) + sixPts;
        ballText = `🚀 MASSIVE SIX! ${currentBatter.playerName} clears the stadium boundary (+${sixPts} pts)!`;
      }

      // Wickets taken by your bowling attack during opponent's defense
      if (rand > 0.88) {
        const bowlers = selectedPlayers.filter((p) => p.playerType === 'Bowler' || p.playerType === 'All-Rounder');
        const bowler = bowlers.length ? bowlers[Math.floor(Math.random() * bowlers.length)] : selectedPlayers[0];
        if (bowler) {
          playerPoints[bowler.id] = (playerPoints[bowler.id] || 0) + fantasyScoringTable.bowling.wicket;
        }
      }

      setUserScore({ runs, wickets });
      setCommentary((prev) => [ballText, ...prev.slice(0, 7)]);

      // Check early chase win
      if (runs > target.runs || ball >= totalBalls || wickets >= 6) {
        clearInterval(ballInterval);
        endMatch(runs, wickets, target.runs, playerPoints);
      }
    }, 450);

    timerRef.current = ballInterval;
  };

  const endMatch = (finalRuns, finalWickets, targetRuns, points) => {
    setMatchStatus('finished');
    const won = finalRuns > targetRuns;

    // Apply Captain 2x and VC 1.5x
    if (captain) points[captain.id] = Math.round((points[captain.id] || 0) * 2);
    if (viceCaptain && viceCaptain.id !== captain?.id) {
      points[viceCaptain.id] = Math.round((points[viceCaptain.id] || 0) * 1.5);
    }
    setFantasyPoints(points);

    if (won) {
      setMatchResult({
        won: true,
        margin: `${6 - finalWickets} wickets`,
        reward: 15000,
      });
      playCheerSound();
      triggerGrandCelebration();
      triggerCoinShower();
      onRewardCoins(15000);
      toast.success('🏆 VICTORY! Earned +15,000 Coins for winning the BPL match!');
    } else {
      setMatchResult({
        won: false,
        margin: `${targetRuns - finalRuns + 1} runs`,
        reward: 2500,
      });
      toast.info('Tough match! Better tactics needed next time.');
      onRewardCoins(2500);
    }
  };

  // Find MVP
  const topPlayerId = Object.keys(fantasyPoints).reduce(
    (best, id) => (fantasyPoints[id] > (fantasyPoints[best] || 0) ? id : best),
    null
  );
  const mvpPlayer = topPlayerId ? selectedPlayers.find((p) => p.id === Number(topPlayerId)) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-400/20 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                BPL Match Simulator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  5-Over Blitz
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Put your Dream 11 lineup to the ultimate match test
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Fantasy Scoring Rules Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-[11px]">
            <span className="font-bold text-yellow-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Official Fantasy Scoring Rules:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                Run: +{fantasyScoringTable.batting.run}pt
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300">
                4s: +{(4 * fantasyScoringTable.batting.run) + fantasyScoringTable.batting.fourBonus}pts (+{fantasyScoringTable.batting.fourBonus} bonus)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-lime-500/15 text-lime-300">
                6s: +{(6 * fantasyScoringTable.batting.run) + fantasyScoringTable.batting.sixBonus}pts (+{fantasyScoringTable.batting.sixBonus} bonus)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300">
                Wicket: +{fantasyScoringTable.bowling.wicket}pts
              </span>
            </div>
          </div>

          {/* Opponent Selection (only when idle) */}
          {matchStatus === 'idle' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Select BPL Opponent Franchise:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {OPPONENT_TEAMS.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedOpponent(team)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedOpponent.id === team.id
                        ? 'border-yellow-400 bg-neutral-800 ring-2 ring-yellow-400/30'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{team.name}</span>
                      <span className="text-xs font-bold text-yellow-400">★ {team.rating}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">Championship Franchise</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stadium Scoreboard */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 shadow-inner">
            <div className="grid grid-cols-2 gap-4 text-center items-center">
              {/* User Team */}
              <div className="border-r border-neutral-800 pr-2">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                  Your Dream XI
                </span>
                <div className="text-3xl sm:text-4xl font-black mt-1 text-white tabular-nums">
                  {userScore.runs}/{userScore.wickets}
                </div>
                <span className="text-xs text-neutral-400">
                  Overs: {(Math.floor(currentBall / 6) + (currentBall % 6) / 10).toFixed(1)} / {totalOvers}.0
                </span>
              </div>

              {/* Opponent Target */}
              <div className="pl-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  {selectedOpponent.name}
                </span>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-neutral-300 tabular-nums">
                  {opponentScore.runs}/{opponentScore.wickets}
                </div>
                <span className="text-xs text-neutral-400">
                  Target: {opponentScore.runs + 1}
                </span>
              </div>
            </div>
          </div>

          {/* Captain Multiplier Indicator */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-xs">
            <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
              <Crown className="w-3.5 h-3.5" /> (C) {captain.playerName} [2.0x Points]
            </span>
            <span className="flex items-center gap-1.5 text-blue-300 font-bold">
              <Star className="w-3.5 h-3.5" /> (VC) {viceCaptain.playerName} [1.5x Points]
            </span>
          </div>

          {/* Live Ball-by-ball Commentary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${matchStatus === 'simulating' ? 'bg-red-500 animate-ping' : 'bg-neutral-500'}`} />
              Live Ball Commentary:
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs">
              {commentary.length ? (
                commentary.map((comm, idx) => (
                  <p key={idx} className={idx === 0 ? 'text-yellow-300 font-bold animate-fadeIn' : 'text-neutral-400'}>
                    {comm}
                  </p>
                ))
              ) : (
                <p className="text-neutral-600 italic">Press &quot;Start Match Simulation&quot; to bowl the first over...</p>
              )}
            </div>
          </div>

          {/* Match Finished Result Card */}
          {matchStatus === 'finished' && matchResult && (
            <div className={`p-4 rounded-2xl border text-center animate-fadeIn ${
              matchResult.won
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/40 border-red-500/50 text-red-300'
            }`}>
              <h4 className="text-xl font-black mb-1">
                {matchResult.won ? '🎉 Match Won by Your Dream XI!' : 'Match Defeat!'}
              </h4>
              <p className="text-xs opacity-90">
                {matchResult.won ? `Won by ${matchResult.margin}` : `Lost by ${matchResult.margin}`}
              </p>

              {mvpPlayer && (
                <div className="mt-2 text-xs flex items-center justify-center gap-1.5 text-yellow-300 font-bold">
                  <Award className="w-3.5 h-3.5" /> MVP of the Match: {mvpPlayer.playerName} ({fantasyPoints[mvpPlayer.id]} pts)
                </div>
              )}

              {/* Individual Player Fantasy Points Breakdown */}
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-left">
                {selectedPlayers.map((p) => (
                  <div key={p.id} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <span className="truncate text-neutral-300 font-medium">
                      {p.id === captainId ? '👑 ' : p.id === viceCaptainId ? '⭐ ' : ''}{p.playerName}
                    </span>
                    <span className="font-bold text-yellow-400 font-mono ml-2">
                      {fantasyPoints[p.id] || 0} pts
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-neutral-950 font-black text-xs">
                <span>+{matchResult.reward.toLocaleString()} Bonus Coins Awarded!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl text-neutral-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>

          {matchStatus === 'idle' ? (
            <button
              type="button"
              onClick={startSimulation}
              className="px-6 py-2.5 rounded-xl bg-yellow-400 text-neutral-950 font-black text-xs hover:bg-yellow-300 active:scale-95 transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Start Match Simulation
            </button>
          ) : matchStatus === 'finished' ? (
            <button
              type="button"
              onClick={startSimulation}
              className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-yellow-400 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Rematch Simulation
            </button>
          ) : (
            <span className="text-xs text-yellow-400 font-bold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-yellow-400" /> Simulating overs...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchSimulatorModal;
