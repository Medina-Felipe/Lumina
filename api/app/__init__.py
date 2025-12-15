from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
from sqlalchemy import MetaData

# Configuración de convención de nombres para la BD
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Configuración BD y JWT
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, '../lumina.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'mi-llave-secreta-para-lumina-proyecto')

    db_url = os.environ.get('DATABASE_URL')

    if db_url:
        # Si existe (estamos en Docker/Nube), usamos PostgreSQL
        # Corrección pequeña: SQLAlchemy a veces necesita 'postgresql://' en vez de 'postgres://'
        app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://", 1)
    else:
        # Si NO existe (estamos en tu PC local sin Docker), usamos SQLite
        basedir = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, '../lumina.db')
        
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Manejadores de errores JWT
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Token inválido", "detalle": error}), 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Falta el token de autorización", "detalle": error}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "El token ha expirado", "token_expired": True}), 401

    # --- REGISTRO DE BLUEPRINTS ---
    from .routes.ramos import bp as ramos_bp
    from .routes.hitos import bp as hitos_bp
    from .routes.tareas import bp as tareas_bp
    from .routes.auth import bp as auth_bp 
    # 1. IMPORTAR LA NUEVA RUTA EXTERNA
    from .routes.external import bp as external_bp

    app.register_blueprint(ramos_bp, url_prefix="/api/ramos")
    app.register_blueprint(hitos_bp, url_prefix="/api/hitos")
    app.register_blueprint(tareas_bp, url_prefix="/api/tareas")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    # 2. REGISTRAR LA NUEVA RUTA
    app.register_blueprint(external_bp, url_prefix="/api/external")

    with app.app_context():
        from . import models

    return app