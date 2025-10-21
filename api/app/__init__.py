# __init__.py
# Este archivo define la aplicación Flask y registra los "blueprints"
# (los grupos de rutas que separaremos en diferentes archivos).

from flask import Flask
from flask_cors import CORS

# Importamos nuestros módulos
from .fake_db import cargar_datos_iniciales

def create_app():
    """Crea y configura la aplicación Flask."""
    app = Flask(__name__)
    CORS(app)

    # Cargamos datos iniciales en memoria
    cargar_datos_iniciales()

    # Importamos y registramos los blueprints (rutas)
    from .routes.ramos import bp as ramos_bp
    from .routes.hitos import bp as hitos_bp
    from .routes.tareas import bp as tareas_bp
    from .routes.graficos import bp as graficos_bp

    app.register_blueprint(ramos_bp, url_prefix="/api/ramos")
    app.register_blueprint(hitos_bp, url_prefix="/api/hitos")
    app.register_blueprint(tareas_bp, url_prefix="/api/tareas")
    app.register_blueprint(graficos_bp, url_prefix="/api/graficos")

    return app