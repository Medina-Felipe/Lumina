import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import logo from '../image/luminaLogo.png';

const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Llamamos a la función de registro
        const resultado = await register(nombre, email, password);
        setLoading(false);

        if (resultado.success) {
            // Si se creó bien, mandamos al usuario al Login para que entre
            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            navigate('/login');
        } else {
            setError(resultado.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">

            <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 flex items-center justify-center mb-4">
                    <img src={logo} alt="Logo de Lumina" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-3xl font-bold text-white text-center">
                    Crea tu cuenta en Lumina
                </h2>
            </div>

            {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4 w-full max-w-md text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-2xl">
                
                {/* Nombre */}
                <div className="mb-4">
                    <label className="block text-gray-400 text-lg font-medium mb-2">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="bg-gray-800 border-b border-gray-600 focus:border-yellow-400 text-white w-full py-3 px-4 rounded focus:outline-none text-lg"
                        placeholder="Tu nombre"
                        required
                    />
                </div>

                {/* Correo */}
                <div className="mb-4">
                    <label className="block text-gray-400 text-lg font-medium mb-2">Correo</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-800 border-b border-gray-600 focus:border-yellow-400 text-white w-full py-3 px-4 rounded focus:outline-none text-lg"
                        placeholder="ejemplo@correo.com"
                        required
                    />
                </div>

                {/* Contraseña */}
                <div className="mb-8">
                    <label className="block text-gray-400 text-lg font-medium mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 border-b border-gray-600 focus:border-yellow-400 text-white w-full py-3 px-4 rounded focus:outline-none text-lg"
                        placeholder="Crea una contraseña segura"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-primary-red hover:bg-red-500 text-white font-extrabold text-xl py-4 px-8 rounded-full w-full transition duration-150 transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creando...' : 'Registrarse'}
                </button>
            </form>

            <button onClick={() => navigate('/login')} className="mt-6 text-gray-500 hover:text-white transition-colors text-sm">
                ¿Ya tienes cuenta? Inicia sesión
            </button>
        </div>
    );
};

export default RegisterPage;