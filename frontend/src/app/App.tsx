import { Layout } from '../components/Layout';
import { MensajeEstado } from '../components/MensajeEstado';
import { Boton } from '../components/Boton';

export default function App() {
  return (
    // Ya no usamos <main> aquí: lo pone Layout
    <Layout>
      <h1>Prueba de componentes</h1>

      <MensajeEstado tipo="cargando" mensaje="Cargando las guías…" />

      <MensajeEstado
        tipo="error"
        mensaje="No pudimos cargar las guías. Revisa tu conexión e inténtalo de nuevo."
        textoAccion="Reintentar"
        onAccion={() => console.log('Reintentando')}
      />

      <Boton variante="secundario">Anterior</Boton>
    </Layout>
  );
}