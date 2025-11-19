# tests/test_models.py
import pytest
from app import create_app, db
from app.models import Usuario, Ramo, Hito, Tarea


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


def test_usuario_set_password(app):
    """Prueba que el hash de contraseña se guarda correctamente."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test User')
        usuario.set_password('contraseña123')
        
        assert usuario.password_hash is not None
        assert usuario.password_hash != 'contraseña123'  # No se guarda en texto plano


def test_usuario_check_password(app):
    """Prueba que la verificación de contraseña funciona correctamente."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test User')
        usuario.set_password('contraseña123')
        
        assert usuario.check_password('contraseña123') is True
        assert usuario.check_password('contraseña_incorrecta') is False


def test_ramo_to_dict(app):
    """Prueba la conversión de Ramo a diccionario."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(
            titulo='Matemáticas',
            descripcion='Cálculo Avanzado',
            prioridad='Alta',
            estado='Pendiente',
            usuario_id=usuario.id
        )
        db.session.add(ramo)
        db.session.commit()
        
        ramo_dict = ramo.to_dict()
        
        assert ramo_dict['titulo'] == 'Matemáticas'
        assert ramo_dict['descripcion'] == 'Cálculo Avanzado'
        assert ramo_dict['prioridad'] == 'Alta'
        assert 'progreso' in ramo_dict
        assert 'tiempo_total' in ramo_dict


def test_hito_to_dict(app):
    """Prueba la conversión de Hito a diccionario."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(
            titulo='Física',
            usuario_id=usuario.id
        )
        db.session.add(ramo)
        db.session.commit()
        
        hito = Hito(
            titulo='Primer Examen',
            descripcion='Examen de la primera unidad',
            ramo_id=ramo.id,
            importancia=5
        )
        db.session.add(hito)
        db.session.commit()
        
        hito_dict = hito.to_dict()
        
        assert hito_dict['titulo'] == 'Primer Examen'
        assert hito_dict['ramo_id'] == ramo.id
        assert 'progreso' in hito_dict


def test_tarea_to_dict(app):
    """Prueba la conversión de Tarea a diccionario."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        ramo = Ramo(titulo='Historia', usuario_id=usuario.id)
        db.session.add(ramo)
        db.session.commit()
        
        hito = Hito(titulo='Hito 1', ramo_id=ramo.id)
        db.session.add(hito)
        db.session.commit()
        
        tarea = Tarea(
            titulo='Leer Capítulo 3',
            descripcion='Leer el capítulo sobre la Revolución Francesa',
            hito_id=hito.id,
            completada=False,
            tiempo_dedicado=120
        )
        db.session.add(tarea)
        db.session.commit()
        
        tarea_dict = tarea.to_dict()
        
        assert tarea_dict['titulo'] == 'Leer Capítulo 3'
        assert tarea_dict['completada'] is False
        assert tarea_dict['tiempo_dedicado'] == 120
