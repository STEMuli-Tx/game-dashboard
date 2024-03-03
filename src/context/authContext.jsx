import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'src/routes/hooks';

export const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setLoggedIn(true);
      setUser({ name: Cookies.get('name'), email: Cookies.get('email') });
      // If the user is trying to access login page while logged in, redirect to home
      // if (router.pathname === '/login') {
      //   router.push('/');
      // }
    }

    // else {
    //   setLoggedIn(false);
    //   setUser(null);
    //   // If not logged in and not on the login page, redirect to login
    //   if (router.pathname !== '/login') {
    //     router.push('/login');
    //   }
    // }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
