# En este archivo definimos nuestras listas y funciones que simulan una base de datos real.

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

    # Creacion del primer ramo
    ramo1 = {
        "id": next_ramo_id,
        "titulo": "Proyecto de Aplicacion",
        "descripcion": "Ramo del profesor Oscar Aguayo, donde crearemos un proyecto",
        "prioridad": "Alta",
        "estado": "En Curso"
    }
    db_ramos.append(ramo1)
    next_ramo_id += 1

    # Creacion del primer hito para el ramo 1 que creamos anteriormente
    hito1 = {
        "id": next_hito_id,
        "titulo": "Hito 1 - Primera Evalucion Parcial",
        "descripcion": "Primera presentacion del proyecto.",
        "porcentaje_evaluacion": 30.0,
        "importancia": 1,
        "ramo_id": ramo1["id"]
    }
    db_hitos.append(hito1)
    next_hito_id += 1

    # Creacion de tareas para el hito 1 del ramo 1
    tarea1 = {
        "id": next_tarea_id,
        "titulo": "Desarrollar diagramas UML",
        "descripcion": "Hacer los diagramas de casos de uso y clases.",
        "completada": True,
        "tiempo_dedicado": 3600,
        "hito_id": hito1["id"]
    }
    db_tareas.append(tarea1)
    next_tarea_id += 1

    tarea2 = {
        "id": next_tarea_id,
        "titulo": "Hacer la presentacion en canva",
        "descripcion": "Crear las diapositivas para la presentacion del hito.",
        "completada": False,
        "tiempo_dedicado": 0,
        "hito_id": hito1["id"]
    }
    db_tareas.append(tarea2)
    next_tarea_id += 1

    #Creacion del segundo ramo
    ramo2 = {
        "id": next_ramo_id,
        "titulo": "Programacion Avanzada",
        "descripcion": "Ramo sobre Programacion.",
        "prioridad": "Media",
        "estado": "Pendiente"
    }
    db_ramos.append(ramo2)
    next_ramo_id += 1

    #Mensaje de confirmacion personalizado al iniciar el servidor

    print("**********************************************")
    print("Servidor iniciado. Datos de ejemplo cargados en memoria.")
    print("¡Recuerda! Los datos se borrarán al reiniciar el servidor.")
    print("**********************************************")