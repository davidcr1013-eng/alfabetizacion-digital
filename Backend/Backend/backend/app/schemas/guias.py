from pydantic import BaseModel


class PasoGuia(BaseModel):
    id: int
    orden: int
    texto: str
    imagen_url: str | None = None


class GuiaResumen(BaseModel):
    id: int
    titulo: str
    descripcion: str


class GuiaDetalle(GuiaResumen):
    pasos: list[PasoGuia]
