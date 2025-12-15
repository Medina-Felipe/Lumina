import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react'; 
import { useAuth } from "../../contexts/AuthContext";
import apiClient from '../../utils/apiClient'; // 1. Usamos nuestro cliente configurado

const CreateRamoForm = ({ onRamoCreated }) => {
  // 2. Solo necesitamos saber si está logueado para validación visual
  const { isLoggedIn } = useAuth();

  // Estado para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Estado para la interfaz
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const defaultPrioridad = 'Normal'; 
  const defaultEstado = 'Activo';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    // Validación local básica
    if (!isLoggedIn) {
       setIsError(true);
       setMessage('ERROR: Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
       return;
    }
    
    if (!titulo || !descripcion) {
      setIsError(true);
      setMessage('El título y la descripción son obligatorios.');
      return;
    }

    setIsLoading(true);

    try {
      // 3. Llamada limpia con apiClient
      // No hace falta poner headers ni token, apiClient lo hace por ti.
      const response = await apiClient.post('/ramos', {
          titulo: titulo,
          descripcion: descripcion,
          prioridad: defaultPrioridad,
          estado: defaultEstado,
      });

      // Si llegamos aquí, es porque Axios recibió un 200/201 (Éxito)
      setIsError(false);
      setMessage(`Ramo creado con éxito: ${response.data.titulo}. ¡Ya puedes agregar hitos!`);
      
      // Limpiar formulario
      setTitulo('');
      setDescripcion('');
      
      // Actualizar la lista padre
      if (onRamoCreated) { 
          onRamoCreated(); 
      }

    } catch (error) {
      // 4. Manejo de errores con Axios
      console.error('Error al crear el ramo:', error);
      setIsError(true);
      
      // Intentamos leer el mensaje de error que manda el backend (si existe)
      const errorMsg = error.response?.data?.error || 'Error de conexión con el servidor.';
      setMessage(`Error: ${errorMsg}`);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-3 text-indigo-600" />
        Crear Nueva Asignatura
      </h2>
      
      {/* Mensaje de estado */}
      {message && (
        <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo Título */}
        <div className="mb-5">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del Ramo
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Ej: Álgebra Lineal, Taller de Tesis"
            required
            disabled={isLoading}
          />
        </div>

        {/* Campo Descripción */}
        <div className="mb-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
            placeholder="Breve descripción del curso..."
            required
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            'Crear Ramo'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRamoForm;