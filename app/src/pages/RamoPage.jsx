import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, PlusCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import apiClient from '../utils/apiClient';

const RamoPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [ramo, setRamo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [tituloHito, setTituloHito] = useState('');
  const [descHito, setDescHito] = useState('');
  const [creating, setCreating] = useState(false);

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

  const handleCreateHito = async (e) => {
    e.preventDefault();
    if (!tituloHito) return;
    setCreating(true);

    try {
      await apiClient.post(`/ramos/${id}/hitos`, {
        titulo: tituloHito,
        descripcion: descHito,
        importancia: 3
      });
      setTituloHito('');
      setDescHito('');
      fetchRamoData();
      alert("¡Hito creado con éxito!");
    } catch (error) {
      console.error("Error creando hito:", error);
      alert("Error al crear hito");
    } finally {
        setCreating(false);
    }
  };

  if (loading) return <div className="p-10 text-white bg-gray-900 min-h-screen">Cargando...</div>;
  if (!ramo) return <div className="p-10 text-red-400 bg-gray-900 min-h-screen">Ramo no encontrado.</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      
      <header className="mb-8 border-b border-gray-700 pb-4">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-2 flex items-center text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1"/> Volver al Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white flex items-center">
            <span className="mr-3">📚</span> {ramo.titulo}
        </h1>
        <p className="text-gray-400 mt-2">{ramo.descripcion}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTA DE HITOS */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
            <Flag className="w-5 h-5 mr-2 text-primary-yellow" />
            Hitos ({ramo.hitos ? ramo.hitos.length : 0})
          </h2>

          <div className="space-y-4">
            {ramo.hitos && ramo.hitos.length > 0 ? (
              ramo.hitos.map((hito) => (
                <div key={hito.id} className="bg-gray-800 p-4 rounded-lg shadow border-l-4 border-indigo-500 transition hover:bg-gray-750">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white">{hito.titulo}</h3>
                    {/* Lógica de progreso (Issue: 100% completado) */}
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                        hito.progreso === 100 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                        {hito.progreso === 100 ? 'COMPLETADO' : `${hito.progreso ? hito.progreso.toFixed(0) : 0}%`}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{hito.descripcion}</p>
                  
                  <div className="mt-3 pt-2 border-t border-gray-700 flex justify-end">
                      <button 
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
                        onClick={() => navigate(`/hitos/${hito.id}/tareas`)}
                      >
                          Ver Tareas <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg border-dashed border-2 border-gray-700 text-center text-gray-500">
                No hay hitos. ¡Crea uno nuevo a la derecha! 👉
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-primary-yellow sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-primary-yellow" />
                Nuevo Hito
            </h3>
            
            <form onSubmit={handleCreateHito}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                    <input 
                        type="text" 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                        value={tituloHito}
                        onChange={(e) => setTituloHito(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none"
                        rows="3"
                        maxLength={200} 
                        value={descHito}
                        onChange={(e) => setDescHito(e.target.value)}
                    ></textarea>
                    <p className="text-right text-xs text-gray-500">{descHito.length}/200</p>
                </div>
                <button 
                    type="submit"
                    disabled={creating}
                    className="w-full bg-primary-yellow text-gray-900 py-2 rounded hover:bg-yellow-400 font-bold transition flex justify-center items-center"
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