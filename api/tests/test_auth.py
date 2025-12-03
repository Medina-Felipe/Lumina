# tests/test_auth.py
import pytest
from app import create_app, db
from app.models import Usuario


@pytest.fixture
def app():
    """Crea una aplicación Flask para testing."""
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


def test_register_user_success(client, app):
    """Prueba que un usuario se registra exitosamente."""
    response = client.post('/api/auth/register', json={
        'email': 'nuevo@test.com',
        'password': 'contraseña123',
        'nombre': 'Usuario Nuevo'
    })
    
    assert response.status_code == 201
    assert response.json['mensaje'] == 'Usuario registrado exitosamente'
    
    # Verificar que el usuario se guardó en la base de datos
    with app.app_context():
        usuario = Usuario.query.filter_by(email='nuevo@test.com').first()
        assert usuario is not None
        assert usuario.nombre == 'Usuario Nuevo'


def test_register_user_missing_fields(client):
    """Prueba que el registro falla sin email o contraseña."""
    response = client.post('/api/auth/register', json={
        'nombre': 'Usuario Sin Datos'
    })
    
    assert response.status_code == 400
    assert 'error' in response.json


def test_register_user_duplicate_email(client, app):
    """Prueba que no se puede registrar un usuario con email duplicado."""
    # Primero registramos un usuario
    client.post('/api/auth/register', json={
        'email': 'duplicado@test.com',
        'password': 'pass123',
        'nombre': 'Usuario 1'
    })
    
    # Intentamos registrar otro con el mismo email
    response = client.post('/api/auth/register', json={
        'email': 'duplicado@test.com',
        'password': 'pass456',
        'nombre': 'Usuario 2'
    })
    
    assert response.status_code == 400
    assert 'error' in response.json


def test_login_user_success(client, app):
    """Prueba que un usuario inicia sesión correctamente."""
    # Registramos un usuario primero
    client.post('/api/auth/register', json={
        'email': 'login@test.com',
        'password': 'contraseña123',
        'nombre': 'Test User'
    })
    
    # Intentamos iniciar sesión
    response = client.post('/api/auth/login', json={
        'email': 'login@test.com',
        'password': 'contraseña123'
    })
    
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert response.json['mensaje'] == 'Inicio de sesión exitoso'


def test_login_user_invalid_password(client):
    """Prueba que el login falla con contraseña incorrecta."""
    # Registramos un usuario
    client.post('/api/auth/register', json={
        'email': 'login@test.com',
        'password': 'contraseña_correcta',
        'nombre': 'Test'
    })
    
    # Intentamos login con contraseña incorrecta
    response = client.post('/api/auth/login', json={
        'email': 'login@test.com',
        'password': 'contraseña_incorrecta'
    })
    
    assert response.status_code == 401
    assert 'error' in response.json


def test_login_user_not_found(client):
    """Prueba que el login falla para un usuario inexistente."""
    response = client.post('/api/auth/login', json={
        'email': 'noexiste@test.com',
        'password': 'cualquier_password'
    })
    
    assert response.status_code == 401
    assert 'error' in response.json
