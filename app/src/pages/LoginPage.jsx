import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; import { useAuth } from '../contexts/AuthContext.jsx';
import logo from '../image/luminaLogo.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const resultado = await login(email, password);

        setLoading(false);

        if (resultado.success) {
            navigate('/');
        } else {
            setError(resultado.error || 'Error desconocido al iniciar sesión.');
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

            {/* Mensaje de Error Visible */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-red-200 text-sm font-medium">{error}</span>
                </div>
            )}
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
                        disabled={loading} // Deshabilitamos si está cargando
                        className={`bg-primary-yellow hover:bg-yellow-500 text-gray-900 font-extrabold text-xl py-4 px-8 rounded-full focus:outline-none focus:shadow-outline w-full transition duration-150 transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Cargando...' : 'Continuar'}
                    </button>
                </div>
            </form>

            {/* Botón Volver usando navigate */}
            <button
                onClick={() => navigate('/welcome')}
                className="mt-6 text-gray-500 hover:text-white transition-colors text-sm"
            >
                Volver
            </button>

            {/* Mensaje de Error Visible */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-red-200 text-sm font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};

export default LoginPage;