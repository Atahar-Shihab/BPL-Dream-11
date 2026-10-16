/**
 * Team branding and theme configuration for BPL franchises
 */

export const TEAM_THEMES = {
  'Fortune Barishal': {
    name: 'Fortune Barishal',
    short: 'FB',
    color: '#f59e0b',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/15',
    text: 'text-amber-500 dark:text-amber-400',
    badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-bold',
    accentBorder: 'border-amber-500/50',
  },
  'Comilla Victorians': {
    name: 'Comilla Victorians',
    short: 'CV',
    color: '#f43f5e',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/15',
    text: 'text-rose-500 dark:text-rose-400',
    badge: 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold',
    accentBorder: 'border-rose-500/50',
  },
  'Rangpur Riders': {
    name: 'Rangpur Riders',
    short: 'RR',
    color: '#10b981',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-500 dark:text-emerald-400',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold',
    accentBorder: 'border-emerald-500/50',
  },
  'Sylhet Strikers': {
    name: 'Sylhet Strikers',
    short: 'SS',
    color: '#0ea5e9',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/15',
    text: 'text-sky-500 dark:text-sky-400',
    badge: 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold',
    accentBorder: 'border-sky-500/50',
  },
  'Dhaka Dominators': {
    name: 'Dhaka Dominators',
    short: 'DD',
    color: '#8b5cf6',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/15',
    text: 'text-purple-500 dark:text-purple-400',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold',
    accentBorder: 'border-purple-500/50',
  },
  'Durdanto Dhaka': {
    name: 'Durdanto Dhaka',
    short: 'DD',
    color: '#8b5cf6',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/15',
    text: 'text-purple-500 dark:text-purple-400',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold',
    accentBorder: 'border-purple-500/50',
  },
  'Chattogram Challengers': {
    name: 'Chattogram Challengers',
    short: 'CC',
    color: '#ec4899',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/15',
    text: 'text-pink-500 dark:text-pink-400',
    badge: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold',
    accentBorder: 'border-pink-500/50',
  },
  'International': {
    name: 'International Stars',
    short: 'INT',
    color: '#6366f1',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-500 dark:text-indigo-400',
    badge: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold',
    accentBorder: 'border-indigo-500/50',
  },
};

const DEFAULT_THEME = {
  name: 'BPL All-Stars',
  short: 'BPL',
  color: '#eab308',
  border: 'border-yellow-500/30',
  bg: 'bg-yellow-500/15',
  text: 'text-yellow-500 dark:text-yellow-400',
  badge: 'bg-yellow-400 text-neutral-950 font-bold',
  accentBorder: 'border-yellow-500/50',
};

export const getTeamTheme = (teamName) => {
  if (!teamName) return DEFAULT_THEME;
  return TEAM_THEMES[teamName] || DEFAULT_THEME;
};
