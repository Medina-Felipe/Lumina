import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
// YA NO importamos AuthProvider aquí, porque vive dentro de App.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Limpiamos: Solo renderizamos App, ella se encarga del resto */}
        <App />
    </React.StrictMode>,
);