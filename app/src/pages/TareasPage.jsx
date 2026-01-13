import React, { useState } from "react"; 
import HitoTareas from '../components/Tareas/HitoTareas'; 

const MAX_APUNTES_LENGTH = 300; // Límite de caracteres para Apuntes
const MAX_DESC_LENGTH = 150;    // Límite de caracteres para Descripción

const TareasPage = () => {

    const [hito, setHito] = useState({
        nombre: "Hito 1", 
        desc: "Descripción del Hito", 
        apuntes: "Apuntes rápidos.\n\nAquí puedes escribir notas importantes, enlaces, o cualquier información relevante al hito. Este campo se debería poder editar para añadir más contexto a la planificación de este hito específico.",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const maxLength = name === 'apuntes' ? MAX_APUNTES_LENGTH : MAX_DESC_LENGTH;

        if (value.length <= maxLength) {
            setHito(prevHito => ({
                ...prevHito,
                [name]: value,
            }));
        }
    };


    return (
        <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)]"> 
            
            <div className="w-full md:w-1/2 p-6 border-r border-gray-800 md:border-b-0 border-b flex flex-col"> 
                {/* Hito */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {hito.nombre}
                    </h2>
                    
                    <div className="flex space-x-3 text-gray-400 items-center">
                        <span className="text-xl cursor-pointer hover:text-orange-500" title="Ver Progreso">📈</span> 
                        <span className="text-xl cursor-pointer hover:text-orange-500" title="Editar Hito">📝</span> 
                        <span className="text-xl cursor-pointer hover:text-orange-500" title="Opciones">☰</span> 
                    </div>
                </div>

                <div className="mt-4 flex-grow overflow-y-auto">
                    
                    <h3 className="text-lg font-semibold text-gray-400 mb-1">
                        Descripción del Hito:
                    </h3>
                    <textarea 
                        name="desc"
                        value={hito.desc}
                        onChange={handleChange}
                        maxLength={MAX_DESC_LENGTH}
                        className="w-full bg-gray-800 text-gray-400 text-md p-2 rounded resize-none border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors h-16 mb-2"
                        placeholder="Escribe la descripción del Hito aquí..."
                    />
                    <p className="text-right text-xs text-gray-500 mb-4">
                        {hito.desc.length}/{MAX_DESC_LENGTH}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-400 mb-1">
                        Apuntes Rápidos:
                    </h3>
                    <textarea 
                        name="apuntes"
                        value={hito.apuntes}
                        onChange={handleChange}
                        maxLength={MAX_APUNTES_LENGTH}
                        className="w-full bg-gray-800 text-gray-300 text-md p-2 rounded resize-y border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors min-h-32 flex-grow"
                        placeholder="Añade tus apuntes aquí..."
                    />
                    <p className="text-right text-xs text-gray-500 mt-1">
                        {hito.apuntes.length}/{MAX_APUNTES_LENGTH}
                    </p>

                </div>
            </div>

            {/* Tareas */}
            <div className="w-full md:w-1/2">
                <HitoTareas />
            </div>
        </div>
    );
};

export default TareasPage;