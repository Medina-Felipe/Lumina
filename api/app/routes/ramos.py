from flask import Blueprint, jsonify, request
from ..fake_db import db_ramos, db_hitos, db_tareas, next_ramo_id
from ..utils import calcular_progreso_hito, calcular_tiempo_hito

bp = Blueprint("ramos", __name__)

@bp.route("/", methods=["GET"])
def get_ramos():
    """Devuelve todos los ramos con sus hitos y tareas anidadas."""
    ramos_completos = []
    for ramo in db_ramos:
        ramo_dict = ramo.copy()
        hitos_del_ramo = []
        hitos_en_db_para_este_ramo = [h for h in db_hitos if h["ramo_id"] == ramo["id"]]
        for hito in hitos_en_db_para_este_ramo:
            hito_dict = hito.copy()
            tareas_del_hito = [t.copy() for t in db_tareas if t["hito_id"] == hito["id"]]
            hito_dict["tareas"] = tareas_del_hito
            hito_dict["progreso"] = calcular_progreso_hito(hito["id"])
            hito_dict["tiempo_total"] = calcular_tiempo_hito(hito["id"])
            hitos_del_ramo.append(hito_dict)
        ramo_dict["hitos"] = hitos_del_ramo
        if hitos_del_ramo:
            ramo_dict["progreso"] = sum(h["progreso"] for h in hitos_del_ramo) / len(hitos_del_ramo)
            ramo_dict["tiempo_total"] = sum(h["tiempo_total"] for h in hitos_del_ramo)
        else:
            ramo_dict["progreso"] = 0
            ramo_dict["tiempo_total"] = 0
        ramos_completos.append(ramo_dict)
    return jsonify(ramos_completos)

@bp.route("/", methods=["POST"])
def create_ramo():
    """Crea un nuevo ramo."""
    global next_ramo_id
    data = request.json
    nuevo_ramo = {
        "id": next_ramo_id,
        "titulo": data.get("titulo", "Ramo sin título"),
        "descripcion": data.get("descripcion"),
        "prioridad": data.get("prioridad", "Media"),
        "estado": "Pendiente",
    }
    db_ramos.append(nuevo_ramo)
    next_ramo_id += 1
    return jsonify(nuevo_ramo), 201

@bp.route("/<int:ramo_id>", methods=["DELETE"])
def delete_ramo(ramo_id):
    """Elimina un ramo y todo su contenido (hitos y tareas asociadas)."""
    global db_ramos, db_hitos, db_tareas
    ramo_a_borrar = next((r for r in db_ramos if r["id"] == ramo_id), None)
    if not ramo_a_borrar:
        return jsonify({"error": "Ramo no encontrado"}), 404
    hitos_del_ramo_ids = [h["id"] for h in db_hitos if h["ramo_id"] == ramo_id]
    db_tareas[:] = [t for t in db_tareas if t["hito_id"] not in hitos_del_ramo_ids]
    db_hitos[:] = [h for h in db_hitos if h["ramo_id"] != ramo_id]
    db_ramos.remove(ramo_a_borrar)
    return jsonify({"mensaje": "Ramo eliminado"}), 200
