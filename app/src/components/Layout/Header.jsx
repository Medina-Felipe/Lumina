import React, { useState } from 'react';


const Header = ({ titulo, navigateTo, toggleSidebar }) => { 
  return (
    <header className="h-16 bg-black flex items-center px-6 border-b border-gray-800">
      
      <button 
        className="text-2xl text-gray-400 hover:text-white transition-colors mr-3 md:hidden"
        onClick={toggleSidebar} 
        aria-label="Alternar menú lateral"
      >
        ☰
      </button>

      <button 
        className="mr-6 text-2xl text-gray-400 hover:text-white transition-colors max-md:hidden" 
        onClick={() => navigateTo('home')}
        aria-label="Ir a Inicio"
      >

      </button>

      
      <div className="flex-grow text-3xl font-bold text-white text-left">
        {titulo || 'Inicio'} 
      </div>
      

      
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