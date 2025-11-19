import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.jsx'; // Necesario para el token

const API_URL = 'http://127.0.0.1:5000/api/ramos/';

/**
 * Muestra una lista de tarjetas de Ramos y permite eliminarlos.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.ramos - Lista de objetos Ramo.
 * @param {function} props.onRamoDeleted - Función para llamar después de eliminar exitosamente un ramo.
 */
const RamoList = ({ ramos, onRamoDeleted }) => {
    const { authToken } = useAuth();
    const [deletingId, setDeletingId] = useState(null); // Estado para manejar el loading en el botón

    /**
     * Maneja la eliminación de un ramo.
     * @param {string} ramoId - El ID del ramo a eliminar.
     */
    const handleDelete = async (ramoId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta asignatura y todos sus hitos asociados?")) {
            return;
        }

        setDeletingId(ramoId);

        try {
            const response = await fetch(`${API_URL}${ramoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.status === 204) {
                // Éxito: El servidor responde sin contenido para DELETE exitoso
                alert("Asignatura eliminada con éxito.");
                // Llama a la función de callback para actualizar la lista en HomePage
                if (onRamoDeleted) { 
                    onRamoDeleted(); 
                }
            } else if (response.ok) {
                // Caso donde el servidor devuelve 200/202 con mensaje
                alert("Asignatura eliminada con éxito.");
                if (onRamoDeleted) { 
                    onRamoDeleted(); 
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || `Error ${response.status} al eliminar.`);
            }

        } catch (error) {
            console.error('Error al eliminar el ramo:', error);
            alert(`Error al eliminar: ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    if (!ramos || ramos.length === 0) {
        return (
            <div className="text-center p-6 text-gray-500">
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
                                {ramo.estado}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            {ramo.descripcion}
                        </p>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                        <div className="text-xs text-gray-500">
                            <p>ID: {ramo.id}</p>
                            <p>Prioridad: {ramo.prioridad}</p>
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
