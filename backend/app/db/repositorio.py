"""Acceso a datos que usan los routers.

La Persona 3 calcula el resultado; aquí solo se guarda. El intento se
confirma (commit) antes de devolverlo: si algo falla, se deshace todo y se
avisa con ErrorPersistencia, para que la API nunca responda 201 sin guardar.
"""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.db.models import Guia, Intento, Pregunta


class ErrorPersistencia(Exception):
    """No se pudo guardar en la base de datos."""


def listar_guias(db: Session) -> list[Guia]:
    return list(db.scalars(select(Guia).order_by(Guia.id)))


def obtener_guia_con_pasos(db: Session, guia_id: int) -> Guia | None:
    consulta = select(Guia).where(Guia.id == guia_id).options(selectinload(Guia.pasos))
    return db.scalars(consulta).one_or_none()


def existe_guia(db: Session, guia_id: int) -> bool:
    return db.get(Guia, guia_id) is not None


def obtener_preguntas(db: Session, guia_id: int) -> list[Pregunta]:
    consulta = select(Pregunta).where(Pregunta.guia_id == guia_id).order_by(Pregunta.id)
    return list(db.scalars(consulta))


def guardar_intento(db: Session, guia_id: int, aciertos: int, total: int) -> Intento:
    intento = Intento(guia_id=guia_id, aciertos=aciertos, total=total)
    try:
        db.add(intento)
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise ErrorPersistencia("No se pudo guardar el intento.") from error
    return intento
