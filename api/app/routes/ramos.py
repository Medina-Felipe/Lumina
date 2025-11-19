# api/app/routes/ramos.py
from flask import Blueprint, jsonify, request
from .. import db
from ..models import Ramo, Hito
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("ramos", __name__)

@bp.route("/", methods=["GET"])
@jwt_required()
def get_ramos():
    """Devuelve TODOS los ramos PERO solo del usuario que ha iniciado sesión."""
    current_user_id = int(get_jwt_identity())
    ramos = Ramo.query.filter_by(usuario_id=current_user_id).all()
    
    return jsonify([ramo.to_dict() for ramo in ramos])

@bp.route("/", methods=["POST"])
@jwt_required() # <-- Ruta protegida
def create_ramo():
    """Crea un nuevo ramo para el usuario actual."""
    current_user_id = int(get_jwt_identity())
    data = request.json
    
    nuevo_ramo = Ramo(
        titulo=data.get("titulo", "Ramo sin título"),
        descripcion=data.get("descripcion"),
        prioridad=data.get("prioridad", "Media"),
        estado="Pendiente",
        usuario_id=current_user_id
    )
    
    db.session.add(nuevo_ramo)
    db.session.commit()
    
    return jsonify(nuevo_ramo.to_dict()), 201

@bp.route("/<int:ramo_id>", methods=["DELETE"])
@jwt_required() # <-- Ruta protegida
def delete_ramo(ramo_id):
    """Elimina un ramo, verificando que pertenezca al usuario."""
    current_user_id = int(get_jwt_identity())
    ramo_a_borrar = Ramo.query.filter_by(id=ramo_id, usuario_id=current_user_id).first()
    
    if not ramo_a_borrar:
        return jsonify({"error": "Ramo no encontrado o no autorizado"}), 404
        
    db.session.delete(ramo_a_borrar)
    db.session.commit()
    
    return jsonify({"mensaje": "Ramo eliminado"}), 200

@bp.route("/<int:ramo_id>/hitos", methods=["POST"])
@jwt_required()
def create_hito(ramo_id):
    """Crea un hito, verificando que el ramo padre pertenezca al usuario."""
    current_user_id = int(get_jwt_identity())
    ramo_padre = Ramo.query.filter_by(id=ramo_id, usuario_id=current_user_id).first_or_404()
    
    data = request.json
    nuevo_hito = Hito(
        titulo=data.get("titulo", "Nuevo Hito"),
        descripcion=data.get("descripcion"),
        ramo_id=ramo_padre.id 
    )
    
    db.session.add(nuevo_hito)
    db.session.commit()
    
    return jsonify(nuevo_hito.to_dict()), 201

@bp.route("/<int:ramo_id>/grafico/tiempo", methods=["GET"])
@jwt_required()
def get_grafico_tiempo(ramo_id):
    current_user_id = int(get_jwt_identity())
    ramo = Ramo.query.filter_by(id=ramo_id, usuario_id=current_user_id).first_or_404()
    
    hitos_del_ramo = ramo.hitos
    datos_para_grafico = {
        'labels': [h.titulo for h in hitos_del_ramo],
        'datasets': [{'label': 'Tiempo dedicado (en segundos)', 'data': [h.tiempo_total for h in hitos_del_ramo]}]
    }
    return jsonify(datos_para_grafico)

@bp.route("/<int:ramo_id>/grafico/progreso", methods=["GET"])
@jwt_required()
def get_grafico_progreso(ramo_id):
    current_user_id = int(get_jwt_identity())
    ramo = Ramo.query.filter_by(id=ramo_id, usuario_id=current_user_id).first_or_404()
    
    hitos_del_ramo = ramo.hitos
    datos_para_grafico = {
        'labels': [h.titulo for h in hitos_del_ramo],
        'datasets': [{'label': 'Progreso de Hitos (%)', 'data': [round(h.progreso, 2) for h in hitos_del_ramo]}]
    }
    return jsonify(datos_para_grafico)