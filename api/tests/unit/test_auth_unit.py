# api/tests/unit/test_auth_unit.py
"""
Tests UNITARIOS para el módulo de autenticación.
Prueban validaciones y lógica de negocio aislada.
"""
import pytest
from app import create_app, db
from app.models import Usuario


@pytest.fixture
def app():
    """Crea app con DB in-memory para tests unitarios aislados."""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Cliente para hacer peticiones HTTP."""
    return app.test_client()


# =============================================================================
# TESTS UNITARIOS: VALIDACIONES DE AUTH
# =============================================================================

class TestAuthValidacionesUnit:
    """Tests unitarios para validaciones del módulo auth."""
    
    def test_registro_sin_email_retorna_400(self, client):
        """Validación: registro sin email debe fallar."""
        response = client.post('/api/auth/register',
            json={'password': 'test123'}
        )
        
        assert response.status_code == 400
        assert 'error' in response.json
    
    def test_registro_sin_password_retorna_400(self, client):
        """Validación: registro sin password debe fallar."""
        response = client.post('/api/auth/register',
            json={'email': 'test@test.com'}
        )
        
        assert response.status_code == 400
        assert 'error' in response.json
    
    def test_registro_datos_vacios_retorna_400(self, client):
        """Validación: registro con JSON vacío debe fallar."""
        response = client.post('/api/auth/register',
            json={}
        )
        
        assert response.status_code == 400
    
    def test_login_sin_datos_retorna_400(self, client):
        """Validación: login sin datos debe fallar."""
        response = client.post('/api/auth/login',
            json={}
        )
        
        assert response.status_code == 400
    
    def test_registro_exitoso_retorna_token(self, client):
        """Registro exitoso debe retornar token JWT."""
        response = client.post('/api/auth/register',
            json={
                'email': 'nuevo@test.com',
                'password': 'password123',
                'nombre': 'Test User'
            }
        )
        
        assert response.status_code == 201
        assert 'access_token' in response.json
        assert response.json['usuario']['email'] == 'nuevo@test.com'
    
    def test_login_exitoso_retorna_token(self, client, app):
        """Login exitoso debe retornar token JWT."""
        # Crear usuario primero
        with app.app_context():
            usuario = Usuario(email='login@test.com', nombre='Test')
            usuario.set_password('password123')
            db.session.add(usuario)
            db.session.commit()
        
        response = client.post('/api/auth/login',
            json={
                'email': 'login@test.com',
                'password': 'password123'
            }
        )
        
        assert response.status_code == 200
        assert 'access_token' in response.json
    
    def test_login_password_incorrecto_retorna_401(self, client, app):
        """Login con password incorrecto debe retornar 401."""
        with app.app_context():
            usuario = Usuario(email='user@test.com', nombre='Test')
            usuario.set_password('correctpassword')
            db.session.add(usuario)
            db.session.commit()
        
        response = client.post('/api/auth/login',
            json={
                'email': 'user@test.com',
                'password': 'wrongpassword'
            }
        )
        
        assert response.status_code == 401
    
    def test_registro_email_duplicado_retorna_400(self, client, app):
        """Registro con email duplicado debe fallar."""
        with app.app_context():
            usuario = Usuario(email='exists@test.com', nombre='Existing')
            usuario.set_password('pass123')
            db.session.add(usuario)
            db.session.commit()
        
        response = client.post('/api/auth/register',
            json={
                'email': 'exists@test.com',
                'password': 'newpassword'
            }
        )
        
        assert response.status_code == 400
        assert 'existe' in response.json['error'].lower()
