import logo from '../image/luminaLogo.png';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const LoginPage = ({ onLogin, onNavigateBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setLoading(true);

        try {
            await login(email, password); 
            
        } catch (err) {
            setError(err.message || 'Error desconocido al iniciar sesión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">

            <div className="flex flex-col items-center mb-8">
                <div className="w-40 h-40 flex items-center justify-center mb-6">
                    <img
                        src={logo}
                        alt="Logo de Lumina"
                        className="w-full h-full object-contain"
                    />
                </div>
                <h2 className="text-4xl font-bold text-white">
                    Ingresa a tu cuenta de Lumina
                </h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-8 rounded-xl w-full max-w-md"
            >

                {/* Campo de Correo */}
                <div className="mb-4">
                    <label className="block text-gray-400 text-lg font-medium mb-2" htmlFor="email">
                        Correo
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-900 border-b border-gray-700 focus:border-yellow-400 text-white w-full py-3 px-0 focus:outline-none text-lg"
                        placeholder="Ingresa tu correo"
                        required
                    />
                </div>

                {/* Campo de Contraseña */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-lg font-medium mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-b border-gray-700 focus:border-yellow-400 text-white w-full py-3 px-0 focus:outline-none text-lg"
                        placeholder="Escribe tu contraseña"
                        required
                    />
                </div>

                {/* Botón de Continuar */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-primary-yellow hover:bg-yellow-500 text-gray-900 font-extrabold text-xl py-4 px-8 rounded-full focus:outline-none focus:shadow-outline w-full transition duration-150 transform hover:scale-105"
                    >
                        Continuar
                    </button>
                </div>
            </form>


            <button
                onClick={onNavigateBack}
                className="mt-6 text-gray-500 hover:text-white transition-colors text-sm"
            >
                Volver
            </button>
        </div>
    );
};

export default LoginPage;