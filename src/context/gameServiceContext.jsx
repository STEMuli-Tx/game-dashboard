import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import GameService from '../utils/game-service.mjs';

const GameServiceContext = createContext();

export function useGameService() {
  return useContext(GameServiceContext);
}

export const GameServiceProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [gameService, setGameService] = useState(null);
  const [urlInit, setUrlInit] = useState(false);
  const [isReady, setIsReady] = useState(false); // New loading state
  const [persistentState, setPersistentState] = useState(() => {
    let baseURL = localStorage.getItem('baseURL');
    if (!baseURL) {
      localStorage.setItem('baseURL', import.meta.env.VITE_DEVELOP_GAME_SERVICE_BASE_URL);
      baseURL = import.meta.env.VITE_DEVELOP_GAME_SERVICE_BASE_URL;
    }
    return { baseURL };
  });

  const setBaseURL = useCallback((baseURL) => {
    localStorage.setItem('baseURL', baseURL);
    setPersistentState((prevState) => ({ ...prevState, baseURL }));
    return baseURL;
  }, []);
  useEffect(() => {
    const handleStorageChange = (e) => {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        setToken(localToken);
      }
    };

    const localToken = localStorage.getItem('token');
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
    console.log('Current environment in context::::::', persistentState.baseURL);
    if (token && !gameService) {
      setGameService(new GameService(token, persistentState.baseURL));
      setIsReady(true); // Set isReady to true when gameService is initialized
    }
  }, [token, persistentState.baseURL, gameService]);

  const setURL = useCallback(
    (url) => {
      if (gameService && url) {
        gameService.setBaseURL(url);
        setBaseURL(url);
        setUrlInit(true);
      } else {
        setUrlInit(false);
      }
    },
    [setUrlInit, setBaseURL, gameService]
  );

  const getQuests = async (tags) => gameService.getQuests(tags);

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

  const getTags = async () => gameService.getTags();

  return (
    <GameServiceContext.Provider
      value={{
        setURL,
        persistentState,
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
        getTags,
        urlInit,
      }}
    >
      {children}
    </GameServiceContext.Provider>
  );
};
