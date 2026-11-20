"""Carga repetible de backend/data/guias.json en PostgreSQL.

Crea o actualiza guías, pasos y preguntas sin duplicarlos y sin tocar la
tabla de intentos. Se ejecuta desde la carpeta backend:

    python -m scripts.cargar_datos
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Guia, Paso, Pregunta

RUTA_JSON_POR_DEFECTO = Path(__file__).resolve().parent.parent / "data" / "guias.json"


def _normalizar_opciones(opciones_raw: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Normaliza los identificadores de opción a minúsculas ('a', 'b', 'c') según T0."""
    normalizadas: list[dict[str, str]] = []
    for op in opciones_raw:
        normalizadas.append(
            {
                "id": str(op["id"]).strip().lower(),
                "texto": str(op["texto"]).strip(),
            }
        )
    return normalizadas


def _validar_estructura_guia(guia_data: dict[str, Any]) -> None:
    """Valida reglas básicas de conteo antes de insertar/actualizar."""
    pasos = guia_data.get("pasos", [])
    preguntas = guia_data.get("preguntas", [])

    if not (3 <= len(pasos) <= 5):
        raise ValueError(
            f"La guía {guia_data.get('id')} debe tener entre 3 y 5 pasos; tiene {len(pasos)}."
        )

    if len(preguntas) != 3:
        raise ValueError(
            f"La guía {guia_data.get('id')} debe tener exactamente 3 preguntas; tiene {len(preguntas)}."
        )


def _upsert_guia(db: Session, guia_data: dict[str, Any]) -> Guia:
    guia_id = int(guia_data["id"])
    guia = db.get(Guia, guia_id)

    if guia is None:
        guia = Guia(
            id=guia_id,
            titulo=str(guia_data["titulo"]).strip(),
            descripcion=str(guia_data["descripcion"]).strip(),
        )
        db.add(guia)
    else:
        guia.titulo = str(guia_data["titulo"]).strip()
        guia.descripcion = str(guia_data["descripcion"]).strip()

    # Asegura que el padre exista antes de insertar/actualizar hijos con FK
    db.flush()
    return guia


def _upsert_pasos(db: Session, guia_id: int, pasos_data: list[dict[str, Any]]) -> None:
    ordenes_vistos: set[int] = set()

    for paso_data in pasos_data:
        paso_id = int(paso_data["id"])
        orden = int(paso_data["orden"])

        if orden <= 0 or orden in ordenes_vistos:
            raise ValueError(
                f"Orden inválido o repetido ({orden}) en pasos de la guía {guia_id}."
            )
        ordenes_vistos.add(orden)

        paso = db.get(Paso, paso_id)
        if paso is None:
            # Si existiera un paso distinto con el mismo (guia_id, orden), lo reutilizamos/actualizamos
            paso = db.scalars(
                select(Paso).where(Paso.guia_id == guia_id, Paso.orden == orden)
            ).one_or_none()

        texto = str(paso_data["texto"]).strip()
        imagen_url = paso_data.get("imagen_url")
        imagen_url_limpia = str(imagen_url).strip() if imagen_url else None

        if paso is None:
            paso = Paso(
                id=paso_id,
                guia_id=guia_id,
                orden=orden,
                texto=texto,
                imagen_url=imagen_url_limpia,
            )
            db.add(paso)
        else:
            paso.guia_id = guia_id
            paso.orden = orden
            paso.texto = texto
            paso.imagen_url = imagen_url_limpia


def _upsert_preguntas(
    db: Session, guia_id: int, preguntas_data: list[dict[str, Any]]
) -> None:
    for preg_data in preguntas_data:
        pregunta_id = int(preg_data["id"])
        opciones = _normalizar_opciones(preg_data.get("opciones", []))
        opcion_correcta = str(preg_data["opcion_correcta"]).strip().lower()

        ids_opciones = {op["id"] for op in opciones}
        if len(opciones) != 3 or opcion_correcta not in ids_opciones:
            raise ValueError(
                f"Pregunta {pregunta_id} en guía {guia_id} no tiene 3 opciones válidas o respuesta coincidente."
            )

        pregunta = db.get(Pregunta, pregunta_id)
        enunciado = str(preg_data["enunciado"]).strip()
        explicacion = str(preg_data["explicacion"]).strip()

        if pregunta is None:
            pregunta = Pregunta(
                id=pregunta_id,
                guia_id=guia_id,
                enunciado=enunciado,
                opciones=opciones,
                opcion_correcta=opcion_correcta,
                explicacion=explicacion,
            )
            db.add(pregunta)
        else:
            pregunta.guia_id = guia_id
            pregunta.enunciado = enunciado
            pregunta.opciones = opciones
            pregunta.opcion_correcta = opcion_correcta
            pregunta.explicacion = explicacion


def leer_guias(ruta_json: Path = RUTA_JSON_POR_DEFECTO) -> list[dict[str, Any]]:
    if not ruta_json.exists():
        raise FileNotFoundError(f"No se encontró el archivo de datos: {ruta_json}")

    with ruta_json.open("r", encoding="utf-8") as archivo:
        contenido = json.load(archivo)

    if not isinstance(contenido, list):
        raise ValueError("El archivo guias.json debe contener una lista de guías.")
    return contenido


def cargar_datos(db: Session, guias: list[dict[str, Any]]) -> None:
    """Inserta o actualiza las guías en una sola transacción."""
    try:
        for guia_data in guias:
            _validar_estructura_guia(guia_data)
            guia = _upsert_guia(db, guia_data)
            _upsert_pasos(db, guia.id, guia_data.get("pasos", []))
            _upsert_preguntas(db, guia.id, guia_data.get("preguntas", []))
        db.commit()
    except Exception:
        db.rollback()
        raise


def main() -> None:
    from app.db.database import SessionLocal

    guias = leer_guias()
    with SessionLocal() as db:
        cargar_datos(db, guias)
    print(f"Carga completada: {len(guias)} guías desde {RUTA_JSON_POR_DEFECTO}")


if __name__ == "__main__":
    main()
