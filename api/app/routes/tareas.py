# api/app/routes/tareas.py
from flask import Blueprint, jsonify, request
from .. import db
from ..models import Ramo, Hito, Tarea
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("tareas", __name__)

@bp.route("/<int:tarea_id>", methods=["PUT"])
@jwt_required() # <-- Ruta protegida
def update_tarea(tarea_id):
    """Actualiza una tarea, verificando que pertenezca al usuario."""
    current_user_id = int(get_jwt_identity())
    tarea_a_actualizar = Tarea.query.join(Hito).join(Ramo).filter(
        Tarea.id == tarea_id,
        Ramo.usuario_id == current_user_id
    ).first_or_404(description="Tarea no encontrada o no autorizada")

    data = request.json
    if 'completada' in data:
        tarea_a_actualizar.completada = data['completada']
    if 'tiempo_dedicado' in data:
        tarea_a_actualizar.tiempo_dedicado = data['tiempo_dedicado']
    if 'titulo' in data:
        tarea_a_actualizar.titulo = data['titulo']
    if 'descripcion' in data:
        tarea_a_actualizar.descripcion = data['descripcion']

    db.session.commit()
    
    return jsonify(tarea_a_actualizar.to_dict())

@bp.route("/<int:tarea_id>", methods=["DELETE"])
@jwt_required() # <-- Ruta protegida
def delete_tarea(tarea_id):
    """Elimina una tarea, verificando que pertenezca al usuario."""
    current_user_id = int(get_jwt_identity())

    tarea_a_borrar = Tarea.query.join(Hito).join(Ramo).filter(
        Tarea.id == tarea_id,
        Ramo.usuario_id == current_user_id
    ).first_or_404(description="Tarea no encontrada o no autorizada")
        
    db.session.delete(tarea_a_borrar)
    db.session.commit()
    
    return jsonify({"mensaje": "Tarea eliminada"}), 200