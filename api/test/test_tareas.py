# tests/test_tareas.py
import pytest
from app import create_app, db
from app.models import Usuario, Ramo, Hito, Tarea
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
def auth_token_with_tarea(app):
    """Crea usuario, ramo, hito, tarea y retorna token + ids."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Ramo', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        
        hito = Hito(titulo='Hito', ramo_id=ramo.id)
        db.session.add(hito)
        db.session.commit()
        
        tarea = Tarea(
            titulo='Tarea Original',
            descripcion='Descripción original',
            hito_id=hito.id,
            completada=False,
            tiempo_dedicado=60
        )
        db.session.add(tarea)
        db.session.commit()
        
        token = create_access_token(identity=str(usuario.id))
        return token, usuario.id, tarea.id


def test_update_tarea_authenticated(client, app, auth_token_with_tarea):
    """Prueba actualizar una tarea siendo usuario autenticado."""
    token, user_id, tarea_id = auth_token_with_tarea
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.put(f'/api/tareas/{tarea_id}',
        headers=headers,
        json={
            'titulo': 'Tarea Actualizada',
            'completada': True,
            'tiempo_dedicado': 120
        }
    )
    
    assert response.status_code == 200
    assert response.json['titulo'] == 'Tarea Actualizada'
    assert response.json['completada'] is True
    assert response.json['tiempo_dedicado'] == 120


def test_update_tarea_partial(client, app, auth_token_with_tarea):
    """Prueba actualizar solo algunos campos de una tarea."""
    token, user_id, tarea_id = auth_token_with_tarea
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.put(f'/api/tareas/{tarea_id}',
        headers=headers,
        json={
            'completada': True
        }
    )
    
    assert response.status_code == 200
    assert response.json['completada'] is True
    assert response.json['titulo'] == 'Tarea Original'  # No cambió


def test_delete_tarea_authenticated(client, app, auth_token_with_tarea):
    """Prueba eliminar una tarea siendo usuario autenticado."""
    token, user_id, tarea_id = auth_token_with_tarea
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.delete(f'/api/tareas/{tarea_id}', headers=headers)
    
    assert response.status_code == 200
    assert 'Tarea eliminada' in response.json['mensaje']
    
    # Verificar que fue eliminada
    with app.app_context():
        tarea = Tarea.query.filter_by(id=tarea_id).first()
        assert tarea is None


def test_delete_tarea_without_auth(client, app):
    """Prueba que no se puede eliminar tarea sin autenticación."""
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
        
        tarea = Tarea(titulo='Test', hito_id=hito.id)
        db.session.add(tarea)
        db.session.commit()
        tarea_id = tarea.id
    
    response = client.delete(f'/api/tareas/{tarea_id}')
    
    assert response.status_code == 401


def test_update_tarea_not_found(client, auth_token_with_tarea):
    """Prueba que no se puede actualizar una tarea que no existe."""
    token, _, _ = auth_token_with_tarea
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.put('/api/tareas/9999',
        headers=headers,
        json={'completada': True}
    )
    
    assert response.status_code == 404
