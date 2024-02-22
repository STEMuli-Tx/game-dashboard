import React, { createContext, useContext, useEffect, useState } from 'react';
import GameService from '../utils/game-service';
import Cookies from 'js-cookie';
import { useRouter } from 'src/routes/hooks';

const GameServiceContext = createContext();

export function useGameService() {
  return useContext(GameServiceContext);
}

export const GameServiceProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get('access_token');
    // Optionally verify the token's validity with your backend here
    if (token) {
      const accessToken = Cookies.get('access_token');
      setToken(accessToken);
    }
  }, [router]);

  const getQuests = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.getQuests();
  };

  const resetQuests = async (questIds) => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.resetQuests(questIds);
  };

  const markQuestsComplete = async (questIds) => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.markQuestsComplete(questIds);
  };

  return (
    <GameServiceContext.Provider value={{ getQuests, resetQuests, markQuestsComplete }}>
      {children}
    </GameServiceContext.Provider>
  );
};
