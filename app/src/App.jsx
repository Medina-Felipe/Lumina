import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';


// Componentes y Páginas
import MainLayout from './components/Layout/MainLayout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import TareasPage from './pages/TareasPage';
import RamoPage from './pages/RamoPage';
import ProgresoGlobalPage from './pages/ProgresoGlobalPage';
import EstadisticasTiempoPage from './pages/EstadisticasTiempoPage';

// --- Componente 1: Rutas Protegidas (Estándar) ---
// Usado para rutas internas (/ramos, /tareas). 
// Si no estás logueado, te manda al LOGIN (para que te loguees y veas el contenido).
const ProtectedRoute = ({ children, headerTitle }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-white p-10">Cargando...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <MainLayout headerTitle={headerTitle}>
            {children}
        </MainLayout>
    );
};

// --- Componente 2: Ruta Raíz Inteligente (NUEVO) ---
// Usado SOLO para la ruta '/'.
// Si estás logueado -> Te muestra el Home.
// Si NO estás logueado -> Te manda al Welcome (Landing Page).
const RootRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-white p-10">Cargando...</div>;

    // Aquí está la magia:
    if (user) {
        return (
            <MainLayout headerTitle={null}>
                <HomePage />
            </MainLayout>
        );
    } else {
        return <Navigate to="/welcome" replace />;
    }
};

const AppContent = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* --- Ruta Raíz (La que cambiamos) --- */}
            {/* Usamos nuestro nuevo componente RootRoute */}
            <Route path="/" element={<RootRoute />} />

            {/* --- Rutas Privadas Específicas --- */}
            {/* Estas siguen usando ProtectedRoute porque si intentas entrar directo, quieres ver datos */}
            
            {/* Ruta de Progreso Global con Gráficos */}
            <Route path="/progreso" element={
                <ProtectedRoute headerTitle="Progreso Académico">
                    <ProgresoGlobalPage />
                </ProtectedRoute>
            } />

            {/* Ruta de Estadísticas de Tiempo */}
            <Route path="/tiempo" element={
                <ProtectedRoute headerTitle="Estadísticas de Tiempo">
                    <EstadisticasTiempoPage />
                </ProtectedRoute>
            } />
            
            {/* Ruta para ver las tareas de un Hito específico */}
            <Route path="/hitos/:hitoId/tareas" element={
                <ProtectedRoute headerTitle="Gestión de Tareas">
                    <TareasPage />
                </ProtectedRoute>
            } />          

            <Route path="/ramos" element={
                <ProtectedRoute headerTitle="Ramos">
                    <HomePage />
                </ProtectedRoute>
            } />

            <Route path="/ramos/:id" element={
                <ProtectedRoute headerTitle="Detalle de Asignatura">
                    <RamoPage />
                </ProtectedRoute>
            } />

            <Route path="/hitos" element={
                <ProtectedRoute headerTitle="Hitos">
                    <HomePage /> 
                </ProtectedRoute>
            } />

            {/* Catch-all: Cualquier ruta desconocida manda al inicio (que decidirá si ir a Home o Welcome) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider> 
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;