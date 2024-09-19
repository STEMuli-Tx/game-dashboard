import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import ApiService from '../utils/api-service.mjs';

const ApiServiceContext = createContext();

export function useApiService() {
  return useContext(ApiServiceContext);
}

export const ApiServiceProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [service, setService] = useState(null);
  const [baseURL, setBaseURL] = useState(import.meta.env.VITE_DEVELOP_API_SERVICE_BASE_URL); // Default environment\
  const [urlInit, setUrlInit] = useState(false);
  const [isReady, setIsReady] = useState(false); // New loading state
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
    console.log('Current environment in context::::::', baseURL);
    if (token && !service) {
      setService(new ApiService(token, baseURL));
      setIsReady(true); // Set isReady to true when gameService is initialized
    }
  }, [token, baseURL, ApiService]);

  const setURL = useCallback(
    (url) => {
      if (service && url) {
        service.setBaseURL(url);
        setBaseURL(url);
        setUrlInit(true);
      } else {
        setUrlInit(false);
      }
    },
    [setUrlInit, setBaseURL, service]
  );

  const getCategories = async () => service.getCategories();

  const createCategory = async (data) => service.createCategory(data);

  const patchCategory = async (id, data) => service.patchCategory(id, data);
  const createCatalogItemsToSync = async (data) => service.createCatalogItemsToSync(data);

  return (
    <ApiServiceContext.Provider
      value={{
        setURL,
        baseURL,
        service,
        isReady,
        getCategories,
        createCategory,
        patchCategory,
        createCatalogItemsToSync,
      }}
    >
      {children}
    </ApiServiceContext.Provider>
  );
};
