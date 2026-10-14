import { createContext, useContext } from 'react';

export const STARTING_COINS = 65000;
export const TEAM_LIMIT = 6;

export const SquadContext = createContext(null);

export const useSquad = () => {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
};

export default useSquad;
