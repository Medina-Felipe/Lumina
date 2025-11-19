import axios from 'axios';

// ------------URL BASE DEL BACKEND-----------
const API_BASE_URL = 'http://127.0.0.1:5000/api'; 

//Instancia de Axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Añade el token JWT a cada petición saliente
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
    // (Añadir aquí método register si es necesario)
};
export default apiClient;