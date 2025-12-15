import React from 'react'; // Quitamos useState porque no se usa aquí

// 1. Corregimos la prop a 'onToggle' (camelCase)
const TareaItem = ({ tarea, onToggle }) => {

    const nombreClase = tarea.completada
        ? 'text-gray-500 line-through'
        : 'text-white';

    const descClase = tarea.completada
        ? 'text-gray-600'
        : 'text-gray-400'
        
    return (
        <div className="flex items-start py-2 px-3 transition-all duration-200 hover:bg-gray-800 rounded-lg group">
            
            <input
                type="checkbox"
                checked={tarea.completada}
                // 2. Usamos la prop corregida
                onChange={() => onToggle(tarea.id)}
                className="mt-1 mr-3 h-4 w-4 bg-gray-700 border-gray-500 rounded appearance-none checked:bg-orange-500 checked:border-transparent cursor-pointer flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                {/* 3. Corregimos: backend envía 'titulo', no 'nombre' */}
                <p className={`text-base font-medium ${nombreClase}`}>
                    {tarea.titulo}
                </p>
                
                {/* 4. Corregimos: backend envía 'descripcion', no 'desc' */}
                <p className={`text-sm ${descClase} truncate`}>
                    {tarea.descripcion}
                </p>
            </div>
        </div>
    );
};

export default TareaItem;