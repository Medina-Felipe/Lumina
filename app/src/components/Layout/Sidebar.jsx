import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Sidebar = ({ toggleSidebar }) => { 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [ramosSidebar, setRamosSidebar] = useState([]);

  useEffect(() => {
    const fetchRamosSidebar = async () => {
      try {
        const response = await apiClient.get('/ramos');
        setRamosSidebar(response.data.data || response.data);
      } catch (error) {
        console.error("Error cargando ramos en sidebar:", error);
      }
    };
    fetchRamosSidebar();
  }, []);

  const isActive = (path) => location.pathname === path;


  const NavItem = ({ icon, name, path, onClick, isActiveItem }) => {
    const handleClick = onClick ? onClick : () => navigate(path);
    const active = isActiveItem !== undefined ? isActiveItem : isActive(path);

    return (
      <div 
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors mb-1 ${
          active 
            ? 'bg-orange-500 text-white shadow-md' 
            : 'hover:bg-gray-800 text-gray-400 hover:text-white'
        }`}
        onClick={() => {
            handleClick();
            if(window.innerWidth < 768) toggleSidebar();
        }}
      >
        <span className="mr-3 text-xl">{icon}</span>
        <span className="font-medium text-sm">{name}</span>
      </div>
    );
  };

  return (
    <div className="h-full min-h-screen bg-black border-r border-gray-800 flex flex-col p-4">
      
      {/* --- Menú Principal --- */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Principal
        </p>
        <NavItem icon="🏠" name="Inicio" path="/ramos" />
        <NavItem icon="📈" name="Progreso Global" path="/progreso" />
        <NavItem icon="⏱️" name="Estadísticas de Tiempo" path="/tiempo" />
      </div>

      {/* --- Mis Ramos --- */}
      <div className="mb-6 flex-grow flex flex-col min-h-0"> 
        <div className="flex justify-between items-center px-3 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mis Ramos
            </p>
            <button 
                onClick={() => navigate('/ramos')}
                className="text-gray-500 hover:text-orange-500 text-xs uppercase font-bold transition-colors"
            >
                + Crear
            </button>
        </div>

        <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {ramosSidebar.length > 0 ? (
            ramosSidebar.map((ramo) => (
                <NavItem 
                    key={ramo.id}
                    icon="📚" 
                    name={ramo.titulo}
                    path={`/ramos/${ramo.id}`}
                />
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-600 italic">
                No tienes ramos.
            </div>
          )}
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="mt-auto pt-4 border-t border-gray-800 px-3 pb-6">
        <p className="text-xs text-gray-600 text-center font-mono">
            Lumina v1.2
        </p>
      </div>
    </div>
  );
};

export default Sidebar;