import { describe, expect, it } from 'vitest';
import { contarRespondidas, esEstadoResultado } from './estadoResultado';

const estadoValido = {
  guiaId: '1',
  resultado: {
    intento_id: '00000000-0000-4000-8000-000000000001',
    aciertos: 2,
    total: 3,
    retroalimentacion: [],
  },
  preguntas: [],
};

describe('esEstadoResultado', () => {
  it('acepta el estado que envía la práctica', () => {
    expect(esEstadoResultado(estadoValido, '1')).toBe(true);
  });

  it('rechaza la ausencia de estado (página recargada o abierta directamente)', () => {
    expect(esEstadoResultado(null, '1')).toBe(false);
    expect(esEstadoResultado(undefined, '1')).toBe(false);
  });

  it('rechaza el resultado de otra guía', () => {
    expect(esEstadoResultado(estadoValido, '2')).toBe(false);
  });
});

describe('contarRespondidas', () => {
  it('cuenta solo las preguntas con opción elegida', () => {
    expect(contarRespondidas({ 101: 'a', 103: 'c' }, [101, 102, 103])).toBe(2);
  });
});
