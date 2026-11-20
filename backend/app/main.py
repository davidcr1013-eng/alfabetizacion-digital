"""Aplicación FastAPI: configuración general, CORS y formato de errores."""
from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api import guias
from app.config import configuracion

logger = logging.getLogger("alfabetizacion")

MENSAJE_422 = "Revisa los datos enviados."
MENSAJE_500 = "Ocurrió un error inesperado. Inténtalo de nuevo."

app = FastAPI(title="Alfabetización Digital API")

# El navegador solo deja que el frontend llame a la API si su origen está permitido.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[configuracion.frontend_origin],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ===== Errores normalizados a {"detail": "texto"} (acuerdo T0) =====

@app.exception_handler(StarletteHTTPException)
async def manejar_http(_: Request, error: StarletteHTTPException) -> JSONResponse:
    detalle = error.detail if isinstance(error.detail, str) else MENSAJE_500
    return JSONResponse(status_code=error.status_code, content={"detail": detalle})


MENSAJE_422_PRACTICA = "Revisa las tres respuestas de la práctica."


@app.exception_handler(RequestValidationError)
async def manejar_validacion(request: Request, _: RequestValidationError) -> JSONResponse:
    # FastAPI devuelve una lista técnica de errores; T0 pide un texto comprensible.
    if request.url.path.endswith("/intentos"):
        mensaje = MENSAJE_422_PRACTICA
    else:
        mensaje = MENSAJE_422
    return JSONResponse(status_code=422, content={"detail": mensaje})


@app.exception_handler(Exception)
async def manejar_inesperado(_: Request, error: Exception) -> JSONResponse:
    logger.exception("Error no controlado", exc_info=error)
    return JSONResponse(status_code=500, content={"detail": MENSAJE_500})


app.include_router(guias.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"estado": "ok"}
