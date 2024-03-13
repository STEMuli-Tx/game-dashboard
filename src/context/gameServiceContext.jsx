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

  const resetInventory = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.resetInventory();
  };

  const addAllInventoryItems = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.addAllInventoryItems();
  };

  const syncQuest = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.syncQuest();
  };

  const resetPlayerLevelData = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.resetPlayerLevelData();
  };

  const getRoamingNPCs = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.getRoamingNPCs();
  };

  const resetRoamingNPCs = async (ids) => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.resetRoamingNPCs(ids);
  };

  return (
    <GameServiceContext.Provider
      value={{
        getQuests,
        resetQuests,
        markQuestsComplete,
        resetInventory,
        syncQuest,
        resetPlayerLevelData,
        getRoamingNPCs,
        resetRoamingNPCs,
        addAllInventoryItems,
      }}
    >
      {children}
    </GameServiceContext.Provider>
  );
};
