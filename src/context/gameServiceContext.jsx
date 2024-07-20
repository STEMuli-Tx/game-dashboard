import React, { useState, useEffect, useContext, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';

import GameService from '../utils/game-service';

const GameServiceContext = createContext();

export function useGameService() {
  return useContext(GameServiceContext);
}

export const GameServiceProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [gameService, setGameService] = useState(null);
  const [environment, setEnvironment] = useState('https://service-stm.stardevs.xyz/v1'); // Default environment
  const [isReady, setIsReady] = useState(false); // New loading state
  useEffect(() => {
    const handleStorageChange = (e) => {
      const localToken = localStorage.getItem('access_token');
      if (localToken) {
        setToken(localToken);
      }
    };

    const localToken = localStorage.getItem('access_token');
    if (localToken) {
      setToken(localToken);
    }

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);
  useEffect(() => {
    console.log('Current environment in context::::::', environment);
    if (token && !gameService) {
      setGameService(new GameService(token, environment));
      setIsReady(true); // Set isReady to true when gameService is initialized
    } else if (gameService) {
      gameService.setBaseURL(environment);
      console.log('Updating state environment', environment);
      setEnvironment(environment);
    }
  }, [token, environment, gameService]);

  const getQuests = async () => gameService.getQuests();

  const markKioskObjectivesComplete = async () => gameService.markKioskObjectivesComplete();

  const resetQuests = async (questIds) => gameService.resetQuests(questIds);

  const markQuestsComplete = async (questIds) => gameService.markQuestsComplete(questIds);

  const resetInventory = async () => gameService.resetInventory();

  const addAllInventoryItems = async () => gameService.addAllInventoryItems();

  const syncQuest = async () => gameService.syncQuest();

  const resetPlayerLevelData = async () => gameService.resetPlayerLevelData();

  const deleteTitlePlayer = async () => gameService.deleteTitlePlayer();

  const getRoamingNPCs = async () => gameService.getRoamingNPCs();

  const resetRoamingNPCs = async (ids) => gameService.resetRoamingNPCs(ids);

  const getStudents = async () => gameService.getStudents();

  const getNavigatorObjectiveDetails = async () => gameService.getNavigatorObjectiveDetails();

  const markLearningObjectivesComplete = async (data) =>
    gameService.markLearningObjectivesComplete(data);

  return (
    <GameServiceContext.Provider
      value={{
        setEnvironment,
        environment,
        gameService,
        isReady,
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
