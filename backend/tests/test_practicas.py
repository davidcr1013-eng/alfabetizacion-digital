"""Pruebas de los endpoints de práctica (P3-02 y P3-04)."""
from __future__ import annotations

import uuid

import pytest
from sqlalchemy import func, select

from app.db import repositorio
from app.db.models import Intento

CORRECTAS_GUIA_1 = {101: "a", 102: "b", 103: "b"}


def _cuerpo(pares: dict[int, str] | list[tuple[int, str]]) -> dict:
    items = pares.items() if isinstance(pares, dict) else pares
    return {"respuestas": [{"pregunta_id": p, "opcion_id": o} for p, o in items]}


def _contar_intentos(fabrica_sesiones) -> int:
    with fabrica_sesiones() as db:
        return db.scalar(select(func.count()).select_from(Intento))


def test_preguntas_sin_respuesta_correcta(cliente):
    respuesta = cliente.get("/api/guias/1/preguntas")

    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["guia_id"] == 1
    assert [p["id"] for p in datos["preguntas"]] == [101, 102, 103]
    for pregunta in datos["preguntas"]:
        assert set(pregunta) == {"id", "enunciado", "opciones"}
        assert [o["id"] for o in pregunta["opciones"]] == ["a", "b", "c"]


def test_preguntas_de_guia_inexistente(cliente):
    respuesta = cliente.get("/api/guias/99/preguntas")
    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "La guía no existe."}


def test_intento_correcto_responde_201_y_queda_guardado(cliente, fabrica_sesiones):
    respuesta = cliente.post(
        "/api/guias/1/intentos", json=_cuerpo({101: "a", 102: "b", 103: "a"})
    )

    assert respuesta.status_code == 201
    datos = respuesta.json()
    assert (datos["aciertos"], datos["total"]) == (2, 3)
    assert [r["correcta"] for r in datos["retroalimentacion"]] == [True, True, False]
    assert all(r["explicacion"] for r in datos["retroalimentacion"])

    with fabrica_sesiones() as db:
        guardado = db.get(Intento, uuid.UUID(datos["intento_id"]))
        assert guardado is not None
        assert (guardado.guia_id, guardado.aciertos, guardado.total) == (1, 2, 3)


def test_todas_correctas(cliente):
    respuesta = cliente.post("/api/guias/1/intentos", json=_cuerpo(CORRECTAS_GUIA_1))
    assert respuesta.json()["aciertos"] == 3


@pytest.mark.parametrize(
    "cuerpo",
    [
        _cuerpo([(101, "a"), (102, "b")]),
        _cuerpo([(101, "a"), (101, "b"), (102, "b")]),
        _cuerpo([(101, "a"), (102, "b"), (201, "a")]),
        _cuerpo([(101, "a"), (102, "b"), (103, "z")]),
        {"respuestas": "no es una lista"},
        {},
    ],
    ids=["falta", "duplicada", "de-otra-guia", "opcion-invalida", "formato", "vacio"],
)
def test_respuestas_invalidas_dan_422_y_no_guardan(cliente, fabrica_sesiones, cuerpo):
    respuesta = cliente.post("/api/guias/1/intentos", json=cuerpo)

    assert respuesta.status_code == 422
    assert respuesta.json() == {"detail": "Revisa las tres respuestas de la práctica."}
    assert _contar_intentos(fabrica_sesiones) == 0


def test_intento_en_guia_inexistente(cliente, fabrica_sesiones):
    respuesta = cliente.post("/api/guias/99/intentos", json=_cuerpo(CORRECTAS_GUIA_1))
    assert respuesta.status_code == 404
    assert _contar_intentos(fabrica_sesiones) == 0


def test_falla_de_guardado_no_responde_201(cliente, monkeypatch):
    def _fallar(*_args, **_kwargs):
        raise repositorio.ErrorPersistencia("sin base de datos")

    monkeypatch.setattr(repositorio, "guardar_intento", _fallar)

    respuesta = cliente.post("/api/guias/1/intentos", json=_cuerpo(CORRECTAS_GUIA_1))

    assert respuesta.status_code == 500
    assert respuesta.json() == {
        "detail": "No se pudo guardar el resultado. Inténtalo de nuevo."
    }


def test_el_navegador_no_puede_enviar_su_propia_nota(cliente):
    cuerpo = _cuerpo({101: "c", 102: "c", 103: "c"})
    cuerpo["aciertos"] = 3  # campo extra: se ignora, la nota la calcula el servidor

    respuesta = cliente.post("/api/guias/1/intentos", json=cuerpo)

    assert respuesta.status_code == 201
    assert respuesta.json()["aciertos"] == 0
