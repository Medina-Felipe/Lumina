Lumina 🌙
Este proyecto es una aplicación web de seguimiento de estudios y proyectos para estudiantes universitarios.

Instalación
Clonar repo: git clone https://github.com/Medina-Felipe/Lumina
Dirigirnos a la carpeta del BackEnd usando: cd api
Crear entorno: python -m venv .venv
Activar entorno: .venv\Script\activate
Instalar dependencias: pip install -r requirements.txt
//// Crear Base de Datos
Borrar la carpeta migrations
- Escribir en la ruta de apo
$env:FLASK_APP = "app.py"
- Inicializar 
flask db init
- Crear la receta (IMPORTANTE: Fíjate que diga "usuario", "ramo", etc. en la salida) 
flask db migrate -m "Inicializacion desde cero" 
 - Aplicar la receta (Crear las tablas) 
flask db upgrade

Ejecutar app.py


Verificar el inicio de Flask
Usar el comando: cd ..
Usar el comando: cd app
Usar el comando: npm install
Usar el comando: npm run dev
Entrar al link: http://localhost:5173/
