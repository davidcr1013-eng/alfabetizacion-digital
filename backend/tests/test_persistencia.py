from __future__ import annotations

import uuid

import pytest
from sqlalchemy import func, select

from app.db.models import Guia, Intento
from app.db.repositorio import ErrorPersistencia, guardar_intento


@pytest.fixture
def guia(db):
    guia = Guia(id=1, titulo="Conectarse a Wi-Fi", descripcion="Repasar la conexión.")
    db.add(guia)
    db.commit()
    return guia


def _contar_intentos(db) -> int:
    return db.scalar(select(func.count()).select_from(Intento))


def test_guardar_intento_lo_confirma_con_uuid_y_fecha(db, fabrica_sesiones, guia):
    intento = guardar_intento(db, guia_id=guia.id, aciertos=2, total=3)

    assert isinstance(intento.id, uuid.UUID)
    assert intento.creado_en is not None

    # Una sesión nueva lo encuentra: quedó confirmado, no solo en memoria.
    with fabrica_sesiones() as otra:
        guardado = otra.get(Intento, intento.id)
        assert guardado is not None
        assert (guardado.aciertos, guardado.total) == (2, 3)


def test_aciertos_mayores_que_total_no_se_guardan(db, guia):
    with pytest.raises(ErrorPersistencia):
        guardar_intento(db, guia_id=guia.id, aciertos=4, total=3)
    assert _contar_intentos(db) == 0


def test_guia_inexistente_no_crea_intento(db, guia):
    with pytest.raises(ErrorPersistencia):
        guardar_intento(db, guia_id=99, aciertos=1, total=3)
    assert _contar_intentos(db) == 0
