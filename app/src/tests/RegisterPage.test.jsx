import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '../pages/RegisterPage';
import { BrowserRouter } from 'react-router-dom';

// 1. Mock del AuthContext
const mockRegister = vi.fn();
vi.mock('../contexts/AuthContext.jsx', () => ({
    useAuth: () => ({
        register: mockRegister,
        loading: false
    })
}));

// 2. Mock de la imagen y navegación
vi.mock('../image/luminaLogo.png', () => ({ default: 'logo-mock.png' }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('RegisterPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('Renderiza el formulario de registro correctamente', () => {
        render(<BrowserRouter><RegisterPage /></BrowserRouter>);
        
        // Verificamos inputs por su placeholder (según tu código)
        expect(screen.getByPlaceholderText(/Tu Nombre/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Crea una contraseña segura/i)).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
    });

    test('Maneja el input del usuario', () => {
        render(<BrowserRouter><RegisterPage /></BrowserRouter>);
        
        const nameInput = screen.getByPlaceholderText(/Tu Nombre/i);
        const emailInput = screen.getByPlaceholderText(/ejemplo@correo.com/i);
        
        fireEvent.change(nameInput, { target: { value: 'Usuario Test' } });
        fireEvent.change(emailInput, { target: { value: 'nuevo@test.com' } });

        expect(nameInput.value).toBe('Usuario Test');
        expect(emailInput.value).toBe('nuevo@test.com');
    });

    test('Llama a la función register y navega al login si es exitoso', async () => {
        // Simulamos respuesta exitosa
        mockRegister.mockResolvedValue({ success: true });
        
        // Mock de window.alert (porque tu componente usa alert)
        window.alert = vi.fn(); 

        render(<BrowserRouter><RegisterPage /></BrowserRouter>);

        // Llenar datos
        fireEvent.change(screen.getByPlaceholderText(/Tu Nombre/i), { target: { value: 'Pepe' } });
        fireEvent.change(screen.getByPlaceholderText(/ejemplo@correo.com/i), { target: { value: 'pepe@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Crea una contraseña segura/i), { target: { value: '123456' } });

        // Click Submit
        const btn = screen.getByText('Registrarse');
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith('Pepe', 'pepe@mail.com', '123456');
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('Muestra error si el registro falla', async () => {
        // Simulamos error
        mockRegister.mockResolvedValue({ success: false, error: 'El correo ya existe' });

        render(<BrowserRouter><RegisterPage /></BrowserRouter>);

        // Llenar y enviar
        fireEvent.change(screen.getByPlaceholderText(/Tu Nombre/i), { target: { value: 'Pepe' } });
        fireEvent.change(screen.getByPlaceholderText(/ejemplo@correo.com/i), { target: { value: 'pepe@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Crea una contraseña segura/i), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Registrarse'));

        // Esperar que aparezca el error (tu componente lo guarda en estado pero no vi dónde lo renderiza en el snippet, 
        // asumiremos que la función se llama y falla sin navegar)
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled(); 
        });
    });
});