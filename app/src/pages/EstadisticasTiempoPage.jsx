import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Clock, AlertCircle, Loader2 } from 'lucide-react';
import apiClient from '../utils/apiClient';

const EstadisticasTiempoPage = () => {
  const [dataSemanal, setDataSemanal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await apiClient.get('/tiempos/estadisticas');
            // Procesamos los datos para que Recharts los entienda bien
            // Asumimos que el backend devuelve: { fecha: "2023-10-01", seconds: 3600 }
            const dataProcesada = (response.data || []).map(item => ({
                dia: new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'short' }), // "Lun", "Mar"
                horas: (item.duration / 3600).toFixed(2), // Convertimos segundos a horas decimales
                segundos: item.duration // Guardamos el original para el tooltip
            }));
            
            setDataSemanal(dataProcesada);
        } catch (error) {
            console.warn("Usando datos vacíos por error de conexión o falta de datos.");
            setDataSemanal([]); 
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // --- TOOLTIP PERSONALIZADO ---
  // Esto hace que se vea bonito: "2h 30m" en lugar de "2.5"
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const secs = payload[0].payload.segundos;
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);

      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-sm mb-1 capitalize">{label}</p>
          <p className="text-primary-yellow font-bold text-lg">
            {h}h {m}m
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-900 text-white">
      <div className="mb-8 flex items-center gap-3 border-b border-gray-800 pb-4">
        <Clock className="text-primary-yellow w-8 h-8" />
        <h1 className="text-3xl font-bold">Tiempo de Estudio</h1>
      </div>

      {/* ESTADO VACÍO */}
      {dataSemanal.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-800/50 rounded-3xl border border-dashed border-gray-700 animate-in fade-in zoom-in duration-300">
              <div className="bg-gray-800 p-4 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-300">No hay datos disponibles</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                  Aún no has registrado sesiones de estudio con el cronómetro. 
                  ¡Empieza una sesión arriba a la derecha! ↗️
              </p>
          </div>
      )}

      {/* GRÁFICO DE RECHARTS */}
      {dataSemanal.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
             <h3 className="text-lg font-bold text-gray-300 mb-6">Actividad de los últimos días</h3>
             
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataSemanal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        
                        <XAxis 
                            dataKey="dia" 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        
                        <YAxis 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}h`} // Formato eje Y: "1h", "2h"
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.2 }} />
                        
                        <Bar 
                            dataKey="horas" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                        >
                            {/* Colores dinámicos: Las barras altas se ven más brillantes */}
                            {dataSemanal.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.horas > 2 ? '#6366f1' : '#4f46e5'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
      )}
    </div>
  );
};

export default EstadisticasTiempoPage;