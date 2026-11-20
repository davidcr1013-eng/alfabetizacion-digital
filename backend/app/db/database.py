"""Conexión a PostgreSQL y sesión de base de datos para cada petición."""
from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import configuracion

if not configuracion.database_url:
    raise RuntimeError(
        "Falta DATABASE_URL. Copia backend/.env.example como backend/.env "
        "y escribe la dirección de tu PostgreSQL."
    )

engine = create_engine(configuracion.database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def obtener_sesion() -> Generator[Session, None, None]:
    """Dependencia de FastAPI: abre una sesión por petición y la cierra al terminar."""
    sesion = SessionLocal()
    try:
        yield sesion
    finally:
        sesion.close()
