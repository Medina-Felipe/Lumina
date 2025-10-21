from flask import Blueprint, jsonify, request
from ..fake_db import db_hitos, db_tareas, next_hito_id

bp = Blueprint("hitos", __name__)

@bp.route("/<int:ramo_id>/hitos", methods=["POST"])
def create_hito(ramo_id):
    """
    ENDPOINT para CREAR un nuevo hito para un ramo específico.
    El frontend llamará a 'POST http://localhost:5000/api/ramos/1/hitos'
    """
    global next_hito_id
    data = request.json

    nuevo_hito = {
        "id": next_hito_id,
        "titulo": data.get("titulo", "Nuevo Hito"),
        "descripcion": data.get("descripcion"),
        "importancia": data.get("importancia", 3),
        "porcentaje_evaluacion": data.get("porcentaje_evaluacion", 0),
        "ramo_id": ramo_id
    }
    db_hitos.append(nuevo_hito)
    next_hito_id += 1

    return jsonify(nuevo_hito), 201


@bp.route("/<int:hito_id>", methods=["DELETE"])
def delete_hito(hito_id):
    """
    ENDPOINT para BORRAR un hito (y sus tareas en cascada).
    El frontend llamará a 'DELETE http://localhost:5000/api/hitos/1'
    """
    global db_hitos, db_tareas

    hito_a_borrar = next((h for h in db_hitos if h["id"] == hito_id), None)
    if not hito_a_borrar:
        return jsonify({"error": "Hito no encontrado"}), 404

    # 1. Borrar Tareas de este Hito
    db_tareas[:] = [t for t in db_tareas if t["hito_id"] != hito_id]

    # 2. Borrar Hito
    db_hitos.remove(hito_a_borrar)

    return jsonify({"mensaje": "Hito y sus tareas eliminadas"}), 200
