import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import apiClient from '../utils/apiClient'; // 1. Importamos nuestro cliente inteligente
import CreateRamoForm from '../components/Ramos/CreateRamoForm.jsx'; 
import RamoList from '../components/Ramos/RamoList.jsx'; 
import { ListTodo, RefreshCcw } from 'lucide-react'; 

const HomePage = () => {
    const { user, logout } = useAuth(); 
    const [ramos, setRamos] = useState([]);
    const [loadingRamos, setLoadingRamos] = useState(true);
    const [errorRamos, setErrorRamos] = useState(null);

    // Función para obtener ramos usando apiClient (Axios)
    const fetchRamos = async () => {
        setLoadingRamos(true);
        setErrorRamos(null);

        try {
            // 2. Usamos apiClient: No hace falta poner URL completa ni token manual
            const response = await apiClient.get('/ramos');
            setRamos(response.data); // Axios devuelve los datos en .data

        } catch (error) {
            console.error('Error fetching ramos:', error);
            setErrorRamos("Error al cargar tus asignaturas.");
        } finally {
            setLoadingRamos(false);
        }
    };

    // Cargar al iniciar
    useEffect(() => {
        fetchRamos();
    }, []); // El AuthContext ya maneja la protección, así que esto es seguro

    // 3. YA NO DEVOLVEMOS <MainLayout>. Solo el contenido interno.
    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-full">
            
            {/* Cabecera del Dashboard */}
            <header className="mb-10 flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Principal
                </h1>
                <div className="flex items-center space-x-4">
                    {/* Opcional: Mostrar email si el backend lo devuelve */}
                    <span className="text-sm text-gray-600 hidden sm:inline">
                        Usuario Conectado
                    </span>
                    {/* El botón de logout es opcional aquí, ya que suele ir en el Sidebar/Header global */}
                    <button 
                        onClick={logout} 
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Lista de Ramos */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                        <ListTodo className="w-6 h-6 mr-3 text-indigo-600" />
                        Tus Asignaturas Activas ({ramos.length})
                    </h2>
                    
                    {/* Botón Recargar */}
                    <button
                        onClick={fetchRamos}
                        disabled={loadingRamos}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mb-4 transition duration-200 disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-1 ${loadingRamos ? 'animate-spin' : ''}`} />
                        {loadingRamos ? 'Cargando...' : 'Recargar Lista'}
                    </button>

                    {/* Estados: Error, Lista, Vacío */}
                    {errorRamos && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{errorRamos}</div>
                    )}
                    
                    {!errorRamos && ramos.length > 0 && (
                        <RamoList ramos={ramos} onRamoDeleted={fetchRamos} />
                    )}
                    
                    {!errorRamos && !loadingRamos && ramos.length === 0 && (
                        <div className="bg-white p-8 rounded-xl shadow-inner border border-dashed border-gray-300 text-center">
                            <p className="text-gray-500 italic">
                                No tienes ramos creados. ¡Usa el formulario de la derecha para empezar!
                            </p>
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Formulario */}
                <div className="lg:col-span-1">
                    <CreateRamoForm onRamoCreated={fetchRamos} /> 
                </div>

            </div>
        </div>
    );
};

export default HomePage;