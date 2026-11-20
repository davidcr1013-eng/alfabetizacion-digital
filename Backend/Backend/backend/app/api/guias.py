"""
Consultas de las guías educativas.

Esta versión inicial lee backend/data/guias.json para permitir que la Persona 2
pruebe su módulo de forma independiente. Para la integración final, coordinar
con la Persona 4 el uso de sus modelos SQLAlchemy y la sesión PostgreSQL.
"""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from app.schemas.guias import GuiaDetalle, GuiaResumen

router = APIRouter(prefix="/api/guias", tags=["guias"])

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "guias.json"


def cargar_guias():
    """Carga las guías almacenadas en el archivo JSON."""
    with DATA_FILE.open("r", encoding="utf-8") as archivo:
        return json.load(archivo)


@router.get("", response_model=list[GuiaResumen])
def listar_guias():
    """Devuelve el id, título y descripción de las tres guías."""
    guias = cargar_guias()
    return [
        {
            "id": guia["id"],
            "titulo": guia["titulo"],
            "descripcion": guia["descripcion"]
        }
        for guia in guias
    ]


@router.get("/{guia_id}", response_model=GuiaDetalle)
def obtener_guia(guia_id: int):
    """Devuelve una guía y sus pasos ordenados. Si no existe, responde 404."""
    guias = cargar_guias()

    for guia in guias:
        if guia["id"] == guia_id:
            guia_ordenada = dict(guia)
            guia_ordenada["pasos"] = sorted(
                guia["pasos"],
                key=lambda paso: paso["orden"]
            )
            return guia_ordenada

    raise HTTPException(
        status_code=404,
        detail="La guía solicitada no existe."
    )
