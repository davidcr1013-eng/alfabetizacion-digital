import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Boton } from '../../components/Boton';
import { EnlaceBoton } from '../../components/EnlaceBoton';
import { MensajeEstado } from '../../components/MensajeEstado';
import type { GuiaDetalle } from '../../services/tipos';
import type { ListaPasos } from '../../tad/ListaPasos';
import { useGuia } from './useGuia';
import './GuiaPage.css';

// Pantalla 2 (ruta "/guias/:guiaId"): un paso a la vez con Anterior y Siguiente.
export function GuiaPage() {
  const { guiaId = '' } = useParams();
  // La `key` hace que React cree un recorrido nuevo al cambiar de guía:
  // así el índice del paso vuelve a cero (acuerdo T0).
  return <RecorridoGuia key={guiaId} guiaId={guiaId} />;
}

function RecorridoGuia({ guiaId }: { guiaId: string }) {
  const { estado, reintentar } = useGuia(guiaId);

  switch (estado.tipo) {
    case 'cargando':
      return <MensajeEstado tipo="cargando" mensaje="Cargando la guía…" />;

    case 'no-encontrada':
      return (
        <>
          <h1>Guía no encontrada</h1>
          <MensajeEstado tipo="error" mensaje="No encontramos esta guía." />
          <EnlaceBoton to="/" variante="secundario">
            Volver al inicio
          </EnlaceBoton>
        </>
      );

    case 'error':
      return (
        <>
          <h1>No se pudo abrir la guía</h1>
          <MensajeEstado
            tipo="error"
            mensaje="No pudimos cargar la guía. Inténtalo de nuevo."
            textoAccion="Reintentar"
            onAccion={reintentar}
          />
        </>
      );

    case 'exito':
      return <Pasos guia={estado.guia} pasos={estado.pasos} />;
  }
}

function Pasos({ guia, pasos }: { guia: GuiaDetalle; pasos: ListaPasos }) {
  const [indice, setIndice] = useState(0);
  const zonaPaso = useRef<HTMLDivElement>(null);
  const primerDibujo = useRef(true);

  // Al cambiar de paso, el foco va al texto nuevo para que el lector de
  // pantalla lo lea y el teclado siga desde ahí.
  useEffect(() => {
    if (primerDibujo.current) {
      primerDibujo.current = false;
      return;
    }
    zonaPaso.current?.focus();
  }, [indice]);

  if (pasos.estaVacia()) {
    return (
      <>
        <h1>{guia.titulo}</h1>
        <MensajeEstado tipo="vacio" mensaje="Esta guía todavía no tiene pasos." />
        <EnlaceBoton to="/" variante="secundario">
          Volver al inicio
        </EnlaceBoton>
      </>
    );
  }

  const paso = pasos.obtener(indice);
  const esPrimero = indice === 0;
  const esUltimo = indice === pasos.cantidad() - 1;

  return (
    <>
      <h1>{guia.titulo}</h1>

      <div ref={zonaPaso} tabIndex={-1} className="guia__paso">
        <p className="guia__avance">
          Paso {indice + 1} de {pasos.cantidad()}
        </p>
        {paso.imagen_url && (
          <img
            className="guia__imagen"
            src={paso.imagen_url}
            alt={`Imagen de referencia del paso ${indice + 1}: ${paso.texto}`}
          />
        )}
        <p className="guia__texto">{paso.texto}</p>
      </div>

      <div className="guia__controles">
        <Boton
          variante="secundario"
          disabled={esPrimero}
          onClick={() => setIndice((actual) => actual - 1)}
        >
          Anterior
        </Boton>
        {esUltimo ? (
          <EnlaceBoton to={`/guias/${guia.id}/practica`}>Ir a la práctica</EnlaceBoton>
        ) : (
          <Boton onClick={() => setIndice((actual) => actual + 1)}>Siguiente</Boton>
        )}
      </div>
    </>
  );
}
