from flask import Blueprint, jsonify
from ..fake_db import db_hitos
from ..utils import calcular_progreso_hito, calcular_tiempo_hito

bp = Blueprint("graficos", __name__)

@bp.route("/<int:ramo_id>/tiempo", methods=["GET"])
def get_grafico_tiempo(ramo_id):
    """
    Prepara datos para un gráfico de tiempo por hito.
    """
    hitos_del_ramo = [h for h in db_hitos if h["ramo_id"] == ramo_id]

    datos_para_grafico = {
        'labels': [h["titulo"] for h in hitos_del_ramo],
        'datasets': [{
            'label': 'Tiempo dedicado (en segundos)',
            'data': [calcular_tiempo_hito(h["id"]) for h in hitos_del_ramo]
        }]
    }
    return jsonify(datos_para_grafico)


@bp.route("/<int:ramo_id>/progreso", methods=["GET"])
def get_grafico_progreso(ramo_id):
    """
    Prepara datos para un gráfico de progreso por hito.
    """
    hitos_del_ramo = [h for h in db_hitos if h["ramo_id"] == ramo_id]

    datos_para_grafico = {
        'labels': [h["titulo"] for h in hitos_del_ramo],
        'datasets': [{
            'label': 'Progreso de Hitos (%)',
            'data': [round(calcular_progreso_hito(h["id"]), 2) for h in hitos_del_ramo]
        }]
    }
    return jsonify(datos_para_grafico)
