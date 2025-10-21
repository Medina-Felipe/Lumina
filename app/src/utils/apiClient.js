import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TareaService = {
    getAll: async () => {
    try {
      const response = await apiClient.get('/hitos/${hitoId}/tareas'); 
      return response.data;
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      throw error;
    }
  },

  create: async (tareaData) => {
    try {
      const response = await apiClient.post('/hitos/${hitoId}/tareas', tareaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const response = await apiClient.delete(`/tareas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tarea con ID ${id}:`, error);
      throw error;
    }
  },

    update: async (id, data) => { 
        const response = await apiClient.put(`/tareas/${id}`, data);
        return response.data;
    },
};

