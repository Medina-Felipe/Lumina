from flask import Blueprint, jsonify, request
from ..fake_db import db_hitos, db_tareas, next_hito_id, next_tarea_id

bp = Blueprint("hitos", __name__)

# --- RUTAS DE HITOS ---

@bp.route("/<int:hito_id>", methods=["DELETE"])
def delete_hito(hito_id):
    """
    Elimina un hito (y sus tareas en cascada).
    URL: DELETE /api/hitos/<id>
    """
    global db_hitos, db_tareas
    hito_a_borrar = next((h for h in db_hitos if h["id"] == hito_id), None)
    if not hito_a_borrar:
        return jsonify({"error": "Hito no encontrado"}), 404

    # Borrado en cascada
    db_tareas[:] = [t for t in db_tareas if t["hito_id"] != hito_id]
    db_hitos.remove(hito_a_borrar)
    return jsonify({"mensaje": "Hito y sus tareas eliminadas"}), 200

# --- RUTAS DE HIJOS (Tareas) ---

@bp.route("/<int:hito_id>/tareas", methods=["POST"])
def create_tarea(hito_id):
    """
    (MOVIDO DESDE tareas.py)
    Crea una nueva tarea para un hito.
    URL: POST /api/hitos/<id>/tareas
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