# api/app/__init__.py

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
from sqlalchemy import MetaData

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
    
    # CORS permisivo para evitar errores de conexión
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print("🐘 Usando PostgreSQL desde Docker")
    else:
        basedir = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, '../lumina.db')
        print("🗄️ Usando SQLite para desarrollo local")
        
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'mi-llave-secreta-para-lumina-proyecto' 

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # --- MANEJADORES DE ERRORES JWT (¡NUEVO!) ---
    # Esto nos dirá en la terminal por qué falla el token
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"\n❌ TOKEN INVÁLIDO: {error}\n")
        return jsonify({"error": "Token inválido", "detalle": error}), 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"\n❌ TOKEN FALTANTE: {error}\n")
        return jsonify({"error": "Falta el token de autorización", "detalle": error}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"\n❌ TOKEN EXPIRADO\n")
        return jsonify({"error": "El token ha expirado", "token_expired": True}), 401

    # --- Registro de Blueprints ---
    from .routes.ramos import bp as ramos_bp
    from .routes.hitos import bp as hitos_bp
    from .routes.tareas import bp as tareas_bp
    from .routes.auth import bp as auth_bp
    from .routes.tiempos import bp as tiempos_bp
    from .routes.external import bp as external_bp

    app.register_blueprint(ramos_bp, url_prefix="/api/ramos")
    app.register_blueprint(hitos_bp, url_prefix="/api/hitos")
    app.register_blueprint(tareas_bp, url_prefix="/api/tareas")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tiempos_bp, url_prefix="/api/tiempos")
    app.register_blueprint(external_bp, url_prefix="/api/external")

    with app.app_context():
        from . import models

    return app
