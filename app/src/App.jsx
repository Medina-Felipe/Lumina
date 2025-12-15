import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import MainLayout from './components/Layout/MainLayout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import TareasPage from './pages/TareasPage';
import RamoPage from './pages/RamoPage';
import ProgresoGlobalPage from './pages/ProgresoGlobalPage';
import EstadisticasTiempoPage from './pages/EstadisticasTiempoPage'; 

const ProtectedRoute = ({ children, headerTitle }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-white p-10">Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <MainLayout headerTitle={headerTitle}>
            {children}
        </MainLayout>
    );
};

const RootRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-white p-10">Cargando...</div>;
    if (user) {
        return <Navigate to="/ramos" replace />;
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
            <Route path="/" element={<RootRoute />} />

            {/* --- Rutas Privadas --- */}
            
            <Route path="/progreso" element={
                <ProtectedRoute headerTitle="Progreso Académico">
                    <ProgresoGlobalPage />
                </ProtectedRoute>
            } />

            {/* NUEVA RUTA DE TIEMPO */}
            <Route path="/tiempo" element={
                <ProtectedRoute headerTitle="Estadísticas de Tiempo">
                    <EstadisticasTiempoPage />
                </ProtectedRoute>
            } />

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