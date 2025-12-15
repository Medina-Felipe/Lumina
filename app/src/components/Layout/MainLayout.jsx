import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

// 1. Ya no recibimos navigateTo ni currentPage
const MainLayout = ({ children, headerTitle }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
            
            {/* Sidebar (Overlay en móvil) */}
            <div className={`
                // Fijo y siempre visible en md: (escritorio)
                md:relative md:w-64 md:translate-x-0 md:z-10 
                
                // Móvil: Fijo, superpuesto (z-50), transición, oculto por defecto (-full)
                fixed top-0 left-0 h-full bg-black z-50 w-64 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                {/* 2. Sidebar ya no necesita props de navegación */}
                <Sidebar 
                    toggleSidebar={toggleSidebar} 
                />
            </div>
            
            {/* Fondo oscuro al abrir menú en móvil */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Contenido Principal */}
            <div className="flex-grow flex flex-col md:ml-0">

                {/* 3. Header recibe el título y la función para abrir el menú móvil */}
                <Header 
                    titulo={headerTitle} 
                    toggleSidebar={toggleSidebar} 
                /> 
                
                <main className="flex-grow p-0 bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;