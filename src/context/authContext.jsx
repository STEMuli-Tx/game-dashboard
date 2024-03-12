import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'src/routes/hooks';

export const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');

    // Attempt to retrieve the token and user information from cookies

    if (token) {
      localStorage.setItem('isLoggedIn', true);
      const userInfo = { name: Cookies.get('name'), email: Cookies.get('email') };
      localStorage.setItem('user', JSON.stringify(userInfo));
      setLoggedIn(true);
      setUser(userInfo);
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever isLoggedIn or user changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('user', JSON.stringify(user));
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
