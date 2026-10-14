import { useState } from 'react';
import { Coins, Menu, X, Volume2, VolumeX, Moon, Sun, Trophy, Globe } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { isSoundEnabled, setSoundEnabled, playWhooshSound } from '../../utils/soundEffects';
import { LOGO_IMG, CURRENCY_IMG } from '../../utils/assets';
import { useSquad } from '../../context/useSquad';
import { useTheme } from '../../context/useTheme';

const Navbar = ({
  coin: propCoin,
  onOpenClaimModal: propOpenClaim,
  isDarkMode: propDarkMode,
  onToggleDarkMode: propToggleDark,
  onOpenTournamentModal: propOpenTournament,
}) => {
  const { coin: ctxCoin, setClaimModalOpen, setTournamentModalOpen } = useSquad();
  const { isDarkMode: ctxDarkMode, toggleDarkMode, language, setLanguage, t } = useTheme();

  const coin = propCoin !== undefined ? propCoin : ctxCoin;
  const isDarkMode = propDarkMode !== undefined ? propDarkMode : ctxDarkMode;
  const onToggleDarkMode = propToggleDark || toggleDarkMode;
  const onOpenClaimModal = propOpenClaim || (() => setClaimModalOpen(true));
  const onOpenTournamentModal = propOpenTournament || (() => setTournamentModalOpen(true));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playWhooshSound();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
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
            <a href="#top">{t('home', 'Home')}</a>
            <a href="#players">{t('playersTab', 'Players')}</a>
            <button
              type="button"
              onClick={() => {
                playWhooshSound();
                onOpenTournamentModal();
              }}
              className="hover:text-yellow-500 transition flex items-center gap-1 cursor-pointer bg-transparent border-0 font-medium"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> {t('standings', 'Standings')}
            </button>
            <a href="#footer">{t('about', 'About')}</a>
          </div>

          {/* Language Toggle EN | বাং */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-yellow-500 hover:border-yellow-400/50 transition flex items-center gap-1 cursor-pointer shadow-xs"
            title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
            aria-label="Toggle language between English and Bengali"
          >
            <Globe className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
            <span className={language === 'en' ? 'text-yellow-600 dark:text-yellow-400 font-extrabold' : 'opacity-60 font-medium'}>
              EN
            </span>
            <span className="opacity-30">|</span>
            <span className={language === 'bn' ? 'text-yellow-600 dark:text-yellow-400 font-extrabold' : 'opacity-60 font-medium'}>
              বাং
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-yellow-500 transition cursor-pointer"
            title={soundOn ? 'Mute Stadium Audio' : 'Unmute Stadium Audio'}
            aria-label="Toggle Sound Effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* Dark / Stadium Night Match Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-yellow-500 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Day Match' : 'Switch to Floodlight Night Match'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Claim Coins Button */}
          <button
            type="button"
            onClick={onOpenClaimModal}
            className="claim-coins-btn cursor-pointer"
            title={t('claimCoins', 'Claim free coins')}
          >
            <Coins className="w-4 h-4" />
            <span>{t('claimShort', 'Claim')}</span>
          </button>

          {/* Coin Balance */}
          <div className="coin-balance" aria-label={`${coin.toLocaleString()} coins available`}>
            <AnimatedCounter value={coin} suffix={` ${t('coins', 'Coins')}`} />
            <img src={CURRENCY_IMG} alt="" />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-menu-btn cursor-pointer"
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
          <a href="#top" onClick={() => setMobileOpen(false)}>{t('home', 'Home')}</a>
          <a href="#players" onClick={() => setMobileOpen(false)}>{t('playersTab', 'Players')}</a>
          <button
            type="button"
            onClick={() => {
              playWhooshSound();
              onOpenTournamentModal();
              setMobileOpen(false);
            }}
            className="text-left text-sm text-neutral-700 dark:text-neutral-300 font-bold py-1.5 flex items-center gap-2 bg-transparent border-0 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-yellow-500" /> {t('bplStandings', 'BPL Standings & Trophy Room')}
          </button>
          <a href="#footer" onClick={() => setMobileOpen(false)}>{t('about', 'About')}</a>

          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Language / ভাষা</span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300"
            >
              {language === 'en' ? 'বাংলা (বাং)' : 'English (EN)'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{t('audioEffects', 'Audio Effects')}</span>
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{t('stadiumMode', 'Stadium Mode')}</span>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => { onOpenClaimModal(); setMobileOpen(false); }}
            className="claim-coins-btn w-full justify-center mt-2 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            {t('claimCoins', 'Claim Free Coins')}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
