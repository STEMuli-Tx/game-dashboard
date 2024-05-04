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
    const handleStorageChange = (e) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setToken(token);
      }
    };

    // Get the initial token value
    const token = localStorage.getItem('access_token');
    if (token) {
      setToken(token);
    }

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const getQuests = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.getQuests();
  };

  const markKioskObjectivesComplete = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.markKioskObjectivesComplete();
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

  const deleteTitlePlayer = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.deleteTitlePlayer();
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

  const getStudents = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.getStudents();
  };

  const getNavigatorObjectiveDetails = async () => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.getNavigatorObjectiveDetails();
  };

  const markLearningObjectivesComplete = async (data) => {
    // Optionally initialize anything else here
    const gameService = new GameService(token);
    return gameService.markLearningObjectivesComplete(data);
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
        markKioskObjectivesComplete,
        getStudents,
        getNavigatorObjectiveDetails,
        markLearningObjectivesComplete,
        deleteTitlePlayer,
      }}
    >
      {children}
    </GameServiceContext.Provider>
  );
};
