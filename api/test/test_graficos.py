# tests/test_graficos.py
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
def ramo_with_hitos_and_tareas(app):
    """Crea usuario, ramo, hitos con tareas y retorna token + ramo_id."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        # Crear ramo
        ramo = Ramo(titulo='Ramo Gráficos', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        
        # Crear primer hito con tareas
        hito1 = Hito(titulo='Hito 1', ramo_id=ramo.id)
        db.session.add(hito1)
        db.session.commit()
        
        # Añadir tareas al hito 1 (2 completadas, 1 no)
        tarea1 = Tarea(titulo='Tarea 1', hito_id=hito1.id, completada=True, tiempo_dedicado=100)
        tarea2 = Tarea(titulo='Tarea 2', hito_id=hito1.id, completada=True, tiempo_dedicado=200)
        tarea3 = Tarea(titulo='Tarea 3', hito_id=hito1.id, completada=False, tiempo_dedicado=50)
        db.session.add_all([tarea1, tarea2, tarea3])
        db.session.commit()
        
        # Crear segundo hito con tareas
        hito2 = Hito(titulo='Hito 2', ramo_id=ramo.id)
        db.session.add(hito2)
        db.session.commit()
        
        # Añadir tareas al hito 2 (1 completada, 2 no)
        tarea4 = Tarea(titulo='Tarea 4', hito_id=hito2.id, completada=True, tiempo_dedicado=75)
        tarea5 = Tarea(titulo='Tarea 5', hito_id=hito2.id, completada=False, tiempo_dedicado=150)
        tarea6 = Tarea(titulo='Tarea 6', hito_id=hito2.id, completada=False, tiempo_dedicado=100)
        db.session.add_all([tarea4, tarea5, tarea6])
        db.session.commit()
        
        token = create_access_token(identity=str(usuario.id))
        return token, usuario.id, ramo.id


def test_grafico_tiempo_authenticated(client, ramo_with_hitos_and_tareas):
    """Prueba obtener gráfico de tiempo de un ramo autenticado."""
    token, user_id, ramo_id = ramo_with_hitos_and_tareas
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get(f'/api/ramos/{ramo_id}/grafico/tiempo', headers=headers)
    
    assert response.status_code == 200
    data = response.json
    
    # Verificar estructura
    assert 'labels' in data
    assert 'datasets' in data
    assert len(data['labels']) == 2  # Dos hitos
    assert len(data['datasets']) == 1
    
    # Verificar labels
    assert 'Hito 1' in data['labels']
    assert 'Hito 2' in data['labels']
    
    # Verificar que hay datos para cada hito
    # Hito 1: 100 + 200 + 50 = 350
    # Hito 2: 75 + 150 + 100 = 325
    assert data['datasets'][0]['data'] == [350, 325]


def test_grafico_progreso_authenticated(client, ramo_with_hitos_and_tareas):
    """Prueba obtener gráfico de progreso de un ramo autenticado."""
    token, user_id, ramo_id = ramo_with_hitos_and_tareas
    
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get(f'/api/ramos/{ramo_id}/grafico/progreso', headers=headers)
    
    assert response.status_code == 200
    data = response.json
    
    # Verificar estructura
    assert 'labels' in data
    assert 'datasets' in data
    assert len(data['labels']) == 2  # Dos hitos
    assert len(data['datasets']) == 1
    
    # Verificar labels
    assert 'Hito 1' in data['labels']
    assert 'Hito 2' in data['labels']
    
    # Verificar progreso calculado correctamente
    # Hito 1: 2/3 completadas = 66.67%
    # Hito 2: 1/3 completadas = 33.33%
    progreso = data['datasets'][0]['data']
    assert len(progreso) == 2
    assert round(progreso[0], 2) == 66.67  # Hito 1
    assert round(progreso[1], 2) == 33.33  # Hito 2


def test_grafico_tiempo_sin_hitos(client, app):
    """Prueba gráfico de tiempo de un ramo sin hitos."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        usuario_id = usuario.id
        
        ramo = Ramo(titulo='Ramo Vacío', usuario_id=usuario_id)
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    token = create_access_token(identity=str(usuario_id))
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get(f'/api/ramos/{ramo_id}/grafico/tiempo', headers=headers)
    
    assert response.status_code == 200
    data = response.json
    
    # Ramo sin hitos debe tener listas vacías
    assert data['labels'] == []
    assert data['datasets'][0]['data'] == []


def test_grafico_progreso_sin_hitos(client, app):
    """Prueba gráfico de progreso de un ramo sin hitos."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        usuario_id = usuario.id
        
        ramo = Ramo(titulo='Ramo Vacío', usuario_id=usuario_id)
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    token = create_access_token(identity=str(usuario_id))
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get(f'/api/ramos/{ramo_id}/grafico/progreso', headers=headers)
    
    assert response.status_code == 200
    data = response.json
    
    # Ramo sin hitos debe tener listas vacías
    assert data['labels'] == []
    assert data['datasets'][0]['data'] == []


def test_grafico_tiempo_sin_auth(client, app):
    """Prueba que no se puede acceder a gráfico sin autenticación."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Test', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    response = client.get(f'/api/ramos/{ramo_id}/grafico/tiempo')
    assert response.status_code == 401


def test_grafico_progreso_sin_auth(client, app):
    """Prueba que no se puede acceder a gráfico sin autenticación."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Test', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    response = client.get(f'/api/ramos/{ramo_id}/grafico/progreso')
    assert response.status_code == 401


def test_grafico_tiempo_ramo_no_encontrado(client, app):
    """Prueba que devuelve 404 si el ramo no existe."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        usuario_id = usuario.id
    
    token = create_access_token(identity=str(usuario_id))
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/api/ramos/9999/grafico/tiempo', headers=headers)
    
    assert response.status_code == 404


def test_grafico_progreso_ramo_no_encontrado(client, app):
    """Prueba que devuelve 404 si el ramo no existe."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        usuario_id = usuario.id
    
    token = create_access_token(identity=str(usuario_id))
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get('/api/ramos/9999/grafico/progreso', headers=headers)
    
    assert response.status_code == 404


def test_grafico_tiempo_acceso_denegado(client, app):
    """Prueba que no se puede acceder a gráfico de ramo de otro usuario."""
    with app.app_context():
        # Usuario 1
        usuario1 = Usuario(email='user1@test.com', nombre='User 1')
        usuario1.set_password('pass123')
        db.session.add(usuario1)
        db.session.commit()
        
        usuario1_id = usuario1.id
        
        # Usuario 2
        usuario2 = Usuario(email='user2@test.com', nombre='User 2')
        usuario2.set_password('pass123')
        db.session.add(usuario2)
        db.session.commit()
        
        usuario2_id = usuario2.id
        
        # Ramo de usuario 1
        ramo = Ramo(titulo='Ramo de User1', usuario_id=usuario1_id)
        db.session.add(ramo)
        db.session.commit()
        ramo_id = ramo.id
    
    # Usuario 2 intenta acceder al ramo de usuario 1
    token = create_access_token(identity=str(usuario2_id))
    headers = {'Authorization': f'Bearer {token}'}
    response = client.get(f'/api/ramos/{ramo_id}/grafico/tiempo', headers=headers)
    
    assert response.status_code == 404  # No debe verlo
