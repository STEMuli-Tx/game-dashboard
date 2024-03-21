import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
