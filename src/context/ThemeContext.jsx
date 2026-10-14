import { useEffect, useState, useCallback } from 'react';
import { ThemeContext } from './useTheme';
import en from '../locales/en.json';
import bn from '../locales/bn.json';

const dictionaries = { en, bn };

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('bpl_dream11_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('bpl_dream11_language') || 'en';
    } catch {
      return 'en';
    }
  });

  // Sync dark class on <html>
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('bpl_dream11_dark_mode', String(isDarkMode));
    } catch {
      // ignore localStorage errors in sandboxed environments
    }
  }, [isDarkMode]);

  // Sync lang attribute on <html>
  useEffect(() => {
    try {
      document.documentElement.lang = language;
      localStorage.setItem('bpl_dream11_language', language);
    } catch {
      // ignore
    }
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const t = useCallback(
    (key, fallback = '') => {
      const dict = dictionaries[language] || dictionaries.en;
      return dict[key] || dictionaries.en[key] || fallback || key;
    },
    [language]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
