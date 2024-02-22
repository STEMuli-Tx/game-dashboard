import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'src/routes/hooks';

const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');
    // Optionally verify the token's validity with your backend here
    if (token) {
      setLoggedIn(true);
      console.log('User is logged in');
      setUser({ name: Cookies.get('name'), email: Cookies.get('email') });
      router.push('/');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
