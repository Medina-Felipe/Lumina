from flask import Blueprint, jsonify, request
from ..fake_db import db_tareas, next_tarea_id

bp = Blueprint("tareas", __name__)

@bp.route("/<int:hito_id>/tareas", methods=["POST"])
def create_tarea(hito_id):
    """
    ENDPOINT para CREAR una nueva tarea para un hito.
    El frontend llamará a 'POST http://localhost:5000/api/hitos/1/tareas'
    """
    global next_tarea_id
    data = request.json

    nueva_tarea = {
        "id": next_tarea_id,
        "titulo": data.get("titulo", "Nueva Tarea"),
        "descripcion": data.get("descripcion"),
        "completada": False,
        "tiempo_dedicado": 0,
        "hito_id": hito_id
    }
    db_tareas.append(nueva_tarea)
    next_tarea_id += 1

    return jsonify(nueva_tarea), 201


@bp.route("/<int:tarea_id>", methods=["PUT"])
def update_tarea(tarea_id):
    """
    ENDPOINT para ACTUALIZAR una tarea.
    """
    tarea_a_actualizar = next((t for t in db_tareas if t["id"] == tarea_id), None)
    if not tarea_a_actualizar:
        return jsonify({"error": "Tarea no encontrada"}), 404

    data = request.json

    if 'completada' in data:
        tarea_a_actualizar['completada'] = data['completada']
    if 'tiempo_dedicado' in data:
        tarea_a_actualizar['tiempo_dedicado'] = data['tiempo_dedicado']
    if 'titulo' in data:
        tarea_a_actualizar['titulo'] = data['titulo']
    if 'descripcion' in data:
        tarea_a_actualizar['descripcion'] = data['descripcion']

    return jsonify(tarea_a_actualizar)


@bp.route("/<int:tarea_id>", methods=["DELETE"])
def delete_tarea(tarea_id):
    """
    ENDPOINT para BORRAR una tarea específica.
    """
    global db_tareas
    tarea_a_borrar = next((t for t in db_tareas if t["id"] == tarea_id), None)
    if not tarea_a_borrar:
        return jsonify({"error": "Tarea no encontrada"}), 404

    db_tareas.remove(tarea_a_borrar)
    return jsonify({"mensaje": "Tarea eliminada"}), 200