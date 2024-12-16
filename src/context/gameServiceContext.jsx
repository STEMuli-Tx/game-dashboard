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
    if (token) {
      GameService.setURL(persistentState.baseURL);
      setIsReady(true); // Set isReady to true when gameService is initialized
    }
  }, [token, persistentState.baseURL]);

  const setURL = useCallback(
    (url) => {
      if (url) {
        GameService.setBaseURL(url);
        setBaseURL(url);
        setUrlInit(true);
      } else {
        setUrlInit(false);
      }
    },
    [setUrlInit, setBaseURL]
  );

  const getQuests = async (tags) => GameService.getQuests(tags);

  const markKioskObjectivesComplete = async () => GameService.markKioskObjectivesComplete();

  const resetQuests = async (questIds) => GameService.resetQuests(questIds);

  const markQuestsComplete = async (questIds) => GameService.markQuestsComplete(questIds);

  const resetInventory = async () => GameService.resetInventory();

  const addAllInventoryItems = async () => GameService.addAllInventoryItems();

  const syncQuest = async () => GameService.syncQuest();

  const resetPlayerLevelData = async () => GameService.resetPlayerLevelData();

  const deleteTitlePlayer = async () => GameService.deleteTitlePlayer();

  const getRoamingNPCs = async () => GameService.getRoamingNPCs();

  const resetRoamingNPCs = async (ids) => GameService.resetRoamingNPCs(ids);

  const getStudents = async () => GameService.getStudents();

  const getNavigatorObjectiveDetails = async () => GameService.getNavigatorObjectiveDetails();

  const markLearningObjectivesComplete = async (data) =>
    GameService.markLearningObjectivesComplete(data);

  const getTags = async () => GameService.getTags();

  const getAvailableTags = async () => GameService.getAvailableTags();
  const updateUser = async (payload) => GameService.updateUser(payload);

  return (
    <GameServiceContext.Provider
      value={{
        setURL,
        persistentState,
        GameService,
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
        getAvailableTags,
        updateUser,
        urlInit,
      }}
    >
      {children}
    </GameServiceContext.Provider>
  );
};
