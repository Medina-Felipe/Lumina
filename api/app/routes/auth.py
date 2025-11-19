# api/app/routes/auth.py

from flask import Blueprint, jsonify, request
from ..models import Usuario, db  # Importamos el modelo de Usuario y la instancia db
from .. import bcrypt            # Importamos bcrypt (que inicializamos en __init__.py)
from flask_jwt_extended import create_access_token # Para crear el token

# Creamos el blueprint para las rutas de autenticación
bp = Blueprint("auth", __name__)

@bp.route("/register", methods=["POST"])
def register_user():
    """Endpoint para registrar un nuevo usuario."""
    data = request.json
    email = data.get('email')
    password_plano = data.get('password')
    nombre = data.get('nombre')

    if not email or not password_plano:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"error": "El email ya está registrado"}), 409

    nuevo_usuario = Usuario(
        email=email,
        nombre=nombre
    )
    
    nuevo_usuario.set_password(password_plano)

    try:
        db.session.add(nuevo_usuario)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al registrar el usuario", "detalle": str(e)}), 500

    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201


@bp.route("/login", methods=["POST"])
def login_user():
    """Endpoint para iniciar sesión."""
    data = request.json
    email = data.get('email')
    password_plano = data.get('password')

    if not email or not password_plano:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_password(password_plano):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=usuario.id)
    
    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "access_token": access_token
    }), 200