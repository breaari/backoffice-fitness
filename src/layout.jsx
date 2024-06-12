import React from 'react';
import { NavBar } from './Components/NavBar/NavBar';
import { Accesos } from './Components/Accesos/Accesos';
import { Outlet } from 'react-router-dom';
export const Layout = ({ children }) => {
  return (
    <div className='flex flex-col'>
      <NavBar />
      <div className='flex flex-row'>
      <Accesos />
      
      <Outlet /> 
      </div>
    </div>
  );
}
