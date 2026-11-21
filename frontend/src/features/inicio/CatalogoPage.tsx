import { EnlaceBoton } from '../../components/EnlaceBoton';
import { MensajeEstado } from '../../components/MensajeEstado';
import type { GuiaResumen } from '../../services/tipos';
import { useGuias } from './useGuias';
import './CatalogoPage.css';

// Pantalla 1 (ruta "/"): muestra las guías que llegan de GET /api/guias.
export function CatalogoPage() {
  const { estado, reintentar } = useGuias();

  return (
    <>
      <h1>Elige una guía</h1>
      <p>Aprende a usar tu celular paso a paso con tres guías breves.</p>

      {estado.tipo === 'cargando' && (
        <MensajeEstado tipo="cargando" mensaje="Cargando las guías…" />
      )}

      {estado.tipo === 'error' && (
        <MensajeEstado
          tipo="error"
          mensaje={estado.mensaje}
          textoAccion="Reintentar"
          onAccion={reintentar}
        />
      )}

      {estado.tipo === 'vacio' && (
        <MensajeEstado
          tipo="vacio"
          mensaje="Todavía no hay guías disponibles."
          textoAccion="Reintentar"
          onAccion={reintentar}
        />
      )}

      {estado.tipo === 'exito' && (
        <ul className="catalogo__lista">
          {estado.guias.map((guia) => (
            <li key={guia.id}>
              <TarjetaGuia guia={guia} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function TarjetaGuia({ guia }: { guia: GuiaResumen }) {
  return (
    <article className="tarjeta-guia">
      <h2 className="tarjeta-guia__titulo">{guia.titulo}</h2>
      <p className="tarjeta-guia__descripcion">{guia.descripcion}</p>
      {/* El título va en el texto para que un lector de pantalla distinga cada enlace */}
      <EnlaceBoton to={`/guias/${guia.id}`}>Abrir guía: {guia.titulo}</EnlaceBoton>
    </article>
  );
}
