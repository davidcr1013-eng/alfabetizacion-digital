"""Esquemas públicos de las guías (contrato T0).

Se separan de los modelos persistentes para controlar qué datos salen de la API.
"""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class _DesdeModelo(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class GuiaResumen(_DesdeModelo):
    id: int
    titulo: str
    descripcion: str


class Catalogo(BaseModel):
    guias: list[GuiaResumen]


class PasoGuia(_DesdeModelo):
    id: int
    orden: int
    texto: str
    imagen_url: str | None = None


class GuiaDetalle(GuiaResumen):
    pasos: list[PasoGuia]
