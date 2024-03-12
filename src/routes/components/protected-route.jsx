import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const ProtectedRoute = ({ children, isLoggedIn }) => {
  console.log('ProtectedRoute isLoggedIn: ', isLoggedIn);
  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
