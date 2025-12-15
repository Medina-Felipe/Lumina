import axios from 'axios';

// ------------URL BASE DEL BACKEND-----------
const API_BASE_URL = 'http://127.0.0.1:5000/api'; 

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

// Servicio de Autenticación
export const AuthService = {
    async login(email, password) {
        try {
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

// --- SERVICIO EXTERNO (NUEVO) ---
export const ExternalService = {
    async getQuote() {
        try {
            const response = await apiClient.get('/external/quote');
            return response.data;
        } catch (error) {
            console.error("Error obteniendo cita en frontend:", error);
            // Fallback del frontend si falla incluso la conexión a nuestro backend
            return { quote: "Sigue estudiando, tú puedes.", author: "Lumina", source: "frontend_fallback" };
        }
    }
};

export default apiClient;