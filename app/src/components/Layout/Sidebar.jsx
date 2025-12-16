import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Sidebar = ({ toggleSidebar }) => { 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [ramosSidebar, setRamosSidebar] = useState([]);

  // Cargar lista de ramos al iniciar
  useEffect(() => {
    const fetchRamosSidebar = async () => {
      try {
        const response = await apiClient.get('/ramos');
        setRamosSidebar(response.data);
      } catch (error) {
        console.error("Error cargando ramos en sidebar:", error);
      }
    };
    fetchRamosSidebar();
  }, []);

  // Helper para saber si la ruta está activa
  const isActive = (path) => location.pathname === path;

  // Componente interno para los ítems del menú
  const NavItem = ({ icon, name, path, hasPlus = false, onClick, isActiveItem }) => {
    // Si se pasa un onClick personalizado, úsalo. Si no, navega al path.
    const handleClick = onClick ? onClick : () => navigate(path);
    
    // Si se pasa prop isActiveItem, úsala. Si no, calcula con la ruta.
    const active = isActiveItem !== undefined ? isActiveItem : isActive(path);

    return (
      <div 
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors mb-1 ${
          active ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'
        }`}
        onClick={handleClick}
      >
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium mr-auto truncate">{name}</span>
        {hasPlus && <span className="text-lg font-bold">+</span>}
      </div>
    );
  };

  return (
    <div className="w-64 bg-black p-4 flex flex-col min-h-screen border-r border-gray-800 overflow-y-auto">
      
      {/* LOGO / INICIO */}
      <div 
        className="flex items-center text-white text-xl font-bold py-4 mb-6 cursor-pointer hover:text-orange-500 transition-colors"
        onClick={() => navigate('/')}
      >
        <span className="text-2xl mr-2">🏠</span> 
        Inicio
      </div>

      {/* SECCIÓN PRINCIPAL */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            General
        </p>
        
        <NavItem 
          icon="🔍" 
          name="Buscar" 
          path="/search" 
        /> 
        
        <NavItem 
            icon="📈" 
            name="Progreso Global" 
            path="/progreso"
        />
        
        <NavItem 
            icon="⏱️" 
            name="Estadísticas de Tiempo" 
            path="/tiempo"
        />
      </div>

      {/* SECCIÓN DE RAMOS (ASIGNATURAS) */}
      <div className="mb-6 flex-grow"> 
        <div className="flex justify-between items-center px-3 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mis Ramos
            </p>
            {/* Botón rápido para ir al dashboard y crear */}
            <button 
                onClick={() => navigate('/ramos')}
                className="text-gray-500 hover:text-orange-500 text-xs uppercase font-bold"
                title="Ver todos / Crear nuevo"
            >
                + Crear
            </button>
        </div>

        {/* LISTA DINÁMICA DE RAMOS */}
        <div className="space-y-1">
          {ramosSidebar.length > 0 ? (
            ramosSidebar.map((ramo) => {
              const ramoPath = `/ramos/${ramo.id}`;
              return (
                <NavItem 
                    key={ramo.id}
                    icon="📚" 
                    name={ramo.titulo}
                    path={ramoPath}
                />
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-gray-600 italic">
                No tienes ramos.
            </div>
          )}
        </div>
      </div>

      {/* FOOTER DEL SIDEBAR */}
      <div className="mt-auto pt-4 border-t border-gray-800 px-3">
        <p className="text-xs text-gray-600 text-center">
            Lumina v1.0
        </p>
      </div>

    </div>
  );
};

export default Sidebar;