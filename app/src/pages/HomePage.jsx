import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import apiClient, { ExternalService } from '../utils/apiClient'; 
import CreateRamoForm from '../components/Ramos/CreateRamoForm.jsx'; 
import RamoList from '../components/Ramos/RamoList.jsx'; 
import { ListTodo, RefreshCcw, Quote, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate

const HomePage = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate(); // 2. Inicializamos navegación
    
    // Estado para Ramos
    const [ramos, setRamos] = useState([]);
    const [loadingRamos, setLoadingRamos] = useState(true);
    const [errorRamos, setErrorRamos] = useState(null);

    // Estado para la Frase (Zen Quotes)
    const [quoteData, setQuoteData] = useState(null);

    const fetchRamos = async () => {
        setLoadingRamos(true);
        setErrorRamos(null);
        try {
            const response = await apiClient.get('/ramos');
            setRamos(response.data); 
        } catch (error) {
            console.error('Error fetching ramos:', error);
            setErrorRamos("Error al cargar tus asignaturas.");
        } finally {
            setLoadingRamos(false);
        }
    };

    const fetchQuote = async () => {
        try {
            const data = await ExternalService.getQuote();
            setQuoteData(data);
        } catch (error) {
            console.error("No se pudo cargar la frase", error);
        }
    };

    useEffect(() => {
        fetchRamos();
        fetchQuote(); 
    }, []); 

    // 3. Función para manejar el clic en un ramo (Solución al problema de navegación)
    const handleRamoClick = (ramoId) => {
        navigate(`/ramos/${ramoId}`);
    };

    return (
        // CAMBIO: Fondo oscuro (bg-gray-900) para coherencia
        <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
            
            <header className="mb-8 flex justify-between items-center border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold text-white">
                    Dashboard Principal
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400 hidden sm:inline">
                        Hola, {user?.nombre || 'Estudiante'} 
                    </span>
                    <button 
                        onClick={logout} 
                        className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-2"/> Salir
                    </button>
                </div>
            </header>

            {/* --- BLOQUE DE FRASE INSPIRADORA --- */}
            {quoteData && (
                <div className="mb-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg flex items-start space-x-4 border border-indigo-500/30">
                    <Quote className="w-8 h-8 opacity-70 flex-shrink-0" />
                    <div>
                        <p className="text-lg md:text-xl font-medium italic">
                            "{quoteData.quote}"
                        </p>
                        <div className="mt-2 text-sm font-semibold opacity-90 text-right">
                            — {quoteData.author}
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Lista de Ramos */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center">
                        <ListTodo className="w-6 h-6 mr-3 text-primary-yellow" />
                        Tus Asignaturas Activas ({ramos.length})
                    </h2>
                    
                    <button
                        onClick={fetchRamos}
                        disabled={loadingRamos}
                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center mb-4 transition duration-200 disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-1 ${loadingRamos ? 'animate-spin' : ''}`} />
                        {loadingRamos ? 'Cargando...' : 'Recargar Lista'}
                    </button>

                    {errorRamos && (
                        <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">{errorRamos}</div>
                    )}
                    
                    {!errorRamos && ramos.length > 0 && (
                        /* PASAMOS LA FUNCIÓN DE NAVEGACIÓN A LA LISTA */
                        <RamoList 
                            ramos={ramos} 
                            onRamoDeleted={fetchRamos} 
                            onRamoClick={handleRamoClick} 
                        />
                    )}
                    
                    {!errorRamos && !loadingRamos && ramos.length === 0 && (
                        <div className="bg-gray-800 p-8 rounded-xl shadow-inner border border-dashed border-gray-700 text-center">
                            <p className="text-gray-400 italic">
                                No tienes ramos creados. ¡Usa el formulario de la derecha para empezar!
                            </p>
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Formulario */}
                <div className="lg:col-span-1">
                    {/* Asegúrate de ajustar los estilos dentro de este componente también */}
                    <CreateRamoForm onRamoCreated={fetchRamos} /> 
                </div>

            </div>
        </div>
    );
};

export default HomePage;