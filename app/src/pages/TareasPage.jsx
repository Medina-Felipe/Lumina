import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from 'react-router-dom'; // Nuevos hooks
import apiClient from '../utils/apiClient'; 
import HitoTareas from '../components/Tareas/HitoTareas'; 

const MAX_DESC_LENGTH = 250;

const TareasPage = () => {
    const { hitoId } = useParams(); // 1. Obtenemos el ID del hito de la URL
    const navigate = useNavigate();
    
    const [hito, setHito] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Cargar Datos ---
    useEffect(() => {
        const fetchDatos = async () => {
            if (!hitoId) return; // Si no hay ID, no hacemos nada (o mostramos error)

            try {
                setLoading(true);
                
                // 2. Necesitamos buscar el hito específico.
                // Como no tenemos un endpoint GET /hitos/:id, buscamos en todos los ramos
                // (Esto es ineficiente pero funciona con tu backend actual. Idealmente crearías el endpoint).
                const response = await apiClient.get('/ramos');
                const ramos = response.data;

                let hitoEncontrado = null;
                
                // Búsqueda manual del hito
                for (const ramo of ramos) {
                    if (ramo.hitos) {
                        const match = ramo.hitos.find(h => h.id === parseInt(hitoId));
                        if (match) {
                            hitoEncontrado = match;
                            break;
                        }
                    }
                }

                if (hitoEncontrado) {
                    setHito({
                        id: hitoEncontrado.id,
                        nombre: hitoEncontrado.titulo,
                        desc: hitoEncontrado.descripcion || "",
                        apuntes: "Notas locales..." 
                    });
                    setTareas(hitoEncontrado.tareas);
                } else {
                    setError("Hito no encontrado.");
                }

            } catch (err) {
                console.error("Error cargando hito:", err);
                setError("Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };

        fetchDatos();
    }, [hitoId]); // Se ejecuta cuando cambia el ID en la URL

    // ... (El resto de las funciones handleChange, handleCreateTarea, handleToggleTarea quedan IGUAL) ...
    // Solo asegúrate de que usen 'hito.id' o 'hitoId' correctamente.
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'desc' && value.length <= MAX_DESC_LENGTH) {
            setHito(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateTarea = async () => {
        const titulo = window.prompt("Nombre de la nueva tarea:");
        if (!titulo) return; 

        try {
            const response = await apiClient.post(`/hitos/${hitoId}/tareas`, {
                titulo: titulo,
                descripcion: "" 
            });
            setTareas(prev => [...prev, response.data]);
        } catch (err) {
            console.error("Error creando tarea:", err);
            alert("Error al crear la tarea.");
        }
    };

    const handleToggleTarea = async (tareaId) => {
        const tareaActual = tareas.find(t => t.id === tareaId);
        if (!tareaActual) return;
        const nuevoEstado = !tareaActual.completada;

        setTareas(prev => prev.map(t => 
            t.id === tareaId ? { ...t, completada: nuevoEstado } : t
        ));

        try {
            await apiClient.put(`/tareas/${tareaId}`, {
                completada: nuevoEstado
            });
        } catch (err) {
            console.error("Error actualizando:", err);
            setTareas(prev => prev.map(t => 
                t.id === tareaId ? { ...t, completada: tareaActual.completada } : t
            ));
        }
    };

    // --- Renderizado ---
    if (loading) return <div className="p-10 text-white">Cargando tareas...</div>;
    
    if (error) return (
        <div className="p-10 text-center">
            <h2 className="text-white text-xl mb-4">{error}</h2>
            <button onClick={() => navigate(-1)} className="text-indigo-400 underline">Volver atrás</button>
        </div>
    );

    if (!hito) return <div className="p-10 text-white">Selecciona un hito desde la vista de Ramos.</div>;

    return (
        <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)]"> 
            {/* Panel Izquierdo */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-800 md:border-b-0 border-b flex flex-col"> 
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{hito.nombre}</h2>
                    {/* Botón Volver */}
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm">
                        ← Volver al Ramo
                    </button>
                </div>

                <div className="mt-4 flex-grow overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-400 mb-1">Descripción del Hito:</h3>
                    <textarea 
                        name="desc"
                        value={hito.desc}
                        onChange={handleChange}
                        maxLength={MAX_DESC_LENGTH}
                        className="w-full bg-gray-800 text-gray-400 text-md p-2 rounded resize-none border border-gray-700 focus:border-orange-500 focus:outline-none transition-colors h-24 mb-2"
                    />
                    <p className="text-right text-xs text-gray-500 mb-4">{hito.desc.length}/{MAX_DESC_LENGTH}</p>
                </div>
            </div>

            {/* Panel Derecho */}
            <div className="w-full md:w-1/2 bg-gray-900">
                <HitoTareas 
                    tareas={tareas} 
                    onToggleTarea={handleToggleTarea} 
                    onCreateTarea={handleCreateTarea}
                />
            </div>
        </div>
    );
};

export default TareasPage;