# api/app/routes/hitos.py
from flask import Blueprint, jsonify, request
from .. import db
from ..models import Ramo, Hito, Tarea
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("hitos", __name__)

@bp.route("/<int:hito_id>", methods=["DELETE"])
@jwt_required()
def delete_hito(hito_id):
    current_user_id = int(get_jwt_identity())
    hito_a_borrar = Hito.query.join(Ramo).filter(
        Hito.id == hito_id,
        Ramo.usuario_id == current_user_id
    ).first_or_404(description="Hito no encontrado o no autorizado")
        
    db.session.delete(hito_a_borrar)
    db.session.commit()
    
    return jsonify({"mensaje": "Hito y sus tareas eliminadas"}), 200

@bp.route("/<int:hito_id>/tareas", methods=["POST"])
@jwt_required()
def create_tarea(hito_id):
    current_user_id = int(get_jwt_identity())
    hito_padre = Hito.query.join(Ramo).filter(
        Hito.id == hito_id,
        Ramo.usuario_id == current_user_id
    ).first_or_404(description="Hito no encontrado o no autorizado")
    
    data = request.json
    nueva_tarea = Tarea(
        titulo=data.get("titulo", "Nueva Tarea"),
        descripcion=data.get("descripcion"),
        hito_id=hito_padre.id 
    )
    
    db.session.add(nueva_tarea)
    db.session.commit()
    
    return jsonify(nueva_tarea.to_dict()), 201