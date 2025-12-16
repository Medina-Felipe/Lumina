# api/app/routes/tiempos.py
from flask import Blueprint, jsonify, request
from .. import db
from ..models import TimeSession, Ramo, Hito, Tarea
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func

bp = Blueprint("tiempos", __name__)

@bp.route("", methods=["POST"])
@jwt_required()
def create_time_session():
    """Registra una nueva sesión de tiempo/estudio."""
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validar que al menos venga el ramo
    if not data.get('ramoId'):
        return jsonify({"error": "El campo ramoId es obligatorio"}), 400
    
    # Verificar que el ramo pertenezca al usuario
    ramo = Ramo.query.filter_by(id=data['ramoId'], usuario_id=current_user_id).first()
    if not ramo:
        return jsonify({"error": "Ramo no encontrado o no autorizado"}), 404
    
    # Crear la sesión de tiempo
    nueva_sesion = TimeSession(
        duration=data.get('duration', 0),
        fecha=datetime.fromisoformat(data['fecha'].replace('Z', '+00:00')) if data.get('fecha') else datetime.utcnow(),
        usuario_id=current_user_id,
        ramo_id=data['ramoId'],
        hito_id=data.get('hitoId'),
        tarea_id=data.get('tareaId')
    )
    
    db.session.add(nueva_sesion)
    db.session.commit()
    
    return jsonify(nueva_sesion.to_dict()), 201

@bp.route("/estadisticas", methods=["GET"])
@jwt_required()
def get_estadisticas():
    """Devuelve estadísticas de tiempo agrupadas por día (últimos 7 días)."""
    current_user_id = get_jwt_identity()
    
    # Calcular fecha de hace 7 días
    hace_7_dias = datetime.utcnow() - timedelta(days=7)
    
    # Consulta agrupada por día
    resultados = db.session.query(
        func.date(TimeSession.fecha).label('fecha'),
        func.sum(TimeSession.duration).label('duration')
    ).filter(
        TimeSession.usuario_id == current_user_id,
        TimeSession.fecha >= hace_7_dias
    ).group_by(
        func.date(TimeSession.fecha)
    ).all()
    
    # Convertir a formato de respuesta
    estadisticas = [
        {
            'fecha': str(resultado.fecha),
            'duration': resultado.duration or 0
        }
        for resultado in resultados
    ]
    
    return jsonify(estadisticas)

@bp.route("/ramo/<int:ramo_id>", methods=["GET"])
@jwt_required()
def get_tiempo_por_ramo(ramo_id):
    """Devuelve el tiempo total dedicado a un ramo específico."""
    current_user_id = get_jwt_identity()
    
    # Verificar que el ramo pertenezca al usuario
    ramo = Ramo.query.filter_by(id=ramo_id, usuario_id=current_user_id).first()
    if not ramo:
        return jsonify({"error": "Ramo no encontrado o no autorizado"}), 404
    
    # Calcular tiempo total
    total = db.session.query(
        func.sum(TimeSession.duration)
    ).filter(
        TimeSession.usuario_id == current_user_id,
        TimeSession.ramo_id == ramo_id
    ).scalar()
    
    return jsonify({
        'ramoId': ramo_id,
        'totalSeconds': total or 0
    })
