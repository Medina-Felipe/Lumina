import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CreateRamoForm from '../components/Ramos/CreateRamoForm';
import apiClient from '../utils/apiClient';

// 1. Mock de AuthContext
const mockUseAuth = vi.fn();
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => mockUseAuth()
}));

// 2. Mock de apiClient
vi.mock('../utils/apiClient', () => ({
    default: {
        post: vi.fn()
    }
}));

// 3. Mock de Iconos
vi.mock('lucide-react', () => ({
    PlusCircle: () => <div data-testid="icon-plus" />,
    Loader2: () => <div data-testid="icon-loader" />
}));

describe('CreateRamoForm Component', () => {
    
    const mockOnRamoCreated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({ isLoggedIn: true });
    });

    test('Renderiza el formulario correctamente', () => {
        render(<CreateRamoForm onRamoCreated={mockOnRamoCreated} />);
        expect(screen.getByText('Nuevo Ramo')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre de la Asignatura/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByText('Crear Ramo')).toBeInTheDocument();
    });

    test('Muestra error si el usuario NO está logueado al intentar enviar', async () => {
        // 1. Simulamos usuario NO logueado
        mockUseAuth.mockReturnValue({ isLoggedIn: false });

        render(<CreateRamoForm onRamoCreated={mockOnRamoCreated} />);

        // --- CORRECCIÓN ---
        // Llenamos los campos para que pase la validación HTML "required" del navegador
        fireEvent.change(screen.getByLabelText(/Nombre de la Asignatura/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Test Desc' } });

        // Ahora sí clickeamos el botón. Como los campos tienen texto, el submit se dispara.
        fireEvent.click(screen.getByText('Crear Ramo'));

        // Esperamos el mensaje de error de lógica de negocio (Sesión)
        await waitFor(() => {
            expect(screen.getByText(/ERROR: Sesión expirada/i)).toBeInTheDocument();
        });

        // Verificamos que no se llamó a la API
        expect(apiClient.post).not.toHaveBeenCalled();
    });

    test('Valida que los campos no estén vacíos (lógica interna)', async () => {
        render(<CreateRamoForm onRamoCreated={mockOnRamoCreated} />);
        
        // Llenamos solo el título
        fireEvent.change(screen.getByLabelText(/Nombre de la Asignatura/i), { target: { value: 'Solo Título' } });
        
        // Forzamos submit
        const form = screen.getByLabelText(/Nombre de la Asignatura/i).closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText(/Completa todos los campos/i)).toBeInTheDocument();
        });
    });

    test('Crea un ramo exitosamente', async () => {
        apiClient.post.mockResolvedValue({ data: { success: true } });

        render(<CreateRamoForm onRamoCreated={mockOnRamoCreated} />);

        fireEvent.change(screen.getByLabelText(/Nombre de la Asignatura/i), { target: { value: 'Física I' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Introducción a la física' } });

        fireEvent.click(screen.getByText('Crear Ramo'));

        expect(screen.getByText(/Creando.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith('/ramos', expect.objectContaining({
                titulo: 'Física I',
                descripcion: 'Introducción a la física',
                estado: 'Activo'
            }));
            expect(screen.getByText(/¡Ramo creado exitosamente!/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Nombre de la Asignatura/i).value).toBe('');
            expect(mockOnRamoCreated).toHaveBeenCalled();
        });
    });

    test('Maneja error del servidor al crear ramo', async () => {
        apiClient.post.mockRejectedValue(new Error('Error de red'));

        render(<CreateRamoForm onRamoCreated={mockOnRamoCreated} />);

        fireEvent.change(screen.getByLabelText(/Nombre de la Asignatura/i), { target: { value: 'Mate' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Dificil' } });

        fireEvent.click(screen.getByText('Crear Ramo'));

        await waitFor(() => {
            expect(screen.getByText(/No se pudo crear el ramo/i)).toBeInTheDocument();
            expect(mockOnRamoCreated).not.toHaveBeenCalled();
        });
    });
});