import React from 'react';
import TareaItem from './TareaItem';
import { PlusCircle, Menu } from 'lucide-react'; // Usamos iconos bonitos

// Recibimos 'onCreateTarea' para activar la creación desde el botón +
const HitoTareas = ({ tareas, onToggleTarea, onCreateTarea }) => {
  
  // Aseguramos que sea un array
  const listaTareas = tareas || [];

  return (
    <div className="p-6"> 
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
            Tareas ({listaTareas.length})
        </h2>
        
        <div className="flex space-x-3 text-gray-400 items-center">
          {/* Botón Agregar Tarea */}
          <button 
            onClick={onCreateTarea} // 1. Conectamos el evento
            className="hover:text-orange-500 transition-colors transform hover:scale-110"
            title="Agregar nueva tarea"
          >
            <PlusCircle className="w-6 h-6" />
          </button>

          {/* Botón Menú (Opcional) */}
          <button className="hover:text-orange-500 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {listaTareas.length > 0 ? (
          listaTareas.map(tarea => (
            <TareaItem 
              key={tarea.id} 
              tarea={tarea} 
              onToggle={onToggleTarea} 
            />
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-500 italic mb-2">No hay tareas en este hito.</p>
            <button 
                onClick={onCreateTarea}
                className="text-sm text-orange-500 hover:underline"
            >
                ¡Crea la primera!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HitoTareas;