import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';


const MainLayout = ({ children, navigateTo, headerTitle, currentPage }) => {
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

                <Sidebar 
                    navigateTo={navigateTo} 
                    currentPage={currentPage} 
                    toggleSidebar={toggleSidebar} 
                />
            </div>
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Contenido Principal */}
            <div className="flex-grow flex flex-col md:ml-0">

                <Header 
                    titulo={headerTitle} 
                    navigateTo={navigateTo} 
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