import { useState } from 'react';
import { Coins, Menu, X, Volume2, VolumeX, Moon, Sun, Trophy } from 'lucide-react';
import Currency from '/assets/Currency.png';
import AnimatedCounter from '../common/AnimatedCounter';
import { isSoundEnabled, setSoundEnabled, playWhooshSound } from '../../utils/soundEffects';
import { LOGO_IMG } from '../../utils/assets';

const Navbar = ({
  coin,
  onOpenClaimModal,
  isDarkMode,
  onToggleDarkMode,
  onOpenTournamentModal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playWhooshSound();
  };

  return (
    <header className="site-header">
      <nav className="navbar page-container" aria-label="Main navigation">
        <a href="#top" className="brand" aria-label="Dream 11 Cricket home">
          <img src={LOGO_IMG} alt="Dream 11 Cricket" />
        </a>

        {/* Desktop Nav */}
        <div className="nav-right">
          <div className="nav-links">
            <a href="#top">Home</a>
            <a href="#players">Players</a>
            <button
              type="button"
              onClick={() => {
                playWhooshSound();
                onOpenTournamentModal();
              }}
              className="hover:text-yellow-500 transition flex items-center gap-1 cursor-pointer bg-transparent border-0 font-medium"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Standings
            </button>
            <a href="#footer">About</a>
          </div>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-yellow-500 transition"
            title={soundOn ? 'Mute Stadium Audio' : 'Unmute Stadium Audio'}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* Dark / Stadium Night Match Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-yellow-500 transition"
            title={isDarkMode ? 'Switch to Day Match' : 'Switch to Floodlight Night Match'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Claim Coins Button */}
          <button
            type="button"
            onClick={onOpenClaimModal}
            className="claim-coins-btn"
            title="Claim free coins"
          >
            <Coins className="w-4 h-4" />
            <span>Claim</span>
          </button>

          {/* Coin Balance */}
          <div className="coin-balance" aria-label={`${coin.toLocaleString()} coins available`}>
            <AnimatedCounter value={coin} suffix=" Coins" />
            <img src={Currency} alt="" />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer animate-slideDown">
          <a href="#top" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="#players" onClick={() => setMobileOpen(false)}>Players</a>
          <button
            type="button"
            onClick={() => {
              playWhooshSound();
              onOpenTournamentModal();
              setMobileOpen(false);
            }}
            className="text-left text-sm text-neutral-700 dark:text-neutral-300 font-bold py-1.5 flex items-center gap-2 bg-transparent border-0 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-yellow-500" /> BPL Standings & Trophy Room
          </button>
          <a href="#footer" onClick={() => setMobileOpen(false)}>About</a>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Audio Effects</span>
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Stadium Mode</span>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => { onOpenClaimModal(); setMobileOpen(false); }}
            className="claim-coins-btn w-full justify-center mt-2"
          >
            <Coins className="w-4 h-4" />
            Claim Free Coins
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
