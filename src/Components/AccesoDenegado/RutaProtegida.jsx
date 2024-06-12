import React from 'react';
import { Navigate } from 'react-router-dom';

export const RutaProtegida = ({ isLogged, children }) => {
  console.log("isLogged:", isLogged)
  if (!isLogged) {
    return <Navigate to="/acceso-denegado" replace />;
  }
  return children;
};

