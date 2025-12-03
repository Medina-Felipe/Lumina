# api/app/routes/auth.py

from flask import Blueprint, request, jsonify
from .. import db, bcrypt
from ..models import Usuario
from flask_jwt_extended import create_access_token
from datetime import timedelta

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    
    # Validar datos
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Faltan datos (email o password)"}), 400

    # Verificar si existe
    if Usuario.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "El usuario ya existe"}), 400

    # Crear usuario
    nuevo_usuario = Usuario(
        email=data.get('email'),
        nombre=data.get('nombre', '')
    )
    nuevo_usuario.set_password(data.get('password'))

    try:
        db.session.add(nuevo_usuario)
        db.session.commit()

        # --- CORRECCIÓN AQUÍ ---
        # Convertimos el ID a string: str(nuevo_usuario.id)
        access_token = create_access_token(identity=str(nuevo_usuario.id), expires_delta=timedelta(days=7))
        
        return jsonify({
            "mensaje": "Usuario registrado exitosamente",
            "access_token": access_token,
            "usuario": {
                "email": nuevo_usuario.email,
                "nombre": nuevo_usuario.nombre
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error en registro: {e}")
        return jsonify({"error": "Error al registrar usuario"}), 500

@bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Faltan datos"}), 400

    usuario = Usuario.query.filter_by(email=data.get('email')).first()

    if usuario and usuario.check_password(data.get('password')):
        
        # --- CORRECCIÓN AQUÍ ---
        # Convertimos el ID a string: str(usuario.id)
        access_token = create_access_token(identity=str(usuario.id), expires_delta=timedelta(days=7))
        
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "access_token": access_token,
            "usuario": {
                "email": usuario.email,
                "nombre": usuario.nombre
            }
        }), 200
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401