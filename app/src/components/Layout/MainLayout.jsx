import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, headerTitle }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
            
            {/* Sidebar */}
            <div className={`
                // CAMBIO CLAVE: Agregamos 'min-h-screen' para que llegue hasta abajo siempre
                md:relative md:w-64 md:translate-x-0 md:z-10 md:min-h-screen
                
                // Móvil:
                fixed top-0 left-0 h-full bg-black z-50 w-64 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar toggleSidebar={toggleSidebar} />
            </div>
            
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Contenido Principal */}
            <div className="flex-grow flex flex-col md:ml-0 overflow-hidden">
                <Header 
                    titulo={headerTitle} 
                    toggleSidebar={toggleSidebar} 
                /> 
                
                <main className="flex-grow p-0 bg-gray-900 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;