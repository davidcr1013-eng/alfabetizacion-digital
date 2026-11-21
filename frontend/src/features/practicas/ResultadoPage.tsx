import { useLocation, useParams } from 'react-router';
import { EnlaceBoton } from '../../components/EnlaceBoton';
import { MensajeEstado } from '../../components/MensajeEstado';
import { esEstadoResultado } from './estadoResultado';
import './Practica.css';

// Pantalla 4 (ruta "/guias/:guiaId/resultado"): aciertos, total y explicaciones.
export function ResultadoPage() {
  const { guiaId = '' } = useParams();
  const { state } = useLocation();

  // T0: si se abre o recarga sin el resultado en la sesión, se ofrece repetir.
  if (!esEstadoResultado(state, guiaId)) {
    return (
      <>
        <h1>Tu resultado</h1>
        <MensajeEstado
          tipo="vacio"
          mensaje="No encontramos tu resultado. Puedes volver a hacer la práctica."
        />
        <EnlaceBoton to={`/guias/${guiaId}/practica`}>Hacer la práctica</EnlaceBoton>
      </>
    );
  }

  const { resultado, preguntas } = state;
  const enunciado = (preguntaId: number) =>
    preguntas.find((p) => p.id === preguntaId)?.enunciado ?? `Pregunta ${preguntaId}`;

  return (
    <>
      <h1>Tu resultado</h1>

      <p className="resultado__resumen">
        <strong>
          {resultado.aciertos} de {resultado.total}
        </strong>{' '}
        respuestas correctas
      </p>

      <ol className="resultado__lista">
        {resultado.retroalimentacion.map((item) => (
          <li
            key={item.pregunta_id}
            className={`resultado__item ${item.correcta ? 'resultado__item--bien' : 'resultado__item--mal'}`}
          >
            <p className="resultado__enunciado">{enunciado(item.pregunta_id)}</p>
            {/* La palabra se escribe siempre: el color nunca es la única señal */}
            <p className="resultado__veredicto">{item.correcta ? '✓ Correcta' : '✗ Incorrecta'}</p>
            <p className="resultado__explicacion">{item.explicacion}</p>
          </li>
        ))}
      </ol>

      <EnlaceBoton to={`/guias/${guiaId}/practica`}>Repetir la práctica</EnlaceBoton>
      <EnlaceBoton to="/" variante="secundario">
        Volver al inicio
      </EnlaceBoton>
    </>
  );
}
