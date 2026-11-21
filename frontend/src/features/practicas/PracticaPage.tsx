import { Link, useParams } from 'react-router';

export function PracticaPage() {
  const { guiaId } = useParams();

  return (
    <>
      <h1>Práctica de la guía {guiaId}</h1>
      <p>Pantalla de ejemplo. La construye la Persona 3.</p>
      <Link to={`/guias/${guiaId}/resultado`}>Enviar respuestas (ejemplo)</Link>
    </>
  );
}