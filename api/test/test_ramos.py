# tests/test_ramos.py
import pytest
from app import create_app, db
from app.models import Usuario, Ramo
from flask_jwt_extended import create_access_token


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


@pytest.fixture
def auth_token(app):
    """Crea un usuario y retorna su token de autenticación."""
    with app.app_context():
        usuario = Usuario(email='usuario@test.com', nombre='Test User')
        usuario.set_password('password123')
        db.session.add(usuario)
        db.session.commit()
        
        token = create_access_token(identity=str(usuario.id))
        return token, usuario.id


def test_get_ramos_authenticated(client, auth_token):
    """Prueba obtener los ramos del usuario autenticado."""
    token, user_id = auth_token
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/api/ramos/', headers=headers)
    
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_create_ramo_authenticated(client, app, auth_token):
    """Prueba crear un nuevo ramo siendo usuario autenticado."""
    token, user_id = auth_token
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.post('/api/ramos/', 
        headers=headers,
        json={
            'titulo': 'Programación Python',
            'descripcion': 'Curso de Python avanzado',
            'prioridad': 'Alta'
        }
    )
    
    assert response.status_code == 201
    assert response.json['titulo'] == 'Programación Python'
    assert response.json['prioridad'] == 'Alta'
    
    # Verificar que se guardó en la base de datos con el usuario correcto
    with app.app_context():
        ramo = Ramo.query.filter_by(titulo='Programación Python').first()
        assert ramo is not None
        assert ramo.usuario_id == user_id


def test_get_ramos_without_auth(client):
    """Prueba que no se puede obtener ramos sin autenticación."""
    response = client.get('/api/ramos/')
    
    assert response.status_code == 401


def test_create_ramo_without_auth(client):
    """Prueba que no se puede crear ramos sin autenticación."""
    response = client.post('/api/ramos/', 
        json={
            'titulo': 'Nuevo Ramo',
            'descripcion': 'Descripción',
            'prioridad': 'Media'
        }
    )
    
    assert response.status_code == 401


def test_delete_ramo_authenticated(client, app, auth_token):
    """Prueba eliminar un ramo siendo usuario autenticado."""
    token, user_id = auth_token
    
    # Primero, crear un ramo
    with app.app_context():
        ramo = Ramo(
            titulo='Ramo a Eliminar',
            usuario_id=user_id
        )
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    # Ahora eliminar el ramo
    headers = {'Authorization': f'Bearer {token}'}
    response = client.delete(f'/api/ramos/{ramo_id}', headers=headers)
    
    assert response.status_code == 200
    assert 'Ramo eliminado' in response.json['mensaje']
    
    # Verificar que fue eliminado
    with app.app_context():
        ramo = Ramo.query.filter_by(id=ramo_id).first()
        assert ramo is None
