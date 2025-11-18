# api/app/__init__.py
# (Versión CORREGIDA v3: arregla NameError)

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt         # <-- ¡MOVIMOS ESTA LÍNEA AQUÍ!
from flask_jwt_extended import JWTManager # <-- ¡Y ESTA TAMBIÉN!
import os
from sqlalchemy import MetaData

# Definimos la "convención de nombres" para SQLAlchemy
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

# Creamos las instancias de las extensiones
metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()
bcrypt = Bcrypt()     # <-- Ahora Python sabe qué es 'Bcrypt'
jwt = JWTManager()    # <-- Ahora Python sabe qué es 'JWTManager'

def create_app():
    """Crea y configura la aplicación Flask."""
    app = Flask(__name__)
    CORS(app)

    # --- Configuración (igual que antes) ---
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, '../lumina.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'mi-llave-secreta-para-lumina-proyecto' 

    # --- Conectar Extensiones ---
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # --- Importar y Registrar Blueprints (Rutas) ---
    from .routes.ramos import bp as ramos_bp
    from .routes.hitos import bp as hitos_bp
    from .routes.tareas import bp as tareas_bp
    from .routes.auth import bp as auth_bp 

    app.register_blueprint(ramos_bp, url_prefix="/api/ramos")
    app.register_blueprint(hitos_bp, url_prefix="/api/hitos")
    app.register_blueprint(tareas_bp, url_prefix="/api/tareas")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Cargar los modelos
    with app.app_context():
        from . import models

    return app

# (Ya no necesitamos las importaciones aquí abajo)