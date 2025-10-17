import React, { useState } from 'react';
import TareaItem from './TareaItem';
import { tareasHitoSeleccionado as mockTareas } from '../../utils/mockData'; 

const HitoTareas = () => {
  const [tareas, setTareas] = useState(mockTareas);

  const toggleComplete = (id) => {
    setTareas(prevTareas => 
      prevTareas.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };
  
  return (
    <div className="p-6"> 
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Tareas</h2>
        
        <div className="flex space-x-3 text-gray-400">
          <button className="hover:text-orange-500 transition-colors">
            ☰
          </button>
          <button className="hover:text-orange-500 transition-colors">
            {/*falta agregar logo*/}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {tareas.map(tarea => (
          <TareaItem 
            key={tarea.id} 
            tarea={tarea} 
            onToggle={toggleComplete} 
          />
        ))}
      </div>
    </div>
  );
};

export default HitoTareas;