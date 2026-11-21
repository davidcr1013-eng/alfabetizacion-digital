"""Endpoints de la práctica (Persona 3).

- GET  /api/guias/{id}/preguntas: las tres preguntas sin la respuesta correcta.
- POST /api/guias/{id}/intentos: califica en el servidor, guarda y responde 201.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.db import repositorio
from app.db.database import obtener_sesion
from app.db.models import Pregunta as PreguntaModelo
from app.domain.evaluador import (
    Evaluador,
    Opcion,
    Pregunta,
    Respuesta,
    RespuestasInvalidas,
)
from app.schemas.practicas import (
    EnvioIntento,
    PreguntaPublica,
    PreguntasGuia,
    ResultadoIntento,
    RetroalimentacionPublica,
)

MENSAJE_404 = "La guía no existe."
MENSAJE_422 = "Revisa las tres respuestas de la práctica."
MENSAJE_500 = "No se pudo guardar el resultado. Inténtalo de nuevo."
PREGUNTAS_POR_GUIA = 3

router = APIRouter(prefix="/api/guias", tags=["practicas"])

Sesion = Annotated[Session, Depends(obtener_sesion)]
IdGuia = Annotated[int, Path(description="Identificador de la guía")]


def _a_dominio(modelo: PreguntaModelo) -> Pregunta:
    return Pregunta(
        id=modelo.id,
        enunciado=modelo.enunciado,
        opciones=tuple(Opcion(id=o["id"], texto=o["texto"]) for o in modelo.opciones),
        opcion_correcta=modelo.opcion_correcta,
        explicacion=modelo.explicacion,
    )


def _preguntas_de_la_guia(db: Session, guia_id: int) -> list[Pregunta]:
    """Devuelve las preguntas de una guía existente o responde 404."""
    if not repositorio.existe_guia(db, guia_id):
        raise HTTPException(status_code=404, detail=MENSAJE_404)
    preguntas = [_a_dominio(p) for p in repositorio.obtener_preguntas(db, guia_id)]
    if len(preguntas) != PREGUNTAS_POR_GUIA:
        # T0: la guía debe tener tres preguntas válidas; si no, es un error de datos.
        raise HTTPException(status_code=500, detail="La práctica de esta guía no está disponible.")
    return preguntas


@router.get("/{guia_id}/preguntas", response_model=PreguntasGuia)
def obtener_preguntas(guia_id: IdGuia, db: Sesion) -> PreguntasGuia:
    preguntas = _preguntas_de_la_guia(db, guia_id)
    return PreguntasGuia(
        guia_id=guia_id,
        preguntas=[
            PreguntaPublica(
                id=p.id,
                enunciado=p.enunciado,
                opciones=[{"id": o.id, "texto": o.texto} for o in p.opciones],
            )
            for p in preguntas
        ],
    )


@router.post(
    "/{guia_id}/intentos",
    response_model=ResultadoIntento,
    status_code=status.HTTP_201_CREATED,
)
def crear_intento(guia_id: IdGuia, envio: EnvioIntento, db: Sesion) -> ResultadoIntento:
    preguntas = _preguntas_de_la_guia(db, guia_id)

    respuestas = [Respuesta(r.pregunta_id, r.opcion_id) for r in envio.respuestas]
    try:
        resultado = Evaluador(preguntas).calificar(respuestas)
    except RespuestasInvalidas:
        raise HTTPException(status_code=422, detail=MENSAJE_422) from None

    try:
        intento = repositorio.guardar_intento(
            db, guia_id=guia_id, aciertos=resultado.aciertos, total=resultado.total
        )
    except repositorio.ErrorPersistencia:
        raise HTTPException(status_code=500, detail=MENSAJE_500) from None

    return ResultadoIntento(
        intento_id=intento.id,
        aciertos=resultado.aciertos,
        total=resultado.total,
        retroalimentacion=[
            RetroalimentacionPublica(
                pregunta_id=r.pregunta_id, correcta=r.correcta, explicacion=r.explicacion
            )
            for r in resultado.retroalimentacion
        ],
    )
