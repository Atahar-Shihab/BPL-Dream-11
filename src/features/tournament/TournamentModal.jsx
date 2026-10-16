import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, CheckCircle2, Lock, Zap, Calendar, MapPin, Users, Sparkles } from 'lucide-react';
import tournamentFixtures from '../../data/tournamentFixtures.json';
import stadiumVenues from '../../data/stadiumVenues.json';
import { playClickSound } from '../../utils/soundEffects';
import { getTeamTheme } from '../../utils/teamThemes';
import ThreeCricketStadium from '../hero/ThreeCricketStadium';

const INITIAL_STANDINGS = [
  { rank: 1, name: 'Comilla Victorians', played: 6, won: 5, lost: 1, pts: 10, nrr: '+1.420', form: ['W', 'W', 'L', 'W', 'W'] },
  { rank: 2, name: 'Fortune Barishal', played: 6, won: 4, lost: 2, pts: 8, nrr: '+0.885', form: ['L', 'W', 'W', 'W', 'L'] },
  { rank: 3, name: 'Your Dream XI', played: 6, won: 4, lost: 2, pts: 8, nrr: '+0.612', isUser: true, form: ['W', 'L', 'W', 'W', 'W'] },
  { rank: 4, name: 'Rangpur Riders', played: 6, won: 3, lost: 3, pts: 6, nrr: '+0.120', form: ['W', 'W', 'L', 'L', 'W'] },
  { rank: 5, name: 'Sylhet Strikers', played: 6, won: 2, lost: 4, pts: 4, nrr: '-0.740', form: ['L', 'L', 'W', 'L', 'L'] },
  { rank: 6, name: 'Chattogram Challengers', played: 6, won: 0, lost: 6, pts: 0, nrr: '-2.297', form: ['L', 'L', 'L', 'L', 'L'] },
];

const TournamentModal = ({
  isOpen,
  onClose,
  selectedCount,
  hasCaptain,
  hasOverseas,
  onOpenMatchSim,
}) => {
  const [activeTab, setActiveTab] = useState('standings'); // 'standings' | 'trophies' | 'fixtures'

  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const achievements = [
    {
      id: 'recruit',
      title: 'First Signature',
      desc: 'Signed your first player to the franchise',
      unlocked: selectedCount >= 1,
      icon: '🏏',
    },
    {
      id: 'leadership',
      title: 'Leadership Core',
      desc: 'Designated Team Captain (2x) & Vice-Captain (1.5x)',
      unlocked: hasCaptain,
      icon: '👑',
    },
    {
      id: 'overseas',
      title: 'Global Star Power',
      desc: 'Signed an overseas international superstar',
      unlocked: hasOverseas,
      icon: '🌍',
    },
    {
      id: 'full_squad',
      title: 'Squad Complete',
      desc: 'Assembled full 6-player championship XI',
      unlocked: selectedCount >= 6,
      icon: '🏆',
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                BPL 2026 Championship Center
              </h3>
              <p className="text-xs text-neutral-400">
                Official franchise standings, form guides, fixtures & achievements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-neutral-950/40 border-b border-neutral-800 gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('standings');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'standings'
                ? 'bg-yellow-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Points Table
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('fixtures');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'fixtures'
                ? 'bg-yellow-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Fixtures & Venues
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('trophies');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'trophies'
                ? 'bg-yellow-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Trophies ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'standings' && (
            <div>
              <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Team</th>
                      <th className="py-3 px-2 text-center">P</th>
                      <th className="py-3 px-2 text-center">W</th>
                      <th className="py-3 px-2 text-center">L</th>
                      <th className="py-3 px-2 text-center">NRR</th>
                      <th className="py-3 px-2 text-center hidden sm:table-cell">Recent Form</th>
                      <th className="py-3 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {INITIAL_STANDINGS.map((row) => {
                      const theme = getTeamTheme(row.name);
                      return (
                        <tr
                          key={row.name}
                          className={`transition hover:bg-neutral-800/50 ${
                            row.isUser
                              ? 'bg-yellow-400/10 font-bold text-yellow-300'
                              : 'text-neutral-300'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono text-[11px]">{row.rank}</td>
                          <td className="py-3 px-3 flex items-center gap-2">
                            {!row.isUser && (
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${theme.bg} ${theme.text}`}>
                                {theme.short}
                              </span>
                            )}
                            <span>{row.name}</span>
                            {row.isUser && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400 text-neutral-950 font-black">
                                YOU
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral-400">{row.played}</td>
                          <td className="py-3 px-2 text-center text-emerald-400 font-bold">{row.won}</td>
                          <td className="py-3 px-2 text-center text-red-400">{row.lost}</td>
                          <td className="py-3 px-2 text-center font-mono text-[11px] text-neutral-400">
                            {row.nrr}
                          </td>
                          {/* 5-Match Form Pills */}
                          <td className="py-3 px-2 text-center hidden sm:table-cell">
                            <div className="flex items-center justify-center gap-1">
                              {row.form.map((res, fIdx) => (
                                <span
                                  key={fIdx}
                                  className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-xs ${
                                    res === 'W'
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-rose-500 text-white'
                                  }`}
                                >
                                  {res}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-white text-sm">{row.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-neutral-400 mt-3 text-center">
                Top 4 franchises qualify for the BPL 2026 Playoffs & Final.
              </p>
            </div>
          )}

          {activeTab === 'fixtures' && (
            <div className="space-y-6">
              {/* Upcoming Matches */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Upcoming BPL League Fixtures
                </h4>
                <div className="space-y-2.5">
                  {tournamentFixtures.map((fixture) => (
                    <div
                      key={fixture.match}
                      className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-neutral-800 flex items-center justify-center text-xs font-black text-amber-400 flex-none">
                          #{fixture.match}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{fixture.home}</span>
                            <span className="text-amber-400 font-black text-[11px]">VS</span>
                            <span>{fixture.away}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400" /> {fixture.venue}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {fixture.match === 1 ? 'Matchday 1 • Tonight' : `Matchday ${fixture.match}`}
                        </span>
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300">
                          {fixture.time} BST
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Iconic Stadium Venues */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Official Stadium Venues
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stadiumVenues.map((venue) => (
                    <div
                      key={venue.name}
                      className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-black text-white line-clamp-1">{venue.name}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{venue.city}</div>
                      </div>
                      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-400" /> {venue.capacity.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold text-[10px]">
                          {venue.pitchType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trophies' && (
            <div className="space-y-4">
              {/* 3D Interactive BPL Championship Trophy Showcase */}
              <div className="p-4 rounded-3xl bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border border-yellow-500/30 text-center relative overflow-hidden shadow-inner">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  3D Interactive Championship Trophy
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  Inspect the official BPL 2026 Gold Cup in 360° • Drag to rotate
                </p>
                <div className="w-full flex justify-center">
                  <ThreeCricketStadium initialMode="trophy" />
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-emerald-500/40 shadow-lg'
                        : 'bg-neutral-950/60 border-neutral-800/80 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl p-2 rounded-2xl bg-neutral-800 flex-none">
                        {ach.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black">{ach.title}</h4>
                          {ach.unlocked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none" />
                          ) : (
                            <Lock className="w-4 h-4 text-neutral-500 flex-none" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">{ach.desc}</p>
                        <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ach.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-500'
                        }`}>
                          {ach.unlocked ? 'Unlocked ✓' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl text-neutral-400 hover:text-white transition"
          >
            Close
          </button>

          {selectedCount >= 4 && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMatchSim();
              }}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 text-neutral-950 text-xs font-black hover:bg-yellow-300 transition flex items-center gap-1.5 shadow"
            >
              <Zap className="w-4 h-4 fill-current" /> Play Championship Fixture
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TournamentModal;
