import React, { useState } from 'react';

const Sidebar = ({ navigateTo, currentPage, toggleSidebar }) => { 
  const NavItem = ({ icon, name, hasPlus = false, isActive = false, onClick, children }) => (
    <>
      <div 
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${
          isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
        onClick={onClick}
      >
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium mr-auto">{name}</span>
        {hasPlus && <span className="text-lg">+</span>}
      </div>
      {children}
    </>
  );

  const isActive = (pageName) => currentPage === pageName;

  return (
    <div className="w-64 bg-black p-4 flex flex-col min-h-screen border-r border-gray-800">
      
      {/* INICIO */}
      <div 
        className="flex items-center text-white text-xl font-bold py-2 mb-6 cursor-pointer"
        onClick={() => navigateTo('home')}
      >
        <span className="text-2xl mr-2">🏠</span> 
        Inicio
      </div>

      {/* Buscar */}
      <div className="mb-4"> 
        <NavItem 
          icon="🔍" 
          name="Buscar" 
          onClick={() => navigateTo('search')} 
          isActive={isActive('search')} 
        /> 

        {/* Ramos  */}
        <NavItem 
          icon="📚" 
          name="Ramos" 
          hasPlus={true}
          onClick={() => navigateTo('ramos')}
          isActive={isActive('ramos')}
        />
        
        {/* Sub-Ramos de ejemplo*/}
        <div className="ml-5 mt-1 space-y-1 text-gray-400 text-sm">
          <p 
            className={`cursor-pointer transition-colors py-1 ${
              isActive('proyecto_aplicacion') ? 'text-orange-500 font-bold' : 'hover:text-white'
            }`} 
            onClick={() => navigateTo('proyecto_aplicacion')}
          >
            Proyecto Aplicación...
          </p>
        </div>
      </div>

      {/* Navegación principal (Hitos, Tareas, Progreso) */}
      <div className="space-y-1 flex-grow">
        
        <NavItem 
            icon="📄" 
            name="Hitos" 
            hasPlus={true} 
            onClick={() => navigateTo('hitos_general')} 
            isActive={isActive('hitos_general')}
        />
        <NavItem 
            icon="📋" 
            name="Tareas" 
            hasPlus={true} 
            onClick={() => navigateTo('tareas_general')} 
            isActive={isActive('tareas_general')}
        />

      </div>

      {/* Progreso (al final) */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <NavItem 
          icon="📈" 
          name="Progreso" 
          onClick={() => navigateTo('progreso')} 
          isActive={isActive('progreso')}
        />
      </div>

    </div>
  );
};

export default Sidebar;