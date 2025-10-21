# utils.py
# Funciones auxiliares que calculan progreso y tiempo, igual que antes.

from .fake_db import db_tareas

def calcular_progreso_hito(hito_id):
    """Calcula el progreso de un hito basado en sus tareas."""
    tareas_del_hito = [t for t in db_tareas if t["hito_id"] == hito_id]
    if not tareas_del_hito:
        return 0
    completadas = sum(1 for t in tareas_del_hito if t["completada"])
    return (completadas / len(tareas_del_hito)) * 100

def calcular_tiempo_hito(hito_id):
    """Calcula el tiempo total de un hito."""
    tareas_del_hito = [t for t in db_tareas if t["hito_id"] == hito_id]
    return sum(t["tiempo_dedicado"] for t in tareas_del_hito)