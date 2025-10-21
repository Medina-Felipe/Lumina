# app.py
# Este archivo arranca el servidor Flask.
# Solo se encarga de ejecutar la aplicación (no define rutas ni datos).

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
