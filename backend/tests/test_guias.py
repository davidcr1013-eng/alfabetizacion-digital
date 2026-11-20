"""Pruebas del router de guías (basadas en las de la Persona 2)."""
from __future__ import annotations

from sqlalchemy import func, select

from app.db.models import Guia, Paso, Pregunta
from scripts.cargar_datos import cargar_datos, leer_guias


def test_catalogo_devuelve_objeto_con_guias(cliente):
    respuesta = cliente.get("/api/guias")

    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert list(datos) == ["guias"]
    assert len(datos["guias"]) == 3
    for guia in datos["guias"]:
        assert set(guia) == {"id", "titulo", "descripcion"}


def test_detalle_con_pasos_ordenados(cliente):
    respuesta = cliente.get("/api/guias/1")

    assert respuesta.status_code == 200
    guia = respuesta.json()
    assert guia["id"] == 1
    assert guia["titulo"] == "Conectarse a Wi-Fi"
    ordenes = [paso["orden"] for paso in guia["pasos"]]
    assert ordenes == sorted(ordenes)
    for paso in guia["pasos"]:
        assert set(paso) == {"id", "orden", "texto", "imagen_url"}


def test_guia_inexistente_devuelve_404_con_detail(cliente):
    respuesta = cliente.get("/api/guias/99")

    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "La guía no existe."}


def test_id_no_numerico_devuelve_422_con_texto(cliente):
    respuesta = cliente.get("/api/guias/abc")

    assert respuesta.status_code == 422
    assert isinstance(respuesta.json()["detail"], str)


def test_catalogo_vacio(fabrica_sesiones, db):
    from fastapi.testclient import TestClient

    from app.db.database import obtener_sesion
    from app.main import app

    def _sesion():
        with fabrica_sesiones() as sesion:
            yield sesion

    app.dependency_overrides[obtener_sesion] = _sesion
    try:
        respuesta = TestClient(app).get("/api/guias")
    finally:
        app.dependency_overrides.clear()
    assert respuesta.json() == {"guias": []}


def test_carga_repetida_no_duplica(datos_cargados):
    db = datos_cargados
    cargar_datos(db, leer_guias())

    assert db.scalar(select(func.count()).select_from(Guia)) == 3
    assert db.scalar(select(func.count()).select_from(Paso)) == 15
    assert db.scalar(select(func.count()).select_from(Pregunta)) == 9
