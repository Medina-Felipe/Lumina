// app/src/App.jsx

import React, { useState } from 'react';
import MainLayout from './components/Tareas/Layout/MainLayout.jsx'; 
import TareasPage from './pages/TareasPage';
import HomePage from './pages/HomePage'; 

// Mapeo de páginas que usan TareasPage y su título de Header
const PAGE_CONFIG = {
    'proyecto_aplicacion': { 
        component: TareasPage, 
        headerTitle: 'Proyecto Aplicación' 
    },
    'programacion_avanzada': { 
        component: TareasPage, 
        headerTitle: 'Programación Avanzada' 
    },
    'home': { 
        component: HomePage, 
        headerTitle: null // Ocultar o mostrar un título genérico
    },
    // Añade más páginas según sea necesario
};

// Función para determinar qué componente renderizar
const getPage = (currentPage) => {
    const config = PAGE_CONFIG[currentPage] || PAGE_CONFIG['home'];
    const PageComponent = config.component;
    return <PageComponent />;
};


function App() {
    const [currentPage, setCurrentPage] = useState('home'); 

    // 💡 Función para manejar la navegación y actualizar el título
    const navigateTo = (page) => {
        setCurrentPage(page);
    };
    
    // Obtener el título actual del header
    const currentConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['home'];
    const currentHeaderTitle = currentConfig.headerTitle;

    return (
        // 💡 Pasar navigateTo Y el título actual al layout
        <MainLayout 
            navigateTo={navigateTo}
            headerTitle={currentHeaderTitle} // 👈 Nuevo prop
        > 
            {getPage(currentPage)}
        </MainLayout>
    );
}
export default App;