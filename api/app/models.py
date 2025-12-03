## api/app/models.py
from . import db, bcrypt

class Usuario(db.Model):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    # email: unique=True asegura que no puedan registrarse dos usuarios con el mismo email
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False) # Guardará la contraseña encriptada
    nombre = db.Column(db.String(100), nullable=True)

    # Relación: Un usuario puede tener muchos ramos
    ramos = db.relationship('Ramo', back_populates='propietario', lazy=True, cascade='all, delete-orphan')

    # --- Métodos de Contraseña ---
    def set_password(self, password_plana):
        """Toma una contraseña en texto plano y la guarda hasheada."""
        self.password_hash = bcrypt.generate_password_hash(password_plana).decode('utf-8')
    
    def check_password(self, password_plana):
        """Verifica si la contraseña en texto plano coincide con el hash."""
        return bcrypt.check_password_hash(self.password_hash, password_plana)
    
class Ramo(db.Model):
    __tablename__ = 'ramo'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(250), nullable=True)
    prioridad = db.Column(db.String(50), default='Media')
    estado = db.Column(db.String(50), default='Pendiente')
    hitos = db.relationship('Hito', back_populates='ramo', lazy=True, cascade='all, delete-orphan')

    # --- ¡CAMBIO CLAVE EN LA BASE DE DATOS! ---
    # 1. Añadimos la columna para saber a qué usuario pertenece este Ramo.
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

    propietario = db.relationship('Usuario', back_populates='ramos')

    # --- Lógica de Cálculo (¡Nuevo!) ---
    # Esto reemplaza a utils.py
    @property
    def tiempo_total(self):
        """Calcula el tiempo total sumando el de sus hitos."""
        return sum(hito.tiempo_total for hito in self.hitos)

    @property
    def progreso(self):
        """Calcula el progreso promedio de sus hitos."""
        if not self.hitos:
            return 0
        return sum(hito.progreso for hito in self.hitos) / len(self.hitos)

    # --- Conversor a JSON (¡Nuevo!) ---
    def to_dict(self):
        """Convierte el objeto Ramo a un diccionario para la API."""
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'prioridad': self.prioridad,
            'estado': self.estado,
            'progreso': round(self.progreso, 2),        # Usa la propiedad calculada
            'tiempo_total': self.tiempo_total,  # Usa la propiedad calculada
            'hitos': [hito.to_dict() for hito in self.hitos] # Anida los hitos
        }

class Hito(db.Model):
    __tablename__ = 'hito'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(250), nullable=True)
    porcentaje_evaluacion = db.Column(db.Float, default=0)
    importancia = db.Column(db.Integer, default=3)
    ramo_id = db.Column(db.Integer, db.ForeignKey('ramo.id'), nullable=False)
    ramo = db.relationship('Ramo', back_populates='hitos')
    tareas = db.relationship('Tarea', back_populates='hito', lazy=True, cascade='all, delete-orphan')

    # --- Lógica de Cálculo (¡Nuevo!) ---
    @property
    def tiempo_total(self):
        """Calcula el tiempo total sumando el de sus tareas."""
        return sum(tarea.tiempo_dedicado for tarea in self.tareas)

    @property
    def progreso(self):
        """Calcula el % de tareas completadas."""
        if not self.tareas:
            return 0
        completadas = sum(1 for tarea in self.tareas if tarea.completada)
        return (completadas / len(self.tareas)) * 100

    # --- Conversor a JSON (¡Nuevo!) ---
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'porcentaje_evaluacion': self.porcentaje_evaluacion,
            'importancia': self.importancia,
            'ramo_id': self.ramo_id,
            'progreso': round(self.progreso, 2),
            'tiempo_total': self.tiempo_total,
            'tareas': [tarea.to_dict() for tarea in self.tareas]
        }

class Tarea(db.Model):
    __tablename__ = 'tarea'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.String(500), nullable=True)
    completada = db.Column(db.Boolean, default=False)
    tiempo_dedicado = db.Column(db.Integer, default=0)
    hito_id = db.Column(db.Integer, db.ForeignKey('hito.id'), nullable=False)
    hito = db.relationship('Hito', back_populates='tareas')

    # --- Conversor a JSON (¡Nuevo!) ---
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'completada': self.completada,
            'tiempo_dedicado': self.tiempo_dedicado,
            'hito_id': self.hito_id
        }