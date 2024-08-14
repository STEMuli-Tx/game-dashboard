import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import StemuliNavigator from 'src/utils/stemuli-navigator/stemuli-navigator';

export const AuthContext = createContext(null);

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const setPersistentState = (newState) => {
    setState(newState);
  };

  return [state, setPersistentState];
};

export const AuthProvider = ({ children }) => {
  const [persistentState, setPersistentStorage] = usePersistentState('persistentState', {});

  useEffect(() => {
    const token = persistentState.token;
    if (token) {
      StemuliNavigator.setToken(token);
    }
  }, [persistentState]);

  const authenticateUser = (data) => {
    setPersistentStorage({
      name: `${data.first_name} ${data.last_name}`,
      userId: data.user_id,
      email: data.email,
      userType: data.user_category,
      tenantId: data.tenant.tenant_id,
      tenantName: data.tenant.short_name,
      token: data.access_token,
    });
    StemuliNavigator.setToken(data.access_token);
  };

  // Sign in function to update the user state
  const signIn = async (tenant, email, password) => {
    // Assuming signIn method is available and returns user details upon successful authentication
    const userData = await StemuliNavigator.signIn(tenant, email, password);

    if (userData) {
      authenticateUser(userData);
    }
  };

  // Logout function to clear user state
  const logout = () => {
    localStorage.setItem();
    // Additional logout logic (e.g., clearing tokens)
  };

  // Additional logout logic (e.g., clearing tokens)
  return (
    <AuthContext.Provider value={{ persistentState, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
