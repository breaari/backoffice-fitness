import React from 'react';
import { Link } from 'react-router-dom';

export const AccesoDenegado = () => {
    console.log(localStorage.getItem('usuario'))
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-rojo">Acceso Denegado</h1>
      <p className="text-lg mt-4">No tienes permiso para acceder a esta página. Por favor, inicia sesión.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-gris text-white rounded">Volver al Inicio</Link>
    </div>
  );
};

