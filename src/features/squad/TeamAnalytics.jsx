import { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Zap, Share2, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { playCoinSound, playCheerSound } from '../../utils/soundEffects';
import { generateSquadPoster } from '../../utils/posterExporter';

const TeamAnalytics = ({
  selectedPlayers,
  captainId,
  viceCaptainId,
  coin,
  teamLimit = 6,
  onOpenMatchSim,
}) => {
  const stats = useMemo(() => {
    const totalSpent = selectedPlayers.reduce((acc, p) => acc + p.price, 0);
    const avgRating = selectedPlayers.length
      ? (selectedPlayers.reduce((acc, p) => acc + p.rating, 0) / selectedPlayers.length).toFixed(1)
      : '0.0';

    const wkCount = selectedPlayers.filter((p) => p.playerType.toLowerCase().includes('wicketkeeper')).length;
    const batCount = selectedPlayers.filter((p) => p.playerType === 'Batsman').length;
    const arCount = selectedPlayers.filter((p) => p.playerType === 'All-Rounder').length;
    const bowlCount = selectedPlayers.filter((p) => p.playerType === 'Bowler').length;
    const overseasCount = selectedPlayers.filter((p) => p.isOverseas).length;

    // Batting Firepower (0-100)
    const avgSR = selectedPlayers.reduce((acc, p) => acc + (p.strikeRate || 100), 0) / (selectedPlayers.length || 1);
    const battingPower = Math.min(99, Math.round(avgSR * 0.68));

    // Bowling Threat (0-100)
    const totalWickets = selectedPlayers.reduce((acc, p) => acc + (p.wickets || 0), 0);
    const bowlingThreat = Math.min(99, Math.round(40 + (totalWickets / (selectedPlayers.length || 1)) * 0.7));

    // Power Score out of 100
    let powerScore = Math.round(Number(avgRating) * 10);
    if (captainId) powerScore += 3;
    if (viceCaptainId) powerScore += 2;
    if (wkCount >= 1) powerScore += 3;
    if (batCount >= 1 && bowlCount >= 1) powerScore += 2;
    powerScore = Math.min(100, Math.max(0, powerScore));

    return {
      totalSpent,
      avgRating,
      wkCount,
      batCount,
      arCount,
      bowlCount,
      overseasCount,
      powerScore,
      battingPower,
      bowlingThreat,
      isOverseasValid: overseasCount <= 4,
      hasWicketkeeper: wkCount >= 1,
    };
  }, [selectedPlayers, captainId, viceCaptainId]);

  const copySquadToClipboard = () => {
    if (!selectedPlayers.length) {
      toast.info('Assemble a team first before copying.');
      return;
    }
    const lines = [
      '🏏 My BPL Dream 11 Squad:',
      ...selectedPlayers.map((p, idx) => {
        let tag = '';
        if (p.id === captainId) tag = ' (C)';
        if (p.id === viceCaptainId) tag = ' (VC)';
        return `${idx + 1}. ${p.playerName} - ${p.playerType}${tag} [${p.playerCountry}]`;
      }),
      `\n⭐ Average Rating: ${stats.avgRating}/10`,
      `💰 Total Value: $${stats.totalSpent.toLocaleString()}`,
      '⚡ Built with BPL Dream 11!',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    playCoinSound();
    toast.success('Squad roster copied to clipboard!');
  };

  const handleDownloadPoster = async () => {
    try {
      playCheerSound();
      toast.info('Generating high-res squad poster...');
      await generateSquadPoster({
        selectedPlayers,
        captainId,
        viceCaptainId,
        teamPower: stats.powerScore,
      });
      toast.success('Downloaded my-bpl-dream-11.png!');
    } catch {
      toast.error('Failed to generate poster.');
    }
  };

  if (!selectedPlayers.length) return null;

  return (
    <div className="team-analytics-card rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-lg mb-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Squad Tactical Analytics
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time balance, tournament rules & power rating ({selectedPlayers.length}/{teamLimit} players)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copySquadToClipboard}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>

          <button
            type="button"
            onClick={handleDownloadPoster}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Download high-resolution squad poster image"
          >
            <Download className="w-3.5 h-3.5 text-yellow-500" /> Download Poster
          </button>

          {selectedPlayers.length >= 4 && (
            <button
              type="button"
              onClick={onOpenMatchSim}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-neutral-950 text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 animate-pulse cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate Match
            </button>
          )}
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Team Power Index
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-500">{stats.powerScore}</span>
            <span className="text-xs font-semibold text-neutral-400">/ 100</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.powerScore}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Average Rating
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-yellow-500">{stats.avgRating}</span>
            <span className="text-xs font-semibold text-neutral-400">★</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            {Number(stats.avgRating) >= 9.3 ? 'Elite Championship Tier' : 'Competitive Roster'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Squad Value Spent
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-neutral-900 dark:text-neutral-100">
              ${stats.totalSpent.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Budget Left: ${coin.toLocaleString()}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Overseas Quota
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-black ${stats.isOverseasValid ? 'text-blue-500' : 'text-red-500'}`}>
              {stats.overseasCount}
            </span>
            <span className="text-xs font-semibold text-neutral-400">/ max 4</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            {stats.isOverseasValid ? 'Within BPL Limit ✓' : 'Exceeds Overseas Limit!'}
          </p>
        </div>
      </div>

      {/* Visual Attribute Strength Meters & Leadership Bonus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-neutral-600 dark:text-neutral-300">Batting Firepower & Depth</span>
            <span className="text-amber-500 font-extrabold">{stats.battingPower}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.battingPower}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-neutral-600 dark:text-neutral-300">Bowling & Death Economy</span>
            <span className="text-blue-500 font-extrabold">{stats.bowlingThreat}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.bowlingThreat}%` }}
            />
          </div>
        </div>
      </div>

      {/* Leadership Multipliers & Warnings */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 font-medium">Composition:</span>
          <span className="px-2.5 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-bold">
            {stats.wkCount} Wicketkeeper{stats.wkCount !== 1 ? 's' : ''}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-bold">
            {stats.batCount} Batsmen
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold">
            {stats.arCount} All-Rounders
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-bold">
            {stats.bowlCount} Bowlers
          </span>
        </div>

        {/* Leadership Multiplier Badges */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
              captainId
                ? 'bg-yellow-400/20 text-yellow-500 dark:text-yellow-300 border border-yellow-400/40'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}
          >
            (C) {captainId ? '+100% Active' : 'Unassigned'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
              viceCaptainId
                ? 'bg-blue-400/20 text-blue-500 dark:text-blue-300 border border-blue-400/40'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}
          >
            (VC) {viceCaptainId ? '+50% Active' : 'Unassigned'}
          </span>
        </div>

        {/* Validation warnings */}
        {!stats.hasWicketkeeper && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold w-full pt-1">
            <AlertTriangle className="w-4 h-4 flex-none" />
            <span>Add at least 1 Wicketkeeper!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamAnalytics;
