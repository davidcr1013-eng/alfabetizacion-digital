"""Pruebas del Evaluador (P3-04), sin base de datos ni servidor."""
from __future__ import annotations

import pytest

from app.domain.evaluador import (
    Evaluador,
    Opcion,
    Pregunta,
    Respuesta,
    RespuestasInvalidas,
)


def _pregunta(id_: int, correcta: str) -> Pregunta:
    return Pregunta(
        id=id_,
        enunciado=f"Pregunta {id_}",
        opciones=(Opcion("a", "A"), Opcion("b", "B"), Opcion("c", "C")),
        opcion_correcta=correcta,
        explicacion=f"Explicación {id_}",
    )


@pytest.fixture
def evaluador() -> Evaluador:
    # Mismas respuestas correctas que la guía 1 de backend/data/guias.json.
    return Evaluador([_pregunta(101, "a"), _pregunta(102, "b"), _pregunta(103, "b")])


def _respuestas(*pares: tuple[int, str]) -> list[Respuesta]:
    return [Respuesta(pregunta_id=p, opcion_id=o) for p, o in pares]


def test_todas_correctas(evaluador):
    resultado = evaluador.calificar(_respuestas((101, "a"), (102, "b"), (103, "b")))
    assert (resultado.aciertos, resultado.total) == (3, 3)
    assert all(item.correcta for item in resultado.retroalimentacion)


def test_todas_incorrectas(evaluador):
    resultado = evaluador.calificar(_respuestas((101, "c"), (102, "a"), (103, "c")))
    assert resultado.aciertos == 0
    assert not any(item.correcta for item in resultado.retroalimentacion)


def test_combinacion_como_el_ejemplo_de_t0(evaluador):
    # T0: 101 → a, 102 → b, 103 → a  da dos aciertos de tres.
    resultado = evaluador.calificar(_respuestas((101, "a"), (102, "b"), (103, "a")))
    assert (resultado.aciertos, resultado.total) == (2, 3)
    assert [item.correcta for item in resultado.retroalimentacion] == [True, True, False]
    assert resultado.retroalimentacion[2].explicacion == "Explicación 103"


def test_el_orden_de_envio_no_cambia_el_resultado(evaluador):
    resultado = evaluador.calificar(_respuestas((103, "b"), (101, "a"), (102, "b")))
    assert resultado.aciertos == 3
    assert [item.pregunta_id for item in resultado.retroalimentacion] == [101, 102, 103]


@pytest.mark.parametrize(
    "respuestas",
    [
        _respuestas((101, "a"), (102, "b")),  # falta una
        _respuestas((101, "a"), (102, "b"), (103, "b"), (101, "a")),  # sobra una
        _respuestas((101, "a"), (101, "b"), (102, "b")),  # repetida
        _respuestas((101, "a"), (102, "b"), (999, "a")),  # ajena a la guía
        _respuestas((101, "a"), (102, "b"), (103, "z")),  # opción inexistente
    ],
    ids=["falta", "sobra", "duplicada", "ajena", "opcion-invalida"],
)
def test_respuestas_invalidas(evaluador, respuestas):
    with pytest.raises(RespuestasInvalidas):
        evaluador.calificar(respuestas)


def test_pregunta_con_respuesta_correcta_que_no_es_opcion():
    with pytest.raises(ValueError):
        _pregunta(1, "d")
