import React, { createContext, useContext, useState, useEffect } from 'react';

import StemuliNavigator from 'src/utils/stemuli-navigator';

const stemuliNavigator = new StemuliNavigator();

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Optionally, verify the token's validity with your backend here

    setUserDetails();
    // Set user state based on persisted data. This might include fetching user details
    // again or storing user details in localStorage as well.
    // setUser({
    //   /* user details */
    // });
  }, []);

  const setUserDetails = async () => {
    const response = await stemuliNavigator.getTokenDetails();
    setUser({
      name: `${response.first_name} ${response.last_name}`,
      email: response.email,
      userType: response.user_category,
    });
  };

  // Sign in function to update the user state
  const signIn = async (tenant, email, password) => {
    // Assuming signIn method is available and returns user details upon successful authentication
    const userData = await stemuliNavigator.signIn(tenant, email, password);

    if (userData) {
      setUser({
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        userType: userData.user_category,
      });
      // Set the access_token in a secure, HttpOnly cookie if using cookies for token management

      localStorage.setItem('isLoggedIn', 'true');
      setUserDetails();

      return {
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        userType: userData.user_category,
      };
    }
  };

  // Logout function to clear user state
  const logout = () => {
    setUser(null);
    localStorage.setItem('isLoggedIn', 'false');
    // Additional logout logic (e.g., clearing tokens)
  };

  const getUser = () => {
    return user;
    // Additional logout logic (e.g., clearing tokens)
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
