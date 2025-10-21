// app/src/pages/TareasPage.jsx

import React, { useState, useEffect } from "react";
import HitoTareas from '../components/Tareas/HitoTareas'; 
import { TareaService } from '../utils/apiClient';

const TareasPage = () => {
    const HITO_ID_ACTUAL = 1;
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hitoData = {
        nombre: "Hito 1", 
        desc: "Descripción del Hito", 
        apuntes: "Apuntes rápidos",
    };

    const toggleComplete = async (id) => {
        const tareaToToggle = tareas.find(t => t.id === id);
        if (!tareaToToggle) return;
        
        const nuevoEstado = !tareaToToggle.completada;

        setTareas(prevTareas => 
            prevTareas.map(tarea =>
                tarea.id === id ? { ...tarea, completada: nuevoEstado } : tarea
            )
        );

       try {
         await TareaService.update(id, { completada: nuevoEstado });

         } catch (err) {
            console.error("Fallo al actualizar el estado de la tarea en el servidor:", err);
            
            setError("Error al guardar el estado de la tarea.");
            setTareas(tareas); 
         }
        }; 

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const data = await TareaService.getAll(HITO_ID_ACTUAL); 
                setTareas(data);
            } catch (err) {
                console.error("Error al cargar las tareas desde la API:", err);
                setError("No se pudieron cargar las tareas.");
            } finally {
                setLoading(false);
            }
        };

        fetchTareas();
    }, []); 

    if (loading) {
        return (
            <div className="flex w-full min-h-[calc(100vh-4rem)] justify-center items-center text-white">
                Cargando Tareas... ⏳
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex w-full min-h-[calc(100vh-4rem)] justify-center items-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex w-full min-h-[calc(100vh-4rem)]"> 
            <div className="w-1/2 p-6 border-r border-gray-800"> 
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {hitoData.nombre}
                    </h2>
                    <div className="flex space-x-2 text-gray-400">
                        <span className="cursor-pointer hover:text-white text-xl">⏱️</span>
                        <span className="cursor-pointer hover:text-white text-xl">+</span>
                        <span className="cursor-pointer hover:text-white text-xl">☰</span>
                    </div>
                </div>

                <p className="text-gray-400 text-lg mb-2 italic">
                    {hitoData.desc} 
                </p>
                <p className="text-gray-500 text-md">
                    {hitoData.apuntes}
                </p>
            </div>

            <div className="w-1/2 p-6">
                <HitoTareas tareas={tareas} onToggle={toggleComplete}  />
            </div>
        </div>
    );
};

export default TareasPage;