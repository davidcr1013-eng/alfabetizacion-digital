import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_URL, ErrorApi, esCancelacion, pedirJson } from './api';
import { validarCatalogo } from './guias';

function respuestaJson(cuerpo: unknown, estado = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('pedirJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve el JSON de una respuesta correcta', async () => {
    const fetchFalso = vi.fn(async () => respuestaJson({ guias: [] }));
    vi.stubGlobal('fetch', fetchFalso);

    const datos = await pedirJson<{ guias: unknown[] }>('/api/guias');

    expect(datos).toEqual({ guias: [] });
    expect(fetchFalso).toHaveBeenCalledTimes(1);
  });

  it('usa VITE_API_BASE_URL como inicio de la dirección', async () => {
    let direccion = '';
    vi.stubGlobal('fetch', async (url: string) => {
      direccion = url;
      return respuestaJson({});
    });

    await pedirJson('/api/guias');

    expect(direccion).toBe(`${API_BASE_URL}/api/guias`);
  });

  it('convierte {"detail"} en un ErrorApi con su código', async () => {
    vi.stubGlobal('fetch', async () => respuestaJson({ detail: 'La guía no existe.' }, 404));

    const error = await pedirJson('/api/guias/99').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorApi);
    expect((error as ErrorApi).estado).toBe(404);
    expect((error as ErrorApi).message).toBe('La guía no existe.');
  });

  it('da un mensaje comprensible cuando la API está apagada', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch');
    });

    const error = await pedirJson('/api/guias').catch((e: unknown) => e);

    expect((error as ErrorApi).estado).toBe(0);
    expect((error as ErrorApi).message).toContain('No pudimos conectarnos');
  });

  it('deja pasar la cancelación sin convertirla en error de conexión', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new DOMException('cancelada', 'AbortError');
    });

    const error = await pedirJson('/api/guias').catch((e: unknown) => e);

    expect(esCancelacion(error)).toBe(true);
  });
});

describe('validarCatalogo', () => {
  it('acepta {"guias": [...]}', () => {
    const datos = { guias: [{ id: 1, titulo: 'Wi-Fi', descripcion: 'd' }] };
    expect(validarCatalogo(datos)).toEqual(datos);
  });

  it('rechaza una lista suelta, que no es el formato de T0', () => {
    expect(() => validarCatalogo([{ id: 1 }])).toThrow(ErrorApi);
  });
});
