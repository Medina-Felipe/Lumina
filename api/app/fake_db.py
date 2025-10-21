# fake_db.py
# Aquí definimos nuestras listas y funciones que simulan una base de datos real.

db_ramos = []
db_hitos = []
db_tareas = []

next_ramo_id = 1
next_hito_id = 1
next_tarea_id = 1

def cargar_datos_iniciales():
    """Carga datos iniciales en memoria para simular una base de datos."""

    global db_ramos, db_hitos, db_tareas
    global next_ramo_id, next_hito_id, next_tarea_id

    # --- Crear Ramo 1 ---
    ramo1 = {
        "id": next_ramo_id,
        "titulo": "Programación 1",
        "descripcion": "Ramo de primer año sobre Python.",
        "prioridad": "Alta",
        "estado": "En Curso"
    }
    db_ramos.append(ramo1)
    next_ramo_id += 1

    # --- Crear Hito 1 (para Ramo 1) ---
    hito1 = {
        "id": next_hito_id,
        "titulo": "Hito 1 - Evaluación Parcial",
        "descripcion": "Primera prueba del semestre",
        "porcentaje_evaluacion": 30.0,
        "importancia": 1,
        "ramo_id": ramo1["id"]
    }
    db_hitos.append(hito1)
    next_hito_id += 1

    # --- Crear Tareas (para Hito 1) ---
    tarea1 = {
        "id": next_tarea_id,
        "titulo": "Estudiar materia semana 1-4",
        "descripcion": "Ver videos y leer apuntes.",
        "completada": True,
        "tiempo_dedicado": 3600,
        "hito_id": hito1["id"]
    }
    db_tareas.append(tarea1)
    next_tarea_id += 1

    tarea2 = {
        "id": next_tarea_id,
        "titulo": "Hacer guía de ejercicios",
        "descripcion": "Ejercicios 1 al 10.",
        "completada": False,
        "tiempo_dedicado": 0,
        "hito_id": hito1["id"]
    }
    db_tareas.append(tarea2)
    next_tarea_id += 1

    # --- Crear Ramo 2 ---
    ramo2 = {
        "id": next_ramo_id,
        "titulo": "Base de Datos",
        "descripcion": "Ramo sobre modelo relacional y SQL.",
        "prioridad": "Media",
        "estado": "Pendiente"
    }
    db_ramos.append(ramo2)
    next_ramo_id += 1

    print("**********************************************")
    print("Servidor iniciado. Datos de ejemplo cargados en memoria.")
    print("¡Recuerda! Los datos se borrarán al reiniciar el servidor.")
    print("**********************************************")