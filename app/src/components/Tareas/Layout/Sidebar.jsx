// app/src/components/Tareas/Layout/Sidebar.jsx

import React from 'react';

// 💡 El componente ahora recibe 'navigateTo' desde MainLayout/App
const Sidebar = ({ navigateTo }) => { 
  
  // Componente reutilizable para los ítems de navegación
  // 💡 Ahora recibe una prop 'onClick' para la navegación
  const NavItem = ({ icon, name, hasPlus = false, isActive = false, onClick, children }) => (
    <>
      <div 
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${
          isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'
        }`}
        onClick={onClick} // 💡 Agregamos el manejador de clic
      >
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium mr-auto">{name}</span>
        {hasPlus && <span className="text-lg">+</span>}
      </div>
      {children}
    </>
  );

  return (
    <div className="w-64 bg-black p-4 flex flex-col min-h-screen border-r border-gray-800">
      
      {/* 1. Título "Inicio" (Encabezado del Sidebar) */}
      <div 
        className="flex items-center text-white text-xl font-bold py-2 mb-6 cursor-pointer"
        onClick={() => navigateTo('home')} // 💡 Llama a la función para ir a la página vacía
      >
        <span className="text-2xl mr-2">🏠</span>
        Inicio
      </div>

      {/* 2. Sección Buscar/Ramos */}
      <div className="mb-6">
        
        {/* Item Buscar */}
        <NavItem icon="🔍" name="Buscar" onClick={() => navigateTo('search')} /> 

        {/* Item Ramos */}
        <NavItem 
          icon="📚" 
          name="Ramos" 
          hasPlus={true}
          onClick={() => navigateTo('ramos')}
        />
  
        {/* Sub-items de Ramos (archivos del ramo) */}
        <div className="ml-5 mt-2 space-y-1 text-gray-400 text-sm">
          <p className="hover:text-white cursor-pointer transition-colors py-1" onClick={() => navigateTo('proyecto_aplicacion')}>Proyecto de Aplicacion</p>
        </div>
      </div>

      {/* 3. Menú Principal */}
      <div className="space-y-0 flex-grow">
        
        {/* Hitos */}
        <NavItem icon="📄" name="Hitos" hasPlus={true} onClick={() => navigateTo('hitos_general')} />


        
        {/* Tareas */}
        <NavItem icon="📋" name="Tareas" hasPlus={true} onClick={() => navigateTo('tareas_general')} />

      </div>


      {/* 4. Progreso (Pie de página) */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <NavItem icon="📈" name="Progreso" hasPlus={false} onClick={() => navigateTo('progreso')} />
      </div>

    </div>
  );
};

export default Sidebar;