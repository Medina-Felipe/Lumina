from flask import Blueprint, jsonify, request
from ..fake_db import db_tareas

bp = Blueprint("tareas", __name__)

@bp.route("/<int:tarea_id>", methods=["PUT"])
def update_tarea(tarea_id):
    """
    Actualiza una tarea.
    URL: PUT /api/tareas/<id>
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
    Elimina una tarea específica.
    URL: DELETE /api/tareas/<id>
    """
    global db_tareas
    tarea_a_borrar = next((t for t in db_tareas if t["id"] == tarea_id), None)
    if not tarea_a_borrar:
        return jsonify({"error": "Tarea no encontrada"}), 404

    db_tareas.remove(tarea_a_borrar)
    return jsonify({"mensaje": "Tarea eliminada"}), 200