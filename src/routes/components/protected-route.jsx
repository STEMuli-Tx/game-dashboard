import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'src/context/authContext';

const ProtectedRoute = ({ children }) => {
  const { persistentState } = useContext(AuthContext);
  if (!persistentState.token) {
    console.log('here');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
