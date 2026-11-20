"""Preparación común de las pruebas.

Las pruebas usan SQLite en memoria para no necesitar PostgreSQL: cada prueba
recibe una base nueva y vacía. La prueba manual con PostgreSQL real está
descrita en el README (sección de persistencia).
"""
from __future__ import annotations

import os

# Debe definirse antes de importar la app, que lee DATABASE_URL al iniciar.
os.environ.setdefault("DATABASE_URL", "sqlite://")

from collections.abc import Generator  # noqa: E402

import pytest  # noqa: E402
from sqlalchemy import create_engine, event  # noqa: E402
from sqlalchemy.orm import Session, sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.db.models import Base  # noqa: E402


@pytest.fixture
def motor():
    motor = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    # SQLite no revisa las claves foráneas si no se le pide.
    @event.listens_for(motor, "connect")
    def _activar_claves_foraneas(conexion, _):
        conexion.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(motor)
    yield motor
    motor.dispose()


@pytest.fixture
def fabrica_sesiones(motor):
    return sessionmaker(bind=motor, autoflush=False, expire_on_commit=False)


@pytest.fixture
def db(fabrica_sesiones) -> Generator[Session, None, None]:
    with fabrica_sesiones() as sesion:
        yield sesion
