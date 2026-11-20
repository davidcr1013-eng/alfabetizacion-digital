"""Configuración de la API leída desde variables de entorno.

Cada integrante crea `backend/.env` copiando `backend/.env.example` y pone
ahí sus propios valores. Ese archivo nunca se sube al repositorio.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

CARPETA_BACKEND = Path(__file__).resolve().parent.parent
ARCHIVO_ENV = CARPETA_BACKEND / ".env"


def _cargar_archivo_env(ruta: Path) -> None:
    """Lee líneas CLAVE=valor de un archivo .env sin pisar variables ya definidas."""
    if not ruta.exists():
        return
    for linea in ruta.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        os.environ.setdefault(clave.strip(), valor.strip().strip('"').strip("'"))


@dataclass(frozen=True)
class Configuracion:
    database_url: str
    frontend_origin: str


def obtener_configuracion() -> Configuracion:
    _cargar_archivo_env(ARCHIVO_ENV)
    return Configuracion(
        database_url=os.environ.get("DATABASE_URL", ""),
        frontend_origin=os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173"),
    )


configuracion = obtener_configuracion()
