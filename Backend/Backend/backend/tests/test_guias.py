import json

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.guias import router, DATA_FILE

app = FastAPI()
app.include_router(router)
client = TestClient(app)


def test_listar_guias_devuelve_tres_guias():
    respuesta = client.get("/api/guias")

    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert len(datos) == 3
    assert all(
        {"id", "titulo", "descripcion"} <= set(guia)
        for guia in datos
    )


def test_obtener_guia_existente_y_pasos_ordenados():
    respuesta = client.get("/api/guias/1")

    assert respuesta.status_code == 200
    guia = respuesta.json()
    assert guia["id"] == 1
    assert 3 <= len(guia["pasos"]) <= 5

    ordenes = [paso["orden"] for paso in guia["pasos"]]
    assert ordenes == sorted(ordenes)


def test_guia_inexistente_devuelve_404():
    respuesta = client.get("/api/guias/99")

    assert respuesta.status_code == 404


def test_todas_las_guias_tienen_tres_preguntas():
    datos = json.loads(DATA_FILE.read_text(encoding="utf-8"))

    assert len(datos) == 3

    for guia in datos:
        assert 3 <= len(guia["pasos"]) <= 5
        assert len(guia["preguntas"]) == 3

        for pregunta in guia["preguntas"]:
            assert len(pregunta["opciones"]) == 3
            assert pregunta["opcion_correcta"] in ["A", "B", "C"]
            ids_opciones = [opcion["id"] for opcion in pregunta["opciones"]]
            assert pregunta["opcion_correcta"] in ids_opciones


def test_hay_nueve_preguntas_consecutivas():
    datos = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    preguntas = []

    for guia in datos:
        preguntas.extend(guia["preguntas"])

    ids = [pregunta["id"] for pregunta in preguntas]
    assert ids == list(range(1, 10))
