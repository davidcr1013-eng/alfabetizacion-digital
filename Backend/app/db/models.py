
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Guia(Base):
    __tablename__ = "guias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String, nullable=False)
    descripcion: Mapped[str] = mapped_column(String, nullable=False)


class Paso(Base):
    __tablename__ = "pasos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    guia_id: Mapped[int] = mapped_column(ForeignKey("guias.id"))
    orden: Mapped[int] = mapped_column(Integer, nullable=False)
    texto: Mapped[str] = mapped_column(String, nullable=False)
    imagen_url: Mapped[str | None] = mapped_column(String, nullable=True)


class Pregunta(Base):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    guia_id: Mapped[int] = mapped_column(ForeignKey("guias.id"))
    enunciado: Mapped[str] = mapped_column(String, nullable=False)
    opciones: Mapped[list] = mapped_column(JSON, nullable=False)
    opcion_correcta: Mapped[str] = mapped_column(String, nullable=False)
    explicacion: Mapped[str] = mapped_column(String, nullable=False)


class Intento(Base):
    __tablename__ = "intentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    guia_id: Mapped[int] = mapped_column(ForeignKey("guias.id"))
    aciertos: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
