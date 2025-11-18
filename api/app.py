# api/app.py
# (Este es el "Corredor")

from app import create_app

# Le pedimos a la fábrica (en app/__init__.py) que nos dé la app
app = create_app()

# Ejecutamos el servidor
if __name__ == "__main__":
    app.run(debug=True, port=5000)