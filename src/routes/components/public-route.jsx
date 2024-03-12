import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';

// Custom component to protect the login route
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  console.log('PublicRoute isLoggedIn: ', isLoggedIn);
  if (isLoggedIn) {
    // User is logged in, redirect them to the index page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
