import React, { useState } from 'react';
import { BookOpen, Trash2, Loader2 } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // 1. Usamos nuestro cliente configurado

/**
 * Muestra una lista de tarjetas de Ramos y permite eliminarlos.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.ramos - Lista de objetos Ramo.
 * @param {function} props.onRamoDeleted - Función para llamar después de eliminar exitosamente un ramo.
 */
const RamoList = ({ ramos, onRamoDeleted }) => {
    // 2. Ya no necesitamos useAuth aquí, apiClient maneja el token internamente.
    const [deletingId, setDeletingId] = useState(null); 

    /**
     * Maneja la eliminación de un ramo usando apiClient.
     */
    const handleDelete = async (ramoId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta asignatura y todos sus hitos asociados?")) {
            return;
        }

        setDeletingId(ramoId);

        try {
            // 3. Llamada limpia con Axios (DELETE /ramos/:id)
            await apiClient.delete(`/ramos/${ramoId}`);

            // Si Axios no lanza error, significa que fue exitoso (200 o 204)
            alert("Asignatura eliminada con éxito.");
            
            // Actualizamos la lista en el componente padre
            if (onRamoDeleted) { 
                onRamoDeleted(); 
            }

        } catch (error) {
            console.error('Error al eliminar el ramo:', error);
            // Intentamos mostrar el mensaje que viene del backend
            const msg = error.response?.data?.error || error.message || "Error al eliminar.";
            alert(`Error al eliminar: ${msg}`);
        } finally {
            setDeletingId(null);
        }
    };

    if (!ramos || ramos.length === 0) {
        return (
            <div className="text-center p-6 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
                Aún no tienes asignaturas creadas.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ramos.map((ramo) => (
                <div 
                    key={ramo.id} 
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600 hover:shadow-xl transition duration-300 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                                {ramo.titulo}
                            </h3>
                            <span 
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${ramo.prioridad === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                            >
                                {ramo.estado || 'Activo'}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {ramo.descripcion}
                        </p>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                        <div className="text-xs text-gray-500">
                            <p>Prioridad: {ramo.prioridad}</p>
                            {/* Puedes agregar más info aquí si quieres, como fecha */}
                        </div>
                        
                        <button
                            onClick={() => handleDelete(ramo.id)}
                            disabled={deletingId === ramo.id || deletingId !== null}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 transition duration-150 p-2 rounded-full hover:bg-red-50"
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
            ))}
        </div>
    );
};

export default RamoList;