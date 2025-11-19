import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import MainLayout from '../components/Layout/MainLayout.jsx'; 
import CreateRamoForm from '../components/Ramos/CreateRamoForm.jsx'; 
import RamoList from '../components/Ramos/RamoList.jsx'; // Nuevo componente para la lista
import { ListTodo, RefreshCcw } from 'lucide-react'; // Iconos

const API_RAMOS_URL = 'http://127.0.0.1:5000/api/ramos/';

const HomePage = () => {
    const { user, isLoggedIn, logout, authToken } = useAuth(); // Aseguramos que authToken esté disponible
    const [ramos, setRamos] = useState([]);
    const [loadingRamos, setLoadingRamos] = useState(true);
    const [errorRamos, setErrorRamos] = useState(null);

    /**
     * Función para obtener la lista de ramos del usuario desde la API.
     */
    const fetchRamos = async () => {
        if (!isLoggedIn || !authToken) {
            setErrorRamos("No se puede cargar: Usuario no autenticado.");
            setLoadingRamos(false);
            return;
        }

        setLoadingRamos(true);
        setErrorRamos(null);

        try {
            const response = await fetch(API_RAMOS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`, // CRÍTICO: Envío del token
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || `Error ${response.status} al cargar ramos.`);
            }

            const data = await response.json();
            setRamos(data); // Guarda la lista de ramos en el estado

        } catch (error) {
            console.error('Error fetching ramos:', error);
            setErrorRamos(error.message || "Error de conexión o del servidor.");
        } finally {
            setLoadingRamos(false);
        }
    };

    // Ejecutar la carga al montar el componente (y cuando el estado de login cambia)
    useEffect(() => {
        if (isLoggedIn) {
            fetchRamos();
        } else {
             setLoadingRamos(false);
        }
    }, [isLoggedIn]); // Dependencia clave: solo se ejecuta si el usuario está logueado

    if (!isLoggedIn) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-medium text-gray-700">Cargando o no autenticado. Redirigiendo a Login...</p>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="p-6 md:p-10 bg-gray-50 min-h-full">
                {/* Cabecera */}
                <header className="mb-10 flex justify-between items-center border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard Principal
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:inline">
                            Sesión: {user?.email || 'Usuario'}
                        </span>
                        <button 
                            onClick={logout} 
                            className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </header>

                {/* Contenido Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Columna Principal (Lista de Ramos) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                            <ListTodo className="w-6 h-6 mr-3 text-indigo-600" />
                            Tus Asignaturas Activas ({ramos.length})
                        </h2>
                        
                        {/* Botón de Recargar */}
                        <button
                            onClick={fetchRamos}
                            disabled={loadingRamos}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mb-4 transition duration-200 disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-4 h-4 mr-1 ${loadingRamos ? 'animate-spin' : ''}`} />
                            {loadingRamos ? 'Cargando...' : 'Recargar Lista'}
                        </button>

                        {/* Renderizar Lista de Ramos o Mensajes de Estado */}
                        {errorRamos && (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg">{errorRamos}</div>
                        )}
                        
                        {!errorRamos && ramos.length > 0 && <RamoList ramos={ramos} onRamoDeleted={fetchRamos} />}
                        
                        {!errorRamos && !loadingRamos && ramos.length === 0 && (
                            <div className="bg-white p-8 rounded-xl shadow-inner border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500 italic">
                                    No tienes ramos creados. ¡Usa el formulario de la derecha para empezar!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Columna Lateral (Formulario de Creación de Ramo) */}
                    <div className="lg:col-span-1">
                        {/* * Después de crear un ramo, idealmente haríamos un 'fetchRamos()' 
                         * para actualizar la lista. Esto puede pasarse como prop.
                         */}
                        <CreateRamoForm onRamoCreated={fetchRamos} /> 
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
