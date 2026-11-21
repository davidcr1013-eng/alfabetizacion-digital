"""Esquemas públicos de la práctica (contrato T0).

PreguntaPublica no incluye opcion_correcta ni explicacion: esos datos solo
salen después de calificar, dentro de la retroalimentación.
"""
from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class OpcionPublica(BaseModel):
    id: str
    texto: str


class PreguntaPublica(BaseModel):
    id: int
    enunciado: str
    opciones: list[OpcionPublica]


class PreguntasGuia(BaseModel):
    guia_id: int
    preguntas: list[PreguntaPublica]


class RespuestaEnviada(BaseModel):
    pregunta_id: int = Field(gt=0)
    opcion_id: str = Field(min_length=1, max_length=1)


class EnvioIntento(BaseModel):
    respuestas: list[RespuestaEnviada]


class RetroalimentacionPublica(BaseModel):
    pregunta_id: int
    correcta: bool
    explicacion: str


class ResultadoIntento(BaseModel):
    intento_id: UUID
    aciertos: int
    total: int
    retroalimentacion: list[RetroalimentacionPublica]
