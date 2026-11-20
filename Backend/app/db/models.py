from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column


class Base(DeclarativeBase):
    pass


class Guia(Base):
    __tablename__ = "guias"

    id = mapped_column(Integer, primary_key=True)
    titulo = mapped_column(String)
    descripcion = mapped_column(String)


class Paso(Base):
    __tablename__ = "pasos"

    id = mapped_column(Integer, primary_key=True)
    guia_id = mapped_column(ForeignKey("guias.id"))
    orden = mapped_column(Integer)
    texto = mapped_column(String)
    imagen_url = mapped_column(String)


class Pregunta(Base):
    __tablename__ = "preguntas"

    id = mapped_column(Integer, primary_key=True)
    guia_id = mapped_column(ForeignKey("guias.id"))
    enunciado = mapped_column(String)
    opciones = mapped_column(String)
    opcion_correcta = mapped_column(String)
    explicacion = mapped_column(String)


class Intento(Base):
    __tablename__ = "intentos"

    id = mapped_column(Integer, primary_key=True)
    guia_id = mapped_column(ForeignKey("guias.id"))
    aciertos = mapped_column(Integer)
    total = mapped_column(Integer)
    creado_en = mapped_column(
        DateTime,
        default=datetime.utcnow
    )