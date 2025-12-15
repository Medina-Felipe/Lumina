import React, { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const TimeSaveModal = ({ seconds, onClose, onSave }) => {
    const [ramos, setRamos] = useState([]);
    
    // Estados de selección
    const [selectedRamo, setSelectedRamo] = useState('');
    const [selectedHito, setSelectedHito] = useState('');
    const [selectedTarea, setSelectedTarea] = useState('');
    
    const [saving, setSaving] = useState(false);

    // 1. Cargar Ramos al abrir el modal para poder elegir
    useEffect(() => {
        const loadRamos = async () => {
            try {
                const response = await apiClient.get('/ramos');
                setRamos(response.data.data || response.data);
            } catch (error) {
                console.error("Error cargando ramos:", error);
            }
        };
        loadRamos();
    }, []);

    // Lógica para filtrar selects dependientes
    const hitosDisponibles = selectedRamo 
        ? ramos.find(r => r.id === parseInt(selectedRamo))?.hitos || []
        : [];

    const tareasDisponibles = selectedHito
        ? hitosDisponibles.find(h => h.id === parseInt(selectedHito))?.tareas || []
        : [];

    // --- GUARDADO REAL ---
    const handleSave = async () => {
        if (!selectedRamo) {
            alert("Debes seleccionar al menos un Ramo.");
            return;
        }
        
        setSaving(true);
        
        // Preparamos los datos reales para el Backend
        const sessionData = {
            duration: seconds,                      
            ramoId: parseInt(selectedRamo),        
            hitoId: selectedHito ? parseInt(selectedHito) : null,   
            tareaId: selectedTarea ? parseInt(selectedTarea) : null, 
            fecha: new Date().toISOString()          
        };

        try {
            // LLAMADA A LA API REAL
            await apiClient.post('/tiempos', sessionData);
            
            onSave(); 
            onClose(); 
        } catch (error) {
            console.error("Error al guardar el tiempo:", error);
            alert("Hubo un error al guardar tu sesión. Inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Registrar Sesión</h2>
                <p className="text-gray-400 text-sm mb-4">¿En qué has estado trabajando?</p>
                
                <div className="text-primary-yellow text-4xl font-mono font-bold mb-6 text-center bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    {formatTime(seconds)}
                </div>

                <div className="space-y-4">
                    {/* SELECT RAMO */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Asignatura</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                            value={selectedRamo}
                            onChange={(e) => {
                                setSelectedRamo(e.target.value);
                                setSelectedHito(''); 
                                setSelectedTarea('');
                            }}
                        >
                            <option value="">-- Selecciona un Ramo --</option>
                            {ramos.map(r => (
                                <option key={r.id} value={r.id}>{r.titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* SELECT HITO */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hito (Opcional)</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            value={selectedHito}
                            onChange={(e) => {
                                setSelectedHito(e.target.value);
                                setSelectedTarea('');
                            }}
                            disabled={!selectedRamo}
                        >
                            <option value="">-- General del Ramo --</option>
                            {hitosDisponibles.map(h => (
                                <option key={h.id} value={h.id}>{h.titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* SELECT TAREA */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tarea (Opcional)</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            value={selectedTarea}
                            onChange={(e) => setSelectedTarea(e.target.value)}
                            disabled={!selectedHito}
                        >
                            <option value="">-- Sin tarea específica --</option>
                            {tareasDisponibles.map(t => (
                                <option key={t.id} value={t.id}>{t.titulo}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    disabled={saving || !selectedRamo}
                    className="w-full mt-8 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
                    {saving ? "Guardando..." : "Guardar Tiempo"}
                </button>
            </div>
        </div>
    );
};

export default TimeSaveModal;