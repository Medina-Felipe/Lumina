// app/src/components/Tareas/Layout/Header.jsx

import React from 'react';

// 💡 Recibe 'titulo'
const Header = ({ titulo }) => { 
  return (
    <header className="h-16 bg-black flex justify-between items-center px-6 border-b border-gray-800">
      
      {/* 💡 LÓGICA CLAVE: Renderiza el título solo si existe. 
             Si no existe (en 'home'), renderiza un espacio vacío. */}
      <div className="text-xl font-bold text-white">
        {titulo || ''} 
      </div>
      
      {/* Contenedor de íconos de utilidad (Derecha) */}
      <div className="flex space-x-4 text-gray-400">
        
        <button className="text-2xl hover:text-white transition-colors">
          <span role="img" aria-label="lista">📝</span>
        </button>
        
        <button className="text-2xl hover:text-white transition-colors">
          <span role="img" aria-label="reloj">⏱️</span>
        </button>
        
        {/* Ícono de Perfil (Avatar) */}
        <button className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm ml-2">
          {/* Usamos el color rosa/rojo de tu captura */}
          J
        </button>
      </div>
    </header>
  );
};

export default Header;