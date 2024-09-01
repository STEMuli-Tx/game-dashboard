import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import StemuliNavigator from 'src/utils/stemuli-navigator/stemuli-navigator';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [persistentState, setPersistentState] = useState(() => {
    const token = localStorage.getItem('token');
    const providedAt = localStorage.getItem('providedAt');
    const tokenValidity = localStorage.getItem('tokenValidity');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');
    return { token, providedAt, tokenValidity, name, email, userType };
  });

  useEffect(() => {
    const token = persistentState.token;
    if (token) {
      console.log('Pushing to index');
      StemuliNavigator.setToken(token);
      router.push('/');
    }
  }, [persistentState]);

  const authenticateUser = (data) => {
    const userData = {
      name: `${data.first_name} ${data.last_name}`,
      userId: data.user_id,
      email: data.email,
      userType: data.user_category,
      tenantId: data.tenant.tenant_id,
      tenantName: data.tenant.short_name,
      token: data.access_token,
      providedAt: data.provided_at,
      tokenValidity: data.access_token_validity,
    };

    Object.entries(userData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    StemuliNavigator.setToken(data.access_token);
    setPersistentState(userData);
  };

  // Sign in function to update the user state
  const signIn = async (tenant, email, password) => {
    // Assuming signIn method is available and returns user details upon successful authentication
    const userData = await StemuliNavigator.signIn(tenant, email, password);

    if (userData) {
      authenticateUser(userData);
      router.push('/');
    }
  };

  // Logout function to clear user state
  const logout = () => {
    console.log('Logging out');
    localStorage.clear();
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
