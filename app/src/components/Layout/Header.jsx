import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook

// 2. Quitamos 'navigateTo' de las props
const Header = ({ titulo, toggleSidebar }) => { 
  const navigate = useNavigate(); // 3. Inicializamos el hook

  return (
    <header className="h-16 bg-black flex items-center px-6 border-b border-gray-800">
      
      {/* Botón Menú Hamburguesa (Solo Móvil) */}
      <button 
        className="text-2xl text-gray-400 hover:text-white transition-colors mr-3 md:hidden"
        onClick={toggleSidebar} 
        aria-label="Alternar menú lateral"
      >
        ☰
      </button>

      {/* Botón Ir a Inicio (Solo Escritorio) */}
      <button 
        className="mr-6 text-2xl text-gray-400 hover:text-white transition-colors max-md:hidden" 
        onClick={() => navigate('/')} // 4. Usamos la ruta real '/'
        aria-label="Ir a Inicio"
      >
        🏠 {/* Agregué este ícono para que el botón sea visible */}
      </button>

      {/* Título Dinámico */}
      <div className="flex-grow text-3xl font-bold text-white text-left">
        {titulo || 'Inicio'} 
      </div>
      
      {/* Iconos de la derecha */}
      <div className="flex space-x-4 text-gray-400">
        
        {/* Notas Rápidas */}
        <button className="text-2xl hover:text-white transition-colors" aria-label="Notas Rápidas">
          <span role="img" aria-label="lista">📝</span>
        </button>
        
        {/* Cronómetro */}
        <button className="text-2xl hover:text-white transition-colors" aria-label="Cronómetro">
          <span role="img" aria-label="reloj">⏱️</span>
        </button>
        
        {/* Perfil de Usuario */}
        <button className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm ml-2" aria-label="Perfil de Usuario">
          <span role="img" aria-label="perfil">👤</span> 
        </button>
      </div>
    </header>
  );
};

export default Header;