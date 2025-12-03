import axios from 'axios';

// ------------URL BASE DEL BACKEND-----------
const API_BASE_URL = '/api'; 

// Instancia de Axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- PARTE 1 (Faltaba): Inyectar el Token al enviar ---
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

// --- PARTE 2 (Ya la tienes): Manejar errores al recibir ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado: Limpiamos y mandamos al login
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

export default apiClient;