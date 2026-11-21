"""Dominio de la práctica: Pregunta, Respuesta, Evaluador y su resultado.

No depende de FastAPI ni de la base de datos, así que la calificación se
puede probar sin pantalla ni servidor (criterio de cierre de P3-01).

Responsabilidades:
- Pregunta: conoce sus opciones y cuál es la correcta; sabe decir si una
  opción existe y si es la correcta.
- Evaluador: recibe las respuestas de la persona, las valida contra las
  preguntas de la guía y produce un ResultadoEvaluacion.
- ResultadoEvaluacion: aciertos, total y retroalimentación por pregunta.
  La Persona 4 lo guarda como un Intento (app.db.models.Intento).
"""
from __future__ import annotations

from collections.abc import Iterable, Sequence
from dataclasses import dataclass


class RespuestasInvalidas(ValueError):
    """Faltan respuestas, sobran, se repiten o no pertenecen a la guía."""


@dataclass(frozen=True)
class Opcion:
    id: str
    texto: str


@dataclass(frozen=True)
class Pregunta:
    id: int
    enunciado: str
    opciones: tuple[Opcion, ...]
    opcion_correcta: str
    explicacion: str

    def __post_init__(self) -> None:
        ids = [opcion.id for opcion in self.opciones]
        if len(ids) != 3 or len(set(ids)) != 3:
            raise ValueError(f"La pregunta {self.id} debe tener tres opciones distintas.")
        if self.opcion_correcta not in ids:
            raise ValueError(f"La respuesta correcta de la pregunta {self.id} no es una opción.")

    def tiene_opcion(self, opcion_id: str) -> bool:
        return any(opcion.id == opcion_id for opcion in self.opciones)

    def es_correcta(self, opcion_id: str) -> bool:
        return opcion_id == self.opcion_correcta


@dataclass(frozen=True)
class Respuesta:
    pregunta_id: int
    opcion_id: str


@dataclass(frozen=True)
class Retroalimentacion:
    pregunta_id: int
    correcta: bool
    explicacion: str


@dataclass(frozen=True)
class ResultadoEvaluacion:
    aciertos: int
    total: int
    retroalimentacion: tuple[Retroalimentacion, ...]


class Evaluador:
    """Califica las respuestas de una guía usando solo los datos del servidor."""

    def __init__(self, preguntas: Sequence[Pregunta]) -> None:
        if not preguntas:
            raise ValueError("Una evaluación necesita al menos una pregunta.")
        self._preguntas = {pregunta.id: pregunta for pregunta in preguntas}
        self._orden = [pregunta.id for pregunta in preguntas]

    def calificar(self, respuestas: Iterable[Respuesta]) -> ResultadoEvaluacion:
        elegidas = self._validar(list(respuestas))

        retroalimentacion = tuple(
            Retroalimentacion(
                pregunta_id=pregunta_id,
                correcta=self._preguntas[pregunta_id].es_correcta(elegidas[pregunta_id]),
                explicacion=self._preguntas[pregunta_id].explicacion,
            )
            for pregunta_id in self._orden
        )
        aciertos = sum(1 for item in retroalimentacion if item.correcta)
        return ResultadoEvaluacion(
            aciertos=aciertos, total=len(self._orden), retroalimentacion=retroalimentacion
        )

    def _validar(self, respuestas: list[Respuesta]) -> dict[int, str]:
        """Devuelve {pregunta_id: opcion_id} o lanza RespuestasInvalidas."""
        if len(respuestas) != len(self._orden):
            raise RespuestasInvalidas("Debe haber una respuesta por cada pregunta.")

        elegidas: dict[int, str] = {}
        for respuesta in respuestas:
            pregunta = self._preguntas.get(respuesta.pregunta_id)
            if pregunta is None:
                raise RespuestasInvalidas("Una respuesta no pertenece a esta guía.")
            if respuesta.pregunta_id in elegidas:
                raise RespuestasInvalidas("Hay una pregunta respondida dos veces.")
            if not pregunta.tiene_opcion(respuesta.opcion_id):
                raise RespuestasInvalidas("Una opción elegida no existe en su pregunta.")
            elegidas[respuesta.pregunta_id] = respuesta.opcion_id
        return elegidas
