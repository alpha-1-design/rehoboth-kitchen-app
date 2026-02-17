import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user and token exist in storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If user and token exist, let them in
  return children;
};

export default ProtectedRoute;
