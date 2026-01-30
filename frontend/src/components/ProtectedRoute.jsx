import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user exists in storage
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user, kick them to Login page immediately
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, let them in
  return children;
};

export default ProtectedRoute;
