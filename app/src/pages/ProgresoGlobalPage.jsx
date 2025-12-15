import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';


// 1. Barra de Progreso Lineal
const ProgressBar = ({ progress, colorClass = "bg-indigo-500" }) => {
    const cleanProgress = Math.min(Math.max(progress, 0), 100);
    return (
      <div className="w-full">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-700 ease-out ${colorClass}`} 
            style={{ width: `${cleanProgress}%` }}
          ></div>
        </div>
      </div>
    );
};

// 2. Gráfico de Anillo (Donut)
const DonutChart = ({ percentage, size = 120, color = "#6366f1", label = "Avance" }) => {
    const cleanPercentage = Math.min(Math.max(percentage, 0), 100);
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (cleanPercentage / 100) * circumference;
  
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="transparent" />
          <circle 
            cx={size/2} cy={size/2} r={radius} 
            stroke={color} strokeWidth={strokeWidth} fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-white">
          <span className="text-2xl font-bold">{cleanPercentage}%</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
      </div>
    );
};

// --- LÓGICA DE CÁLCULO ---
const calculateHitoProgress = (tareas = []) => {
    if (!tareas || tareas.length === 0) return 0;
    const completed = tareas.filter(t => t.completada).length;
    return Math.round((completed / tareas.length) * 100);
};

const calculateRamoProgress = (hitos = []) => {
    if (!hitos || hitos.length === 0) return 0;
    let avanceAcumulado = 0;

    hitos.forEach(hito => {
        const avanceHito = calculateHitoProgress(hito.tareas || []);
        const peso = hito.importancia || 0; 
        
        // Sumamos el ponderado
        avanceAcumulado += (avanceHito * peso) / 100;
    });

    return Math.round(avanceAcumulado);
};

// --- PÁGINA PRINCIPAL ---
const ProgresoGlobalPage = () => {
  const [ramos, setRamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/ramos'); 
        setRamos(response.data.data || response.data); 
      } catch (error) {
        console.error("Error al cargar progreso:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-900 text-white">
      {/* Título */}
      <div className="mb-8 flex items-center gap-3 border-b border-gray-800 pb-4">
        <TrendingUp className="text-indigo-500 w-8 h-8" />
        <h1 className="text-3xl font-bold">Progreso Académico</h1>
      </div>

      {ramos.length === 0 ? (
        <div className="text-center py-10 opacity-70">
          <p>No tienes ramos registrados para calcular progreso.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ramos.map((ramo) => {
            const avanceTotal = calculateRamoProgress(ramo.hitos);
            
            // Colores según avance
            let colorChart = "#ef4444"; 
            if (avanceTotal >= 40) colorChart = "#eab308"; 
            if (avanceTotal >= 75) colorChart = "#22c55e"; 
            return (
              <div key={ramo.id} className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col hover:border-gray-600 transition-colors">
                
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold truncate pr-2 text-indigo-100">{ramo.titulo}</h2>
                </div>
                <p className="text-sm text-gray-400 mb-6 line-clamp-1">{ramo.descripcion}</p>

                {/* Gráfico Donut */}
                <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
                  <DonutChart percentage={avanceTotal} color={colorChart} size={150} label="Total" />
                </div>

                {/* Lista de Hitos (Barras) */}
                <div className="mt-auto space-y-4 bg-gray-900/50 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
                    Desglose por Hitos
                  </h3>
                  
                  {ramo.hitos && ramo.hitos.length > 0 ? (
                    ramo.hitos.map(hito => {
                      const avanceHito = calculateHitoProgress(hito.tareas);
                      return (
                        <div key={hito.id} className="mb-3 last:mb-0">
                           <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300 truncate w-3/4">{hito.titulo}</span>
                              <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">
                                {hito.importancia || 0}%
                              </span>
                           </div>
                           <ProgressBar 
                              progress={avanceHito} 
                              colorClass={avanceHito === 100 ? "bg-green-500" : "bg-indigo-500"}
                           />
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Sin hitos definidos</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgresoGlobalPage;