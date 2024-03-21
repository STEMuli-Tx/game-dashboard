import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';

// Custom component to protect the login route
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    // User is logged in, redirect them to the index page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
