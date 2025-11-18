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
    # 1. Obtenemos los datos del frontend
    data = request.json
    email = data.get('email')
    password_plano = data.get('password') # Contraseña en texto plano
    nombre = data.get('nombre')

    # --- Verificaciones ---
    if not email or not password_plano:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    # 2. Verificamos si el usuario ya existe
    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"error": "El email ya está registrado"}), 409 # 409 = Conflicto

    # 3. Creamos la nueva instancia de Usuario
    nuevo_usuario = Usuario(
        email=email,
        nombre=nombre
    )
    
    # 4. Hasheamos la contraseña usando el método que creamos en models.py
    nuevo_usuario.set_password(password_plano)

    # 5. Guardamos en la base de datos
    try:
        db.session.add(nuevo_usuario)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al registrar el usuario", "detalle": str(e)}), 500

    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201 # 201 = Creado


@bp.route("/login", methods=["POST"])
def login_user():
    """Endpoint para iniciar sesión."""
    # 1. Obtenemos los datos
    data = request.json
    email = data.get('email')
    password_plano = data.get('password')

    if not email or not password_plano:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    # 2. Buscamos al usuario en la base de datos
    usuario = Usuario.query.filter_by(email=email).first()

    # 3. Verificamos si el usuario existe Y si la contraseña es correcta
    #    Usamos el método check_password() que creamos en models.py
    if not usuario or not usuario.check_password(password_plano):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401 # 401 = No autorizado

    # 4. ¡Éxito! Creamos un token de acceso (JWT)
    #    'identity=usuario.id' guarda el ID del usuario dentro del token.
    #    Así sabremos QUIÉN está haciendo peticiones más adelante.
    access_token = create_access_token(identity=usuario.id)
    
    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "access_token": access_token
    }), 200