// app/src/components/Tareas/Layout/MainLayout.jsx

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// 💡 Ahora recibe headerTitle
const MainLayout = ({ children, navigateTo, headerTitle }) => { 
  return (
    <div className="flex min-h-screen bg-gray-900">
      
      <Sidebar navigateTo={navigateTo} /> 
      
      <div className="flex-grow flex flex-col">
        {/* 💡 Pasa el título al Header */}
        <Header titulo={headerTitle} /> 
        
        <main className="flex-grow p-0 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;