import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react'; 
import { useAuth } from "../../contexts/AuthContext"; import apiClient from '../../utils/apiClient';

const CreateRamoForm = ({ onRamoCreated }) => {
  const { isLoggedIn } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    if (!isLoggedIn) {
       setIsError(true);
       setMessage('ERROR: Sesión expirada.');
       return;
    }
    
    if (!titulo || !descripcion) {
      setIsError(true);
      setMessage('Completa todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/ramos', {
          titulo: titulo,
          descripcion: descripcion,
          prioridad: 'Normal', 
          estado: 'Activo'
      });

      setMessage('¡Ramo creado exitosamente!');
      setTitulo('');
      setDescripcion('');
      
      if (onRamoCreated) {
        onRamoCreated();
      }
      
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Error creando ramo:', error);
      setIsError(true);
      setMessage('No se pudo crear el ramo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 sticky top-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-2 text-primary-yellow" />
        Nuevo Ramo
      </h3>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          isError ? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-green-900/50 text-green-200 border border-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-400 mb-1">
            Nombre de la Asignatura
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
            placeholder="Ej: Cálculo I"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-400 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            maxLength={200}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none placeholder-gray-600"
            placeholder="Breve descripción..."
            required
            disabled={isLoading}
          ></textarea>
          <p className="text-right text-xs text-gray-500 mt-1">
            {descripcion.length}/200 caracteres
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 flex items-center justify-center bg-primary-yellow text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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