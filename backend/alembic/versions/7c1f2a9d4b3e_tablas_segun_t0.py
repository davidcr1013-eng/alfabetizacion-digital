"""Tablas según el acuerdo T0

La primera migración creó las tablas sin restricciones (columnas anulables,
opciones como texto e id entero en intentos). Esta migración las reemplaza
por la versión acordada en T0. Solo había datos de desarrollo, que se vuelven
a cargar con `python -m scripts.cargar_datos`.

Revision ID: 7c1f2a9d4b3e
Revises: 426062012cd5
Create Date: 2026-11-20 19:00:00
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "7c1f2a9d4b3e"
down_revision: Union[str, Sequence[str], None] = "426062012cd5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _borrar_tablas() -> None:
    op.drop_table("intentos")
    op.drop_table("preguntas")
    op.drop_table("pasos")
    op.drop_table("guias")


def upgrade() -> None:
    _borrar_tablas()

    op.create_table(
        "guias",
        sa.Column("id", sa.Integer(), autoincrement=False, nullable=False),
        sa.Column("titulo", sa.String(length=120), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.CheckConstraint("id > 0", name="ck_guias_id_positivo"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "pasos",
        sa.Column("id", sa.Integer(), autoincrement=False, nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=False),
        sa.Column("orden", sa.Integer(), nullable=False),
        sa.Column("texto", sa.Text(), nullable=False),
        sa.Column("imagen_url", sa.Text(), nullable=True),
        sa.CheckConstraint("orden > 0", name="ck_pasos_orden_positivo"),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("guia_id", "orden", name="uq_pasos_guia_orden"),
    )
    op.create_table(
        "preguntas",
        sa.Column("id", sa.Integer(), autoincrement=False, nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=False),
        sa.Column("enunciado", sa.Text(), nullable=False),
        sa.Column("opciones", postgresql.JSONB(), nullable=False),
        sa.Column("opcion_correcta", sa.String(length=1), nullable=False),
        sa.Column("explicacion", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "opcion_correcta IN ('a', 'b', 'c')", name="ck_preguntas_opcion_correcta"
        ),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "intentos",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=False),
        sa.Column("aciertos", sa.Integer(), nullable=False),
        sa.Column("total", sa.Integer(), nullable=False),
        sa.Column("creado_en", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("total > 0", name="ck_intentos_total_positivo"),
        sa.CheckConstraint(
            "aciertos >= 0 AND aciertos <= total", name="ck_intentos_aciertos_rango"
        ),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    _borrar_tablas()

    # Vuelve a la estructura de la migración 426062012cd5.
    op.create_table(
        "guias",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("titulo", sa.String(), nullable=True),
        sa.Column("descripcion", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "intentos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=True),
        sa.Column("aciertos", sa.Integer(), nullable=True),
        sa.Column("total", sa.Integer(), nullable=True),
        sa.Column("creado_en", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "pasos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=True),
        sa.Column("orden", sa.Integer(), nullable=True),
        sa.Column("texto", sa.String(), nullable=True),
        sa.Column("imagen_url", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "preguntas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("guia_id", sa.Integer(), nullable=True),
        sa.Column("enunciado", sa.String(), nullable=True),
        sa.Column("opciones", sa.String(), nullable=True),
        sa.Column("opcion_correcta", sa.String(), nullable=True),
        sa.Column("explicacion", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["guia_id"], ["guias.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
