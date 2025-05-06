import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import StemuliNavigator from 'src/utils/stemuli-navigator/stemuli-navigator';
import { loginWithCustomID } from 'src/utils/playfab-service';
import GameService from '../utils/game-service.mjs';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [persistentState, setPersistentState] = useState(() => {
    const token = localStorage.getItem('token');
    const providedAt = localStorage.getItem('providedAt');
    const tokenValidity = localStorage.getItem('tokenValidity');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const sessionTicket = localStorage.getItem('sessionTicket');
    const playfabId = localStorage.getItem('playfabId');
    return { token, providedAt, tokenValidity, name, email, sessionTicket, playfabId };
  });

  useEffect(() => {
    const token = persistentState.token;
    console.log('TOKEN0:', token);
    if (token) {
      GameService.setToken(token);
      router.push('/');
    }
  }, [persistentState]);

  useEffect(() => {
    GameService.setURL(localStorage.getItem('baseURL'));
  }, [localStorage.getItem('baseURL')]);

  const clearPersistentState = () => {
    setPersistentState({
      token: '',
      providedAt: '',
      tokenValidity: '',
      name: '',
      email: '',
      sessionTicket: '',
      playfabId: '',
    });
  };
  const authenticateUser = async (data) => {
    // const loginResult = await loginWithCustomID(data.user_id);
    const userData = {
      name: `test`,
      userId: 'id',
      email: 'email',
      userType: 'student',
      tenantId: '668e35e9829f6fbeacfe838c',
      tenantName: 'stemuli',
      token: data.accessToken,
      providedAt: '12/10/2023, 12:00:00 AM',
      playfabId:
        'MjoxNzMwMjM1NjE2MDA4OmFkNmZiNGY1LTI1YmItNGI2Zi05NGYzLTE2ODllMGEzMGMxYzo6YzczMzkxMjQtMTI2Yy00NGVmLTk5OGMtMzM4ODNlYTA3NmRm',
    };

    Object.entries(userData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    console.log(persistentState);
    setPersistentState(userData);
  };

  // Sign in function to update the user state
  const signIn = async (tenant, email, password) => {
    // Assuming signIn method is available and returns user details upon successful authentication

    const user = await GameService.signIn(email, password);
    if (user) {
      await authenticateUser(user);
      router.push('/');
    }
  };

  // Logout function to clear user state
  const logout = () => {
    console.log('Logging out');
    localStorage.clear();
    clearPersistentState();
    GameService.setToken('');
    router.push('/login');
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
