# api/tests/unit/test_routes_unit.py
"""
Tests UNITARIOS para las rutas/endpoints.
Prueban validaciones y respuestas HTTP sin lógica compleja.
"""
import pytest
from app import create_app, db
from app.models import Usuario, Ramo, Hito, Tarea
from flask_jwt_extended import create_access_token


@pytest.fixture
def app():
    """Crea app con DB in-memory."""
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
    return app.test_client()


@pytest.fixture
def auth_header(app):
    """Crea usuario y retorna header de auth."""
    with app.app_context():
        usuario = Usuario(email='test@test.com', nombre='Test')
        usuario.set_password('pass123')
        db.session.add(usuario)
        db.session.commit()
        
        token = create_access_token(identity=str(usuario.id))
        return {'Authorization': f'Bearer {token}'}, usuario.id


# =============================================================================
# TESTS UNITARIOS: RUTAS DE RAMOS
# =============================================================================

class TestRamosRoutesUnit:
    """Tests unitarios para validaciones de rutas de ramos."""
    
    def test_get_ramos_sin_auth_retorna_401(self, client):
        """GET /ramos sin token debe retornar 401."""
        response = client.get('/api/ramos')
        assert response.status_code == 401
    
    def test_post_ramos_sin_auth_retorna_401(self, client):
        """POST /ramos sin token debe retornar 401."""
        response = client.post('/api/ramos', json={'titulo': 'Test'})
        assert response.status_code == 401
    
    def test_get_ramos_con_auth_retorna_lista(self, client, auth_header):
        """GET /ramos con auth debe retornar lista."""
        headers, _ = auth_header
        response = client.get('/api/ramos', headers=headers)
        
        assert response.status_code == 200
        assert isinstance(response.json, list)
    
    def test_crear_ramo_retorna_201(self, client, app, auth_header):
        """POST /ramos debe crear ramo y retornar 201."""
        headers, user_id = auth_header
        
        response = client.post('/api/ramos',
            headers=headers,
            json={'titulo': 'Nuevo Ramo', 'prioridad': 'Alta'}
        )
        
        assert response.status_code == 201
        assert response.json['titulo'] == 'Nuevo Ramo'
    
    def test_delete_ramo_inexistente_retorna_404(self, client, auth_header):
        """DELETE ramo que no existe debe retornar 404."""
        headers, _ = auth_header
        response = client.delete('/api/ramos/9999', headers=headers)
        
        assert response.status_code == 404


# =============================================================================
# TESTS UNITARIOS: RUTAS DE HITOS
# =============================================================================

class TestHitosRoutesUnit:
    """Tests unitarios para validaciones de rutas de hitos."""
    
    def test_delete_hito_sin_auth_retorna_401(self, client):
        """DELETE /hitos sin token debe retornar 401."""
        response = client.delete('/api/hitos/1')
        assert response.status_code == 401
    
    def test_crear_tarea_en_hito_sin_auth_retorna_401(self, client):
        """POST tarea sin token debe retornar 401."""
        response = client.post('/api/hitos/1/tareas', json={'titulo': 'Test'})
        assert response.status_code == 401
    
    def test_crear_hito_en_ramo(self, client, app, auth_header):
        """POST hito en ramo debe retornar 201."""
        headers, user_id = auth_header
        
        # Crear ramo primero
        with app.app_context():
            ramo = Ramo(titulo='Ramo', usuario_id=user_id)
            db.session.add(ramo)
            db.session.commit()
            ramo_id = ramo.id
        
        response = client.post(f'/api/ramos/{ramo_id}/hitos',
            headers=headers,
            json={'titulo': 'Nuevo Hito'}
        )
        
        assert response.status_code == 201
        assert response.json['titulo'] == 'Nuevo Hito'


# =============================================================================
# TESTS UNITARIOS: RUTAS DE TAREAS
# =============================================================================

class TestTareasRoutesUnit:
    """Tests unitarios para validaciones de rutas de tareas."""
    
    def test_update_tarea_sin_auth_retorna_401(self, client):
        """PUT /tareas sin token debe retornar 401."""
        response = client.put('/api/tareas/1', json={'completada': True})
        assert response.status_code == 401
    
    def test_delete_tarea_sin_auth_retorna_401(self, client):
        """DELETE /tareas sin token debe retornar 401."""
        response = client.delete('/api/tareas/1')
        assert response.status_code == 401
    
    def test_update_tarea_inexistente_retorna_404(self, client, auth_header):
        """PUT tarea que no existe debe retornar 404."""
        headers, _ = auth_header
        response = client.put('/api/tareas/9999',
            headers=headers,
            json={'completada': True}
        )
        
        assert response.status_code == 404
    
    def test_actualizar_tarea_completada(self, client, app, auth_header):
        """PUT /tareas debe actualizar el campo completada."""
        headers, user_id = auth_header
        
        with app.app_context():
            ramo = Ramo(titulo='R', usuario_id=user_id)
            db.session.add(ramo)
            db.session.commit()
            
            hito = Hito(titulo='H', ramo_id=ramo.id)
            db.session.add(hito)
            db.session.commit()
            
            tarea = Tarea(titulo='T', hito_id=hito.id, completada=False)
            db.session.add(tarea)
            db.session.commit()
            tarea_id = tarea.id
        
        response = client.put(f'/api/tareas/{tarea_id}',
            headers=headers,
            json={'completada': True}
        )
        
        assert response.status_code == 200
        assert response.json['completada'] is True
