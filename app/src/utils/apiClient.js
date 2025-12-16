import axios from 'axios';

// --- CAMBIO AQUÍ ---
// La URL base DEBE terminar en /api para que coincida con Nginx y Flask
// ❌ INCORRECTO: 'https://lumina-osun.onrender.com'
// ✅ CORRECTO:   'https://lumina-osun.onrender.com/api'

const API_BASE_URL = 'https://lumina-osun.onrender.com/api'; 

// Si usas variables de entorno en producción (recomendado), sería así:
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instancia de Axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Solicitudes (Request): Inyecta el Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Respuestas (Response): Maneja Token Expirado
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// Servicio de Autenticación (Ya existente)
export const AuthService = {
    async login(email, password) {
        try {
            // Axios concatenará baseURL + '/auth/login'
            // Resultado final: https://lumina-osun.onrender.com/api/auth/login
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });
            return response.data; 
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error de conexión con el servidor.';
            throw new Error(errorMessage);
        }
    },
};

// --- SERVICIO EXTERNO ---
export const ExternalService = {
    async getQuote() {
        try {
            const response = await apiClient.get('/external/quote');
            return response.data;
        } catch (error) {
            console.error("Error obteniendo cita en frontend:", error);
            return { 
                quote: "Sigue estudiando, tú puedes.", 
                author: "Lumina (Frontend Fallback)", 
                source: "frontend_fallback" 
            };
        }
    }
};

export default apiClient;
```
```
