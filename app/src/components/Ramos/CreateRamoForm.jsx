import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react'; 
// RUTA CRÍTICA: Se corrige la ruta de importación del hook de autenticación
import { useAuth } from '../../../contexts/AuthContext.jsx'; 

const API_URL = 'http://127.0.0.1:5000/api/ramos/'; 

/**
 * Componente del formulario para crear un nuevo Ramo.
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onRamoCreated - Función para llamar después de crear exitosamente un ramo.
 */
const CreateRamoForm = ({ onRamoCreated }) => {
  // Obtener el token de autenticación usando el contexto
  const { authToken, isLoggedIn } = useAuth();

  // Estado para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Estado para la interfaz (cargando, errores, éxito)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Valores por defecto
  const defaultPrioridad = 'Normal'; 
  const defaultEstado = 'Activo';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    if (!isLoggedIn || !authToken) {
       setIsError(true);
       setMessage('ERROR: No estás autenticado. Debes iniciar sesión para crear ramos.');
       return;
    }
    
    if (!titulo || !descripcion) {
      setIsError(true);
      setMessage('El título y la descripción son obligatorios.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CRÍTICO: Usar el token del contexto
          'Authorization': `Bearer ${authToken}`, 
        },
        body: JSON.stringify({
          titulo: titulo,
          descripcion: descripcion,
          prioridad: defaultPrioridad, 
          estado: defaultEstado,
        }),
      });

      const data = await response.json();

      if (response.ok && response.status === 201) {
        setIsError(false);
        setMessage(`Ramo creado con éxito: ${data.titulo}. ¡Ya puedes agregar hitos!`);
        // Limpiar formulario
        setTitulo('');
        setDescripcion('');
        
        // Llamar a la función de la prop para actualizar la lista en HomePage
        if (onRamoCreated) { 
            onRamoCreated(); 
        }

      } else {
        setIsError(true);
        const errorMsg = data.mensaje || data.msg || 'Error desconocido del servidor.';
        setMessage(`Error ${response.status}: ${errorMsg}`);
      }

    } catch (error) {
      setIsError(true);
      setMessage(`Error de conexión: Asegúrate que el backend de Flask esté corriendo en 5000.`);
      console.error('Error al crear el ramo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-3 text-indigo-600" />
        Crear Nueva Asignatura (Ramo)
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
            placeholder="Breve descripción del curso, código o nombre del profesor."
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
              Creando Ramo...
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
