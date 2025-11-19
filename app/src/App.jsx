import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout.jsx'; 
import TareasPage from './pages/TareasPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage'; 


const PAGE_CONFIG = {
    'proyecto_aplicacion': { 
        component: TareasPage, 
        headerTitle: 'Proyecto Aplicación' 
    },
    'home': { component: HomePage, headerTitle: null },
    'search': { component: HomePage, headerTitle: 'Buscar' },
    'progreso': { component: HomePage, headerTitle: 'Progreso' },
    'ramos': { component: HomePage, headerTitle: 'Ramos' },
    'hitos_general': { component: HomePage, headerTitle: 'Hitos' },
    'tareas_general': { component: HomePage, headerTitle: 'Tareas' },
};


const getPage = (currentPage) => {
    const config = PAGE_CONFIG[currentPage] || PAGE_CONFIG['home'];
    const PageComponent = config.component;
    return <PageComponent />;
};


function App() {
    const { isLoggedIn, logout } = useAuth(); 
    
    const [currentAuthView, setCurrentAuthView] = useState('welcome');
    const [currentPage, setCurrentPage] = useState('home'); 

    useEffect(() => {
        if (isLoggedIn) {
            setCurrentPage('proyecto_aplicacion');
        } else {
            setCurrentAuthView('welcome');
            setCurrentPage('home'); 
        }
    }, [isLoggedIn]);

    const navigateTo = (page) => {
        setCurrentPage(page);
    };
    
    const handleAuthNavigate = (view) => {
        setCurrentAuthView(view);
    };

    if (!isLoggedIn) {
        if (currentAuthView === 'login') {
            // LoginPage ya no necesita onLogin
            return <LoginPage onNavigateBack={() => handleAuthNavigate('welcome')} />;
        } else if (currentAuthView === 'register') {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white">
                    {/* ... (Página de registro) ... */}
                    <button onClick={() => handleAuthNavigate('login')} className="bg-yellow-500 px-4 py-2 rounded ml-4">Volver al Login</button>
                </div>
            );
        } else { 
            return <WelcomePage onNavigate={handleAuthNavigate} />;
        }
    }


    if (!isAuthenticated) {
        if (currentAuthView === 'login') {
            return <LoginPage onLogin={handleLoginSuccess} onNavigateBack={() => handleAuthNavigate('welcome')} />;
        } else if (currentAuthView === 'register') {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-3xl">
                    Página de Registro (Crear Cuenta) - ¡Pendiente de implementar!
                    <button onClick={() => handleAuthNavigate('login')} className="bg-orange-500 px-4 py-2 rounded ml-4">Volver al Login</button>
                </div>
            );
        } else { 
            return <WelcomePage onNavigate={handleAuthNavigate} />;
        }
    }
    
    const currentConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['home'];
    const currentHeaderTitle = currentConfig.headerTitle;

    const handleLogout = () => {
        logout();
        setCurrentPage('home');
    };

    return (
        <MainLayout 
            navigateTo={navigateTo}
            headerTitle={currentHeaderTitle}
            currentPage={currentPage} 
            handleLogout={handleLogout}
        > 
            {getPage(currentPage)}
        </MainLayout>
    );
}

export default App;