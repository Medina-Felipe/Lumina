import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import HomePage from '../pages/HomePage';
import { BrowserRouter } from 'react-router-dom';

// 1. Mocks de Componentes Hijos (Para aislar HomePage y no fallar por hijos complejos)
// Mockeamos RamoList y CreateRamoForm para que sean divs simples
vi.mock('../components/Ramos/RamoList.jsx', () => ({
    default: ({ ramos }) => <div data-testid="ramo-list">Lista de Ramos: {ramos.length}</div>
}));
vi.mock('../components/Ramos/CreateRamoForm.jsx', () => ({
    default: () => <div data-testid="create-form">Formulario</div>
}));

// 2. Mock de API Client y Servicio Externo
const mockGet = vi.fn();
vi.mock('../utils/apiClient', () => ({
    default: { get: (...args) => mockGet(...args) },
    ExternalService: { getQuote: vi.fn().mockResolvedValue("Frase del día") }
}));

// 3. Mock Auth y Navegación
vi.mock('../contexts/AuthContext.jsx', () => ({
    useAuth: () => ({ user: { name: 'Test User' }, logout: vi.fn() })
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => vi.fn() };
});

describe('HomePage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('Muestra mensaje cuando no hay ramos', async () => {
        // Simulamos respuesta vacía de la API
        mockGet.mockResolvedValue({ data: [] });

        render(<BrowserRouter><HomePage /></BrowserRouter>);

        // Esperamos a que desaparezca el loading y aparezca el texto de "No tienes ramos"
        await waitFor(() => {
            expect(screen.getByText(/No tienes ramos creados/i)).toBeInTheDocument();
        });
    });

    test('Muestra la lista de ramos cuando la API devuelve datos', async () => {
        // Simulamos datos reales
        const ramosMock = [{ id: 1, nombre: 'Matemáticas' }, { id: 2, nombre: 'Historia' }];
        mockGet.mockResolvedValue({ data: ramosMock });

        render(<BrowserRouter><HomePage /></BrowserRouter>);

        // Esperamos a que se renderice nuestro Mock de RamoList
        await waitFor(() => {
            expect(screen.getByTestId('ramo-list')).toHaveTextContent('Lista de Ramos: 2');
        });
    });

    test('Muestra error si la API falla', async () => {
        // Simulamos error del servidor
        mockGet.mockRejectedValue(new Error('Error de red'));

        render(<BrowserRouter><HomePage /></BrowserRouter>);

        // Buscamos el mensaje de error que definiste en tu componente
        await waitFor(() => {
            expect(screen.getByText(/Error al cargar tus asignaturas/i)).toBeInTheDocument();
        });
    });
});