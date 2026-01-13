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
        <div className="h-full"> 
            
            {/* Header de la sección Tareas */}
            <div className="flex justify-between items-center mb-6 px-6 pt-0"> 
                <h2 className="text-2xl font-bold text-white">Tareas</h2>
                
                <div className="flex space-x-3 text-gray-400 items-center">
                    <button className="text-2xl hover:text-orange-500 transition-colors transform -translate-y-[1px]" title="Añadir Tarea">
                        +
                    </button>
                    <button className="hover:text-orange-500 transition-colors text-xl" title="Filtrar/Ordenar">
                        ☰
                    </button>
                </div>
            </div>

            {/* Lista de Tareas */}
            <div className="space-y-1 px-3"> 
                {tareas.map(tarea => (
                    <TareaItem 
                        key={tarea.id} 
                        tarea={tarea} 
                        ontoggle={toggleComplete} 
                    />
                ))}
            </div>
        </div>
    );
};

export default HitoTareas;