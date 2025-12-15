import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/apiClient';
import { MemoryRouter } from 'react-router-dom';

// 1. Mock de apiClient para interceptar las llamadas al backend
vi.mock('../utils/apiClient', () => ({
    default: {
        post: vi.fn(),
    },
}));

// 2. Mock de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// 3. Componente "Dummy" para consumir el Contexto
// Este componente nos permite "tocar" las funciones del context desde el test
const TestComponent = () => {
    const { user, login, register, logout, isLoggedIn } = useAuth();

    return (
        <div>
            <div data-testid="user-status">{isLoggedIn ? 'Logueado' : 'No Logueado'}</div>
            <div data-testid="user-token">{user ? user.token : ''}</div>
            
            <button onClick={async () => {
                const res = await login('test@test.com', '123456');
                if (!res.success) document.getElementById('error-msg').textContent = res.error;
            }}>
                Login
            </button>

            <button onClick={async () => {
                const res = await register('Nombre', 'test@test.com', '123456');
                if (!res.success) document.getElementById('error-msg').textContent = res.error;
            }}>
                Register
            </button>

            <button onClick={logout}>Logout</button>
            <div id="error-msg"></div>
        </div>
    );
};

describe('AuthContext', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear(); // Limpiamos localStorage antes de cada test
    });

    test('Inicializa SIN usuario si no hay token en localStorage', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('user-status')).toHaveTextContent('No Logueado');
    });

    test('Inicializa CON usuario si ya existe un token en localStorage', () => {
        // Simulamos que ya había un token guardado
        localStorage.setItem('access_token', 'token-existente-123');

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('user-status')).toHaveTextContent('Logueado');
        expect(screen.getByTestId('user-token')).toHaveTextContent('token-existente-123');
    });

    test('Login Exitoso: guarda token y actualiza estado', async () => {
        // Simulamos respuesta exitosa del API
        apiClient.post.mockResolvedValue({ data: { access_token: 'nuevo-token-abc' } });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        // Click en Login
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            // Verificamos que se llamó al API
            expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: '123456' });
            // Verificamos que el estado cambió a Logueado
            expect(screen.getByTestId('user-status')).toHaveTextContent('Logueado');
            // Verificamos que se guardó en localStorage
            expect(localStorage.getItem('access_token')).toBe('nuevo-token-abc');
        });
    });

    test('Login Fallido: maneja el error correctamente', async () => {
        // Simulamos error del API (ej: credenciales inválidas)
        apiClient.post.mockRejectedValue({ 
            response: { data: { error: 'Credenciales inválidas' } } 
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            // Verificamos que NO cambió el estado
            expect(screen.getByTestId('user-status')).toHaveTextContent('No Logueado');
            // Verificamos que se mostró el error (gracias a nuestra lógica en TestComponent)
            expect(document.getElementById('error-msg')).toHaveTextContent('Credenciales inválidas');
        });
    });

    test('Registro Exitoso: llama al API', async () => {
        apiClient.post.mockResolvedValue({ data: { success: true } });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith('/auth/register', { 
                nombre: 'Nombre', email: 'test@test.com', password: '123456' 
            });
        });
    });

    test('Logout: limpia token, estado y navega', async () => {
        // Preparamos un estado logueado
        localStorage.setItem('access_token', 'token-a-borrar');
        
        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        // Verificamos que arranca logueado
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logueado');

        // Ejecutamos Logout
        fireEvent.click(screen.getByText('Logout'));

        await waitFor(() => {
            // El token debe haber desaparecido del localStorage
            expect(localStorage.getItem('access_token')).toBeNull();
            // El estado debe ser No Logueado
            expect(screen.getByTestId('user-status')).toHaveTextContent('No Logueado');
            // Debe haber navegado al login
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});