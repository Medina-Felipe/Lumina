import React from "react";
import HitoTareas from '../components/Tareas/HitoTareas';

const TareasPage = () => {
const hitoData = {
    nombre: "Hito 3",
    desc: "Descripción del Hito 3......",
    apuntes: "Notas Importantes",
    proyecto: "Lumina"
};

return (
    <div className="flex w-full min-h-screen bg-gray-900">
      <div className="w-1/2 p-6 font-bold text-gray-400 mb-2">
        <h1 className="text-xl font-bold text-gray-400 mb-2">
            {hitoData.proyecto}
        </h1>
        <h2 className="text-2xl font-bold text-white mb-6">
            {hitoData.nombre}
        </h2>

        <p className="text-gray-400 text-lg mb-2">
            {hitoData.descripcion}
        </p>
        <p className="text-gray-500 text-md">
            {hitoData.apuntes}
        </p>

        <div className="flex space-x-3 text-gray-400 mt-6">
            <span className="text-xl">✏️</span> 
            <span className="text-xl">🔗</span>
            <span className="text-xl">🗑️</span>
        </div>
      </div>

      <div className="w-1/2">
        <HitoTareas />
      </div>
    </div>
);
};

export default TareasPage;
