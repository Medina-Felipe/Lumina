# tests/test_hitos.py
import pytest
from app import create_app, db
from app.models import Usuario, Ramo, Hito
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
def auth_token_and_ramo(app):
    """Crea un usuario, ramo y retorna token + datos."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Ramo Test', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        
        token = create_access_token(identity=str(usuario.id))
        return token, usuario.id, ramo.id


def test_delete_hito_authenticated(client, app, auth_token_and_ramo):
    """Prueba eliminar un hito siendo usuario autenticado."""
    token, user_id, ramo_id = auth_token_and_ramo
    
    # Crear un hito
    with app.app_context():
        hito = Hito(titulo='Hito Test', ramo_id=ramo_id)
        db.session.add(hito)
        db.session.commit()
        hito_id = hito.id
    
    # Eliminar el hito
    headers = {'Authorization': f'Bearer {token}'}
    response = client.delete(f'/api/hitos/{hito_id}', headers=headers)
    
    assert response.status_code == 200
    assert 'Hito y sus tareas eliminadas' in response.json['mensaje']
    
    # Verificar que fue eliminado
    with app.app_context():
        hito = Hito.query.filter_by(id=hito_id).first()
        assert hito is None


def test_create_tarea_in_hito(client, app, auth_token_and_ramo):
    """Prueba crear una tarea dentro de un hito."""
    token, user_id, ramo_id = auth_token_and_ramo
    
    # Crear un hito
    with app.app_context():
        hito = Hito(titulo='Hito para Tareas', ramo_id=ramo_id)
        db.session.add(hito)
        db.session.commit()
        hito_id = hito.id
    
    # Crear una tarea en el hito
    headers = {'Authorization': f'Bearer {token}'}
    response = client.post(f'/api/hitos/{hito_id}/tareas',
        headers=headers,
        json={
            'titulo': 'Nueva Tarea',
            'descripcion': 'Descripción de la tarea'
        }
    )
    
    assert response.status_code == 201
    assert response.json['titulo'] == 'Nueva Tarea'
    assert response.json['hito_id'] == hito_id


def test_delete_hito_without_auth(client, app):
    """Prueba que no se puede eliminar hito sin autenticación."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Test', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        
        hito = Hito(titulo='Test', ramo_id=ramo.id)
        db.session.add(hito)
        db.session.commit()
        hito_id = hito.id
    
    response = client.delete(f'/api/hitos/{hito_id}')
    
    assert response.status_code == 401


def test_delete_hito_not_found(client, auth_token_and_ramo):
    """Prueba que no se puede eliminar un hito que no existe."""
    token, _, _ = auth_token_and_ramo
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.delete('/api/hitos/9999', headers=headers)
    
    assert response.status_code == 404
