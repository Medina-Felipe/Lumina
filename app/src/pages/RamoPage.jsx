import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flag, PlusCircle, Loader2, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import apiClient from '../utils/apiClient';

const RamoPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- Estados de Datos ---
  const [ramo, setRamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  
  // --- Estados del Formulario ---
  const [tituloHito, setTituloHito] = useState('');
  const [descHito, setDescHito] = useState('');
  const [importancia, setImportancia] = useState(''); 
  const [creating, setCreating] = useState(false);

  // --- 1. CARGA DE DATOS ---
  const fetchRamoData = async () => {
    try {
      // A. Cargar info del Ramo (Hitos, etc.)
      const response = await apiClient.get(`/ramos/${id}`);
      setRamo(response.data);

      // B. Cargar Tiempo Total (Real)
      // Si el endpoint no existe o falla, asumimos 0 silenciosamente
      try {
        const timeResponse = await apiClient.get(`/ramos/${id}/tiempo`);
        setTotalTimeSeconds(timeResponse.data.totalSeconds || 0);
      } catch (timeError) {
        console.warn("No hay datos de tiempo disponibles.", timeError);
        setTotalTimeSeconds(0); 
      }

    } catch (error) {
      console.error("Error cargando ramo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRamoData();
  }, [id]);

  // Helper para formatear tiempo (ej: 1h 30m)
  const formatTotalTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // --- 2. LÓGICA DE PORCENTAJES ---
  const porcentajeAsignado = ramo?.hitos?.reduce((acc, h) => acc + (h.importancia || 0), 0) || 0;
  const porcentajeRestante = Math.max(0, 100 - porcentajeAsignado);

  // --- 3. CREAR HITO ---
  const handleCreateHito = async (e) => {
    e.preventDefault();
    if (!tituloHito) return;
    
    const valorImportancia = parseInt(importancia);

    // Validaciones
    if (!valorImportancia || valorImportancia <= 0) {
        alert("Ingresa un porcentaje válido (Ej: 20).");
        return;
    }
    if (valorImportancia > porcentajeRestante) {
        alert(`Solo queda ${porcentajeRestante}% disponible en el ramo.`);
        return;
    }

    setCreating(true);

    try {
      await apiClient.post(`/ramos/${id}/hitos`, {
        titulo: tituloHito,
        descripcion: descHito,
        importancia: valorImportancia 
      });
      
      // Limpiar y recargar
      setTituloHito('');
      setDescHito('');
      setImportancia('');
      fetchRamoData(); 
      
    } catch (error) {
      console.error("Error creando hito:", error);
      alert("Error al crear el hito.");
    } finally {
      setCreating(false);
    }
  };

  const handleViewTareas = (hitoId) => {
    navigate(`/hitos/${hitoId}/tareas`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!ramo) return <div className="text-white text-center mt-10">Ramo no encontrado</div>;

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-gray-900 text-white">
      
      {/* --- PANEL IZQUIERDO: DETALLE Y HITOS --- */}
      <div className="w-full md:w-2/3 p-6 md:p-10 overflow-y-auto">
        
        {/* Encabezado del Ramo */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/ramos')}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Volver"
            >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{ramo.titulo}</h1>
                        <p className="text-gray-400 text-lg mb-2">{ramo.descripcion}</p>
                    </div>

                    {/* TARJETA DE TIEMPO TOTAL */}
                    <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 flex flex-col items-center shadow-lg transform hover:scale-105 transition-transform">
                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Tiempo Total</span>
                        </div>
                        <span className={`text-2xl font-mono ${totalTimeSeconds > 0 ? 'text-primary-yellow' : 'text-gray-500'}`}>
                            {totalTimeSeconds > 0 ? formatTotalTime(totalTimeSeconds) : "-- : --"}
                        </span>
                    </div>
                </div>
                
                {/* BARRA DE PROGRESO DE PONDERACIÓN */}
                <div className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg max-w-md border border-gray-700 mt-4">
                    <div className="text-xs font-bold text-gray-400 uppercase">Peso Asignado:</div>
                    <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${porcentajeAsignado === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${porcentajeAsignado}%` }}
                        ></div>
                    </div>
                    <div className="text-xs font-mono text-white">{porcentajeAsignado}% / 100%</div>
                </div>
            </div>
        </div>

        {/* LISTA DE HITOS */}
        <div className="space-y-4">
          {ramo.hitos && ramo.hitos.length > 0 ? (
            ramo.hitos.map((hito) => (
              <div 
                key={hito.id} 
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col sm:flex-row justify-between items-center group hover:border-indigo-500 transition-all duration-300"
              >
                {/* Visualización Original con Bandera */}
                <div className="flex items-start gap-4 mb-4 sm:mb-0 w-full">
                  <div className="bg-indigo-900/50 p-3 rounded-lg text-indigo-400 hidden sm:block">
                    <Flag className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {hito.titulo}
                        </h3>
                        {/* Etiqueta de Porcentaje */}
                        <span className="text-xs bg-gray-700 text-indigo-300 border border-gray-600 px-2 py-0.5 rounded-full font-mono">
                            {hito.importancia || 0}%
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2 max-w-md">
                        {hito.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleViewTareas(hito.id)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-transform transform hover:scale-105 whitespace-nowrap"
                >
                  Ver Tareas <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-500 text-lg">No hay hitos en este ramo.</p>
              <p className="text-sm text-gray-600">Agrega evaluaciones a la derecha.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- PANEL DERECHO: FORMULARIO --- */}
      <div className="w-full md:w-1/3 bg-gray-800 border-l border-gray-700 p-6 md:p-10 shadow-2xl relative">
        <div className="sticky top-10">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <PlusCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-wider">Nuevo Hito</h2>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <form onSubmit={handleCreateHito}>
                
                {/* Input Título */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                    <input 
                        type="text" 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors"
                        value={tituloHito}
                        onChange={(e) => setTituloHito(e.target.value)}
                        placeholder="Ej: Certamen 1"
                        required
                    />
                </div>

                {/* Input Descripción */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                    <textarea 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none transition-colors"
                        rows="3"
                        maxLength={200} 
                        value={descHito}
                        onChange={(e) => setDescHito(e.target.value)}
                        placeholder="Detalles..."
                    ></textarea>
                </div>

                {/* Input Porcentaje */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-400">Ponderación (%)</label>
                        <span className={`text-xs ${porcentajeRestante === 0 ? 'text-red-400' : 'text-green-400'}`}>
                            Disponible: {porcentajeRestante}%
                        </span>
                    </div>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="1" max="100"
                            className={`w-full bg-gray-900 border rounded p-2 text-white focus:outline-none focus:ring-2 transition-all ${
                                (parseInt(importancia || 0) > porcentajeRestante && porcentajeRestante > 0)
                                ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-yellow-500'
                            }`}
                            placeholder={porcentajeRestante > 0 ? `Máx: ${porcentajeRestante}` : "0"}
                            value={importancia}
                            onChange={(e) => setImportancia(e.target.value)}
                            required
                            disabled={porcentajeRestante === 0} 
                        />
                        <span className="absolute right-3 top-2 text-gray-500 font-bold">%</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={creating || (porcentajeRestante === 0)}
                    className="w-full bg-primary-yellow text-gray-900 py-3 rounded hover:bg-yellow-400 font-bold transition flex justify-center items-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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