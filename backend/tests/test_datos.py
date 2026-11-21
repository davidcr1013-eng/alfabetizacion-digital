"""Revisa que backend/data/guias.json cumpla los límites de T0.

No necesita base de datos: lee el archivo directamente.
"""
from __future__ import annotations

from scripts.cargar_datos import leer_guias

GUIAS = leer_guias()


def test_hay_tres_guias_con_ids_1_2_3():
    assert [guia["id"] for guia in GUIAS] == [1, 2, 3]


def test_cada_guia_tiene_entre_tres_y_cinco_pasos_ordenados():
    for guia in GUIAS:
        ordenes = [paso["orden"] for paso in guia["pasos"]]
        assert 3 <= len(ordenes) <= 5
        assert ordenes == list(range(1, len(ordenes) + 1))


def test_cada_guia_tiene_tres_preguntas_con_opciones_a_b_c():
    for guia in GUIAS:
        assert len(guia["preguntas"]) == 3
        for pregunta in guia["preguntas"]:
            assert [opcion["id"] for opcion in pregunta["opciones"]] == ["a", "b", "c"]
            assert pregunta["opcion_correcta"] in {"a", "b", "c"}
            assert pregunta["explicacion"].strip()


def test_identificadores_unicos_y_estables():
    pasos = [paso["id"] for guia in GUIAS for paso in guia["pasos"]]
    preguntas = [pregunta["id"] for guia in GUIAS for pregunta in guia["preguntas"]]
    assert len(pasos) == len(set(pasos))
    assert len(preguntas) == len(set(preguntas))
    # Convención de docs/acuerdos.md: paso = guía*10 + orden; pregunta = guía*100 + n.
    for guia in GUIAS:
        for paso in guia["pasos"]:
            assert paso["id"] == guia["id"] * 10 + paso["orden"]
        for numero, pregunta in enumerate(guia["preguntas"], start=1):
            assert pregunta["id"] == guia["id"] * 100 + numero


def test_titulos_dentro_del_limite_de_la_tabla():
    for guia in GUIAS:
        assert 0 < len(guia["titulo"]) <= 120
