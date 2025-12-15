import React, { useState } from 'react';
import { Trash2, Loader2, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '../../utils/apiClient';

// Recibimos onRamoClick desde HomePage
const RamoList = ({ ramos, onRamoDeleted, onRamoClick }) => {
    const [deletingId, setDeletingId] = useState(null); 

    const handleDelete = async (e, ramoId) => {
        // Detenemos la propagación para que al borrar no se abra el ramo
        e.stopPropagation();

        if (!window.confirm("¿Estás seguro de eliminar este ramo y sus tareas?")) {
            return;
        }

        setDeletingId(ramoId);

        try {
            await apiClient.delete(`/ramos/${ramoId}`);
            if (onRamoDeleted) onRamoDeleted(); 
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert("No se pudo eliminar el ramo.");
        } finally {
            setDeletingId(null);
        }
    };

    // Función auxiliar para calcular el estado real
    const getEstadoRamo = (ramo) => {
        const hitos = ramo.hitos || [];
        if (hitos.length === 0) return { label: 'Sin Hitos', color: 'text-gray-400 bg-gray-700', icon: Clock };

        // Calculamos el promedio de progreso de los hitos
        const sumaProgreso = hitos.reduce((acc, h) => acc + (h.progreso || 0), 0);
        const promedio = sumaProgreso / hitos.length;

        // Si el promedio es 100 (o muy cerca), está completado
        if (promedio >= 99.9) {
            return { label: '¡Completado!', color: 'text-green-300 bg-green-900/50 border border-green-700', icon: CheckCircle2 };
        }

        return { 
            label: `En Progreso (${promedio.toFixed(0)}%)`, 
            color: 'text-yellow-300 bg-yellow-900/50 border border-yellow-700', 
            icon: Clock 
        };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ramos.map((ramo) => {
                const estado = getEstadoRamo(ramo);
                const Icon = estado.icon;

                return (
                    <div 
                        key={ramo.id}
                        // CAMBIO: onClick para navegar
                        onClick={() => onRamoClick && onRamoClick(ramo.id)}
                        className="bg-gray-800 p-5 rounded-xl shadow border border-gray-700 hover:border-indigo-500 cursor-pointer transition-all duration-200 hover:shadow-lg group relative"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {ramo.titulo}
                            </h3>
                            
                            {/* Etiqueta de Estado Dinámica */}
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${estado.color}`}>
                                <Icon className="w-3 h-3 mr-1" />
                                {estado.label}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px]">
                            {ramo.descripcion}
                        </p>

                        <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                            <span className="text-xs text-gray-500 font-medium">
                                {ramo.hitos ? ramo.hitos.length : 0} Hitos registrados
                            </span>
                            
                            <button
                                onClick={(e) => handleDelete(e, ramo.id)}
                                disabled={deletingId === ramo.id}
                                className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-700"
                                title="Eliminar Ramo"
                            >
                                {deletingId === ramo.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RamoList;