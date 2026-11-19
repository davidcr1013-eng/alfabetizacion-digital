import { Link, useParams } from 'react-router';

export function ResultadoPage() {
  const { guiaId } = useParams();

  return (
    <>
      <h1>Resultado de la guía {guiaId}</h1>
      <p>Pantalla de ejemplo. La construye la Persona 3.</p>
      <Link to="/">Volver al inicio</Link>
      <Link to={`/guias/${guiaId}/practica`}>Repetir la práctica</Link>
    </>
  );
}