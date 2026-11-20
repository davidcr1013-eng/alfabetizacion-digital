import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Boton } from '../../components/Boton';
import { EnlaceBoton } from '../../components/EnlaceBoton';
import { MensajeEstado } from '../../components/MensajeEstado';
import { ErrorApi } from '../../services/api';
import { enviarIntento } from '../../services/practicas';
import type { IdOpcion, PreguntaPublica } from '../../services/tipos';
import { contarRespondidas, type EstadoResultado } from './estadoResultado';
import { usePreguntas } from './usePreguntas';
import './Practica.css';

const MENSAJE_FALTAN = 'Responde las tres preguntas antes de enviar.';
const MENSAJE_ENVIO = 'No se pudo guardar el resultado. Inténtalo de nuevo.';

// Pantalla 3 (ruta "/guias/:guiaId/practica"): tres preguntas y envío.
export function PracticaPage() {
  const { guiaId = '' } = useParams();
  return <Practica key={guiaId} guiaId={guiaId} />;
}

function Practica({ guiaId }: { guiaId: string }) {
  const { estado, reintentar } = usePreguntas(guiaId);

  switch (estado.tipo) {
    case 'cargando':
      return <MensajeEstado tipo="cargando" mensaje="Cargando la práctica…" />;

    case 'no-encontrada':
      return (
        <>
          <h1>Práctica no encontrada</h1>
          <MensajeEstado tipo="error" mensaje="No encontramos esta guía." />
          <EnlaceBoton to="/" variante="secundario">
            Volver al inicio
          </EnlaceBoton>
        </>
      );

    case 'error':
      return (
        <>
          <h1>No se pudo abrir la práctica</h1>
          <MensajeEstado
            tipo="error"
            mensaje="No pudimos cargar la práctica. Inténtalo de nuevo."
            textoAccion="Reintentar"
            onAccion={reintentar}
          />
        </>
      );

    case 'exito':
      return <Formulario guiaId={guiaId} preguntas={estado.preguntas} />;
  }
}

function Formulario({ guiaId, preguntas }: { guiaId: string; preguntas: PreguntaPublica[] }) {
  const navegar = useNavigate();
  // Las respuestas viven en el estado: si falla el envío, siguen marcadas.
  const [respuestas, setRespuestas] = useState<Record<number, IdOpcion>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const respondidas = contarRespondidas(
    respuestas,
    preguntas.map((p) => p.id),
  );

  function elegir(preguntaId: number, opcionId: IdOpcion) {
    setRespuestas((anteriores) => ({ ...anteriores, [preguntaId]: opcionId }));
    setError(null);
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    if (respondidas < preguntas.length) {
      setError(MENSAJE_FALTAN);
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      const resultado = await enviarIntento(guiaId, {
        respuestas: preguntas.map((p) => ({ pregunta_id: p.id, opcion_id: respuestas[p.id] })),
      });
      const estado: EstadoResultado = { guiaId, resultado, preguntas };
      navegar(`/guias/${guiaId}/resultado`, { state: estado });
    } catch (fallo) {
      // Se muestra el mensaje de la API (T0) y las respuestas no se borran.
      setError(fallo instanceof ErrorApi ? fallo.message : MENSAJE_ENVIO);
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Práctica · {preguntas.length} preguntas</h1>
      <p>Elige una respuesta en cada pregunta. Puedes cambiarlas antes de enviar.</p>

      <form className="practica" onSubmit={enviar} noValidate>
        {preguntas.map((pregunta, numero) => (
          <fieldset key={pregunta.id} className="practica__pregunta">
            <legend className="practica__enunciado">
              {numero + 1}. {pregunta.enunciado}
            </legend>
            {pregunta.opciones.map((opcion) => (
              <label key={opcion.id} className="practica__opcion">
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.id}
                  checked={respuestas[pregunta.id] === opcion.id}
                  onChange={() => elegir(pregunta.id, opcion.id)}
                  disabled={enviando}
                />
                <span>{opcion.texto}</span>
              </label>
            ))}
          </fieldset>
        ))}

        <p className="practica__avance" aria-live="polite">
          Respondiste {respondidas} de {preguntas.length} preguntas.
        </p>

        {error && <MensajeEstado tipo="error" mensaje={error} />}

        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar respuestas'}
        </Boton>
      </form>
    </>
  );
}
