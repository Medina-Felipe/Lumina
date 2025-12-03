# api/tests/unit/test_models_unit.py
"""
Tests UNITARIOS para modelos.
Prueban la lógica de negocio de los modelos SIN dependencias externas complejas.
Usan SQLite in-memory para aislar la DB.
"""
import pytest
from app import create_app, db
from app.models import Usuario, Ramo, Hito, Tarea


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


# =============================================================================
# TESTS UNITARIOS: MODELO USUARIO
# =============================================================================

class TestUsuarioUnit:
    """Tests unitarios para el modelo Usuario."""
    
    def test_set_password_no_guarda_texto_plano(self, app):
        """Verifica que set_password hashea la contraseña."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('mi_password_secreto')
            
            # El hash NO debe ser igual al texto plano
            assert usuario.password_hash != 'mi_password_secreto'
            # El hash debe existir y tener longitud
            assert len(usuario.password_hash) > 20
    
    def test_check_password_correcto(self, app):
        """Verifica que check_password retorna True con password correcto."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('password123')
            
            assert usuario.check_password('password123') is True
    
    def test_check_password_incorrecto(self, app):
        """Verifica que check_password retorna False con password incorrecto."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('password123')
            
            assert usuario.check_password('wrong_password') is False


# =============================================================================
# TESTS UNITARIOS: MODELO RAMO
# =============================================================================

class TestRamoUnit:
    """Tests unitarios para el modelo Ramo."""
    
    def test_ramo_progreso_sin_hitos_es_cero(self, app):
        """Un ramo sin hitos debe tener progreso 0."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            assert ramo.progreso == 0
    
    def test_ramo_progreso_promedio_hitos(self, app):
        """El progreso del ramo es el promedio de sus hitos."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            # Crear 2 hitos con tareas
            hito1 = Hito(titulo='Hito 1', ramo_id=ramo.id)
            hito2 = Hito(titulo='Hito 2', ramo_id=ramo.id)
            db.session.add_all([hito1, hito2])
            db.session.commit()
            
            # Hito1: 1 tarea completada = 100%
            tarea1 = Tarea(titulo='T1', hito_id=hito1.id, completada=True)
            # Hito2: 1 tarea no completada = 0%
            tarea2 = Tarea(titulo='T2', hito_id=hito2.id, completada=False)
            db.session.add_all([tarea1, tarea2])
            db.session.commit()
            
            # Promedio: (100 + 0) / 2 = 50
            assert ramo.progreso == 50.0
    
    def test_ramo_tiempo_total_suma_hitos(self, app):
        """El tiempo total del ramo suma el de todos sus hitos."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            tarea1 = Tarea(titulo='T1', hito_id=hito.id, tiempo_dedicado=30)
            tarea2 = Tarea(titulo='T2', hito_id=hito.id, tiempo_dedicado=45)
            db.session.add_all([tarea1, tarea2])
            db.session.commit()
            
            assert ramo.tiempo_total == 75
    
    def test_ramo_to_dict_campos_completos(self, app):
        """to_dict() debe incluir todos los campos del ramo."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(
                titulo='Mi Ramo',
                descripcion='Descripción',
                prioridad='Alta',
                estado='En Progreso',
                usuario_id=usuario.id
            )
            db.session.add(ramo)
            db.session.commit()
            
            resultado = ramo.to_dict()
            
            assert resultado['titulo'] == 'Mi Ramo'
            assert resultado['descripcion'] == 'Descripción'
            assert resultado['prioridad'] == 'Alta'
            assert resultado['estado'] == 'En Progreso'
            assert 'progreso' in resultado
            assert 'tiempo_total' in resultado
            assert 'hitos' in resultado


# =============================================================================
# TESTS UNITARIOS: MODELO HITO
# =============================================================================

class TestHitoUnit:
    """Tests unitarios para el modelo Hito."""
    
    def test_hito_progreso_sin_tareas_es_cero(self, app):
        """Un hito sin tareas debe tener progreso 0."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            assert hito.progreso == 0
    
    def test_hito_progreso_porcentaje_tareas(self, app):
        """El progreso es el % de tareas completadas."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            # 2 de 4 completadas = 50%
            tarea1 = Tarea(titulo='T1', hito_id=hito.id, completada=True)
            tarea2 = Tarea(titulo='T2', hito_id=hito.id, completada=True)
            tarea3 = Tarea(titulo='T3', hito_id=hito.id, completada=False)
            tarea4 = Tarea(titulo='T4', hito_id=hito.id, completada=False)
            db.session.add_all([tarea1, tarea2, tarea3, tarea4])
            db.session.commit()
            
            assert hito.progreso == 50.0
    
    def test_hito_tiempo_total_suma_tareas(self, app):
        """El tiempo total suma el de todas las tareas."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            tarea1 = Tarea(titulo='T1', hito_id=hito.id, tiempo_dedicado=10)
            tarea2 = Tarea(titulo='T2', hito_id=hito.id, tiempo_dedicado=20)
            tarea3 = Tarea(titulo='T3', hito_id=hito.id, tiempo_dedicado=30)
            db.session.add_all([tarea1, tarea2, tarea3])
            db.session.commit()
            
            assert hito.tiempo_total == 60
    
    def test_hito_to_dict_campos_completos(self, app):
        """to_dict() debe incluir todos los campos del hito."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(
                titulo='Mi Hito',
                descripcion='Desc',
                porcentaje_evaluacion=25.5,
                importancia=5,
                ramo_id=ramo.id
            )
            db.session.add(hito)
            db.session.commit()
            
            resultado = hito.to_dict()
            
            assert resultado['titulo'] == 'Mi Hito'
            assert resultado['descripcion'] == 'Desc'
            assert resultado['porcentaje_evaluacion'] == 25.5
            assert resultado['importancia'] == 5
            assert 'progreso' in resultado
            assert 'tiempo_total' in resultado
            assert 'tareas' in resultado


# =============================================================================
# TESTS UNITARIOS: MODELO TAREA
# =============================================================================

class TestTareaUnit:
    """Tests unitarios para el modelo Tarea."""
    
    def test_tarea_valores_default(self, app):
        """Una tarea nueva tiene valores por defecto correctos."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            tarea = Tarea(titulo='Nueva Tarea', hito_id=hito.id)
            db.session.add(tarea)
            db.session.commit()
            
            assert tarea.completada is False
            assert tarea.tiempo_dedicado == 0
    
    def test_tarea_to_dict_campos_completos(self, app):
        """to_dict() debe incluir todos los campos de la tarea."""
        with app.app_context():
            usuario = Usuario(email='test@test.com')
            usuario.set_password('pass')
            db.session.add(usuario)
            db.session.commit()
            
            ramo = Ramo(titulo='Test', usuario_id=usuario.id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='Hito', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            tarea = Tarea(
                titulo='Mi Tarea',
                descripcion='Hacer algo',
                completada=True,
                tiempo_dedicado=120,
                hito_id=hito.id
            )
            db.session.add(tarea)
            db.session.commit()
            
            resultado = tarea.to_dict()
            
            assert resultado['titulo'] == 'Mi Tarea'
            assert resultado['descripcion'] == 'Hacer algo'
            assert resultado['completada'] is True
            assert resultado['tiempo_dedicado'] == 120
            assert resultado['hito_id'] == hito.id

