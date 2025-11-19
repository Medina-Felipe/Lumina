import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { Flag, PlusCircle, Loader2, ArrowRight } from 'lucide-react';
import apiClient from '../utils/apiClient';

const RamoPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); // Para navegar a las tareas
  const [ramo, setRamo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario de Hito
  const [tituloHito, setTituloHito] = useState('');
  const [descHito, setDescHito] = useState('');
  const [creating, setCreating] = useState(false);

  // Cargar datos
  const fetchRamoData = async () => {
    try {
      const response = await apiClient.get(`/ramos/${id}`);
      setRamo(response.data);
    } catch (error) {
      console.error("Error cargando ramo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRamoData();
  }, [id]);

  // Crear Hito
  const handleCreateHito = async (e) => {
    e.preventDefault();
    if (!tituloHito) return;
    setCreating(true);

    try {
      await apiClient.post(`/ramos/${id}/hitos`, {
        titulo: tituloHito,
        descripcion: descHito,
        importancia: 3 // Valor por defecto
      });
      
      setTituloHito('');
      setDescHito('');
      fetchRamoData(); // Recargar para ver el nuevo hito
      alert("¡Hito creado con éxito!");

    } catch (error) {
      console.error("Error creando hito:", error);
      alert("Error al crear hito");
    } finally {
        setCreating(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Cargando...</div>;
  if (!ramo) return <div className="p-10 text-red-500">Ramo no encontrado.</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full">
      
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">📚</span> {ramo.titulo}
        </h1>
        <p className="text-gray-600 mt-2">{ramo.descripcion}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: LISTA DE HITOS */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Flag className="w-5 h-5 mr-2 text-orange-500" />
            Hitos ({ramo.hitos ? ramo.hitos.length : 0})
          </h2>

          <div className="space-y-4">
            {ramo.hitos && ramo.hitos.length > 0 ? (
              ramo.hitos.map((hito) => (
                <div key={hito.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-400 transition hover:shadow-md">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg text-gray-800">{hito.titulo}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded self-start">
                        {hito.progreso ? hito.progreso.toFixed(0) : 0}% completado
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{hito.descripcion}</p>
                  
                  {/* Botón para ir a ver las tareas (Lo conectaremos después) */}
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                      <button 
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        onClick={() => navigate(`/hitos/${hito.id}/tareas`)}
                      >
                          Ver Tareas <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg border-dashed border-2 border-gray-300 text-center text-gray-500">
                No hay hitos. ¡Crea uno nuevo a la derecha! 👉
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Nuevo Hito
            </h3>
            
            <form onSubmit={handleCreateHito}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input 
                        type="text" 
                        className="w-full border rounded p-2 focus:ring-indigo-500"
                        value={tituloHito}
                        onChange={(e) => setTituloHito(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea 
                        className="w-full border rounded p-2 focus:ring-indigo-500 resize-none"
                        rows="3"
                        value={descHito}
                        onChange={(e) => setDescHito(e.target.value)}
                    ></textarea>
                </div>
                <button 
                    type="submit"
                    disabled={creating}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-bold transition flex justify-center items-center"
                >
                    {creating ? <Loader2 className="animate-spin w-5 h-5" /> : 'Agregar Hito'}
                </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RamoPage;