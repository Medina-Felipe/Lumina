from flask import Flask
from flask_cors import CORS
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
    # (Ya no importamos graficos_bp)

    # Registramos los blueprints con sus prefijos correctos
    app.register_blueprint(ramos_bp, url_prefix="/api/ramos")
    app.register_blueprint(hitos_bp, url_prefix="/api/hitos")
    app.register_blueprint(tareas_bp, url_prefix="/api/tareas")
    # (Ya no registramos graficos_bp)

    return app