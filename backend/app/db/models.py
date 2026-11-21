"""Modelos persistentes: las cuatro tablas acordadas en T0.

Guia contiene sus Paso y sus Pregunta (composición): si se borra una guía,
se borran también sus pasos y preguntas.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# JSONB en PostgreSQL y JSON en otras bases (por ejemplo SQLite en las pruebas).
TipoJson = JSON().with_variant(JSONB(), "postgresql")


class Base(DeclarativeBase):
    pass


class Guia(Base):
    __tablename__ = "guias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    titulo: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)

    pasos: Mapped[list[Paso]] = relationship(
        back_populates="guia", order_by="Paso.orden", cascade="all, delete-orphan"
    )
    preguntas: Mapped[list[Pregunta]] = relationship(
        back_populates="guia", order_by="Pregunta.id", cascade="all, delete-orphan"
    )

    __table_args__ = (CheckConstraint("id > 0", name="ck_guias_id_positivo"),)


class Paso(Base):
    __tablename__ = "pasos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    guia_id: Mapped[int] = mapped_column(
        ForeignKey("guias.id", ondelete="CASCADE"), nullable=False
    )
    orden: Mapped[int] = mapped_column(Integer, nullable=False)
    texto: Mapped[str] = mapped_column(Text, nullable=False)
    imagen_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    guia: Mapped[Guia] = relationship(back_populates="pasos")

    __table_args__ = (
        UniqueConstraint("guia_id", "orden", name="uq_pasos_guia_orden"),
        CheckConstraint("orden > 0", name="ck_pasos_orden_positivo"),
    )


class Pregunta(Base):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=False)
    guia_id: Mapped[int] = mapped_column(
        ForeignKey("guias.id", ondelete="CASCADE"), nullable=False
    )
    enunciado: Mapped[str] = mapped_column(Text, nullable=False)
    # Lista de {"id": "a", "texto": "..."}
    opciones: Mapped[list[dict[str, str]]] = mapped_column(TipoJson, nullable=False)
    opcion_correcta: Mapped[str] = mapped_column(String(1), nullable=False)
    explicacion: Mapped[str] = mapped_column(Text, nullable=False)

    guia: Mapped[Guia] = relationship(back_populates="preguntas")

    __table_args__ = (
        CheckConstraint(
            "opcion_correcta IN ('a', 'b', 'c')", name="ck_preguntas_opcion_correcta"
        ),
    )


def _ahora() -> datetime:
    return datetime.now(timezone.utc)


class Intento(Base):
    """Resultado anónimo de una práctica: solo puntaje y fecha."""

    __tablename__ = "intentos"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    guia_id: Mapped[int] = mapped_column(ForeignKey("guias.id"), nullable=False)
    aciertos: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_ahora
    )

    __table_args__ = (
        CheckConstraint("total > 0", name="ck_intentos_total_positivo"),
        CheckConstraint(
            "aciertos >= 0 AND aciertos <= total", name="ck_intentos_aciertos_rango"
        ),
    )
