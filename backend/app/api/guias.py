"""Consultas de las guías educativas (Persona 2).

Basado en la primera versión de la Persona 2, que leía el JSON directamente.
Ahora consulta PostgreSQL con la sesión y los modelos de la Persona 4.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from app.db import repositorio
from app.db.database import obtener_sesion
from app.schemas.guias import Catalogo, GuiaDetalle, GuiaResumen

MENSAJE_404 = "La guía no existe."

router = APIRouter(prefix="/api/guias", tags=["guias"])

Sesion = Annotated[Session, Depends(obtener_sesion)]
IdGuia = Annotated[int, Path(description="Identificador de la guía")]


@router.get("", response_model=Catalogo)
def listar_guias(db: Sesion) -> Catalogo:
    """Devuelve id, título y descripción de cada guía dentro de {"guias": [...]}."""
    guias = repositorio.listar_guias(db)
    return Catalogo(guias=[GuiaResumen.model_validate(guia) for guia in guias])


@router.get("/{guia_id}", response_model=GuiaDetalle)
def obtener_guia(guia_id: IdGuia, db: Sesion) -> GuiaDetalle:
    """Devuelve una guía con sus pasos ordenados por `orden`; 404 si no existe."""
    guia = repositorio.obtener_guia_con_pasos(db, guia_id)
    if guia is None:
        raise HTTPException(status_code=404, detail=MENSAJE_404)
    return GuiaDetalle.model_validate(guia)
