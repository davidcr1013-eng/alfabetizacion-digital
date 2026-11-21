import { Boton } from './Boton';          // reutilizamos el botón que ya hiciste
import './MensajeEstado.css';

// Los tres tipos de mensaje que acordamos en docs/interfaz.md
type TipoMensaje = 'cargando' | 'error' | 'vacio';

interface MensajeEstadoProps {
  tipo: TipoMensaje;          // obligatorio: qué clase de mensaje es
  mensaje: string;            // obligatorio: el texto para la persona
  textoAccion?: string;       // opcional: texto del botón, por ejemplo "Reintentar"
  onAccion?: () => void;      // opcional: qué hacer al pulsar el botón
}

export function MensajeEstado({ tipo, mensaje, textoAccion, onAccion }: MensajeEstadoProps) {
  // Operador ternario: condición ? siQueSí : siQueNo
  // "alert" hace que el lector de pantalla lo anuncie de inmediato (errores);
  // "status" lo anuncia sin interrumpir (cargando y vacío).
  const rol = tipo === 'error' ? 'alert' : 'status';

  return (
    <div className={`mensaje-estado mensaje-estado--${tipo}`} role={rol}>
      <p className="mensaje-estado__texto">{mensaje}</p>

      {/* Renderizado condicional: el botón solo aparece si hay texto Y función */}
      {textoAccion && onAccion && (
        <Boton onClick={onAccion}>{textoAccion}</Boton>
      )}
    </div>
  );
}