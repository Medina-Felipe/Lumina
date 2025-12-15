import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/LoginPage'; // Ruta corregida
import { BrowserRouter } from 'react-router-dom';

// 1. Mock del Contexto
const mockLogin = vi.fn();

vi.mock('../contexts/AuthContext.jsx', () => ({
    useAuth: () => ({
        login: mockLogin,
        loading: false
    })
}));

// 2. Mock de la imagen
vi.mock('../image/luminaLogo.png', () => ({ default: 'logo-mock.png' }));

// 3. Mock de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('Se renderiza correctamente con los inputs', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        
        // CORREGIDO: Usamos los textos reales que vimos en tu error
        expect(screen.getByPlaceholderText(/Ingresa tu correo/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Escribe tu contraseña/i)).toBeInTheDocument();
    });

    test('Llama a la función login al enviar el formulario', async () => {
        mockLogin.mockResolvedValue({ success: true });

        render(<BrowserRouter><LoginPage /></BrowserRouter>);

        // CORREGIDO: Llenamos los inputs buscándolos por su texto real
        const emailInput = screen.getByPlaceholderText(/Ingresa tu correo/i);
        const passInput = screen.getByPlaceholderText(/Escribe tu contraseña/i);

        fireEvent.change(emailInput, { target: { value: 'admin@lumina.com' } });
        fireEvent.change(passInput, { target: { value: 'secret' } });

        const btn = screen.getByText('Continuar');
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin@lumina.com', 'secret');
        });
    });
});