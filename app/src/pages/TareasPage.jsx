// app/src/pages/TareasPage.jsx

import React from "react";
import HitoTareas from '../components/Tareas/HitoTareas'; 

const TareasPage = () => {
    const hitoData = {
        nombre: "Hito 1", 
        desc: "Descripción del Hito", 
        apuntes: "Apuntes rápidos",
        // ✅ Quitamos 'proyecto' ya que ahora va en el Header.
    };

    return (
        <div className="flex w-full min-h-[calc(100vh-4rem)]"> 
            {/* 1. Panel Izquierdo: Información del Hito (MITAD IZQUIERDA) */}
            <div className="w-1/2 p-6 border-r border-gray-800"> 
                {/* ❌ ELIMINADO: El Título del proyecto ya no va aquí. */}
                
                {/* Hito 1 y Controles */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        {hitoData.nombre}
                    </h2>
                    {/* Iconos del Hito (Reloj, +, Lista) - Como en la imagen */}
                    <div className="flex space-x-2 text-gray-400">
                        <span className="cursor-pointer hover:text-white text-xl">⏱️</span>
                        <span className="cursor-pointer hover:text-white text-xl">+</span>
                        <span className="cursor-pointer hover:text-white text-xl">☰</span>
                    </div>
                </div>

                {/* Descripción y Apuntes */}
                <p className="text-gray-400 text-lg mb-2 italic">
                    {/* ✅ Se ve cursiva en la imagen */}
                    {hitoData.desc} 
                </p>
                <p className="text-gray-500 text-md">
                    {hitoData.apuntes}
                </p>
                {/* ... Otros iconos ... */}
            </div>

            {/* 2. Panel Derecho: Lista de Tareas (MITAD DERECHA) */}
            <div className="w-1/2 p-6">
                <HitoTareas />
            </div>
        </div>
    );
};

export default TareasPage;