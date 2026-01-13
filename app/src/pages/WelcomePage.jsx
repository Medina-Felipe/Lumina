
import React from 'react';
import logo from '../image/luminaLogo.png';

const WelcomePage = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-6">
            {/* Header de la Landing Page */}
            <header className="flex justify-between items-center w-full max-w-7xl pt-4">
                {/* Logo Luminia */}
                <div className="flex items-center">
                    <div className="w-20 h-20 flex items-center justify-center mb-4">
                        <img
                            src={logo} 
                            alt="Logo de Lumina"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-widest">
                        LUMINA
                    </h1>
                </div>

                {/* Botones de Acceder y Crear Cuenta */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => onNavigate('login')}
                        className="border border-white text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-lg"
                    >
                        Acceder
                    </button>
                    <button
                        onClick={() => onNavigate('register')}
                        className="bg-primary-red hover:bg-primary-red/80 text-white px-6 py-2 rounded-full transition-colors text-lg"
                    >
                        Crear Cuenta
                    </button>
                </div>
            </header>

            {/* Contenido Central */}
            <main className="flex flex-col items-center justify-center flex-grow text-center pb-20">
                <h2 className="text-5xl font-bold text-white mb-4">
                    Mejora tus productividad con esta aplicación
                </h2>
                <p className="text-gray-400 text-xl mb-12">
                    Todo lo que necesitas en una sola plataforma
                </p>

                <button
                    onClick={() => onNavigate('login')}
                    className="bg-primary-yellow hover:bg-primary-yellow/80 text-gray-900 font-extrabold text-3xl px-12 py-6 rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-200"
                >
                    ¡Empieza ya!
                </button>
            </main>

            {/* Footer todavia falta */}
            <footer className="text-gray-600 text-sm py-4">
            </footer>
        </div>
    );
};

export default WelcomePage;


