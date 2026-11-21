import { describe, expect, it } from 'vitest';
import { esIdValido } from './useGuia';

describe('esIdValido', () => {
  it('acepta enteros positivos', () => {
    expect(esIdValido('1')).toBe(true);
    expect(esIdValido('25')).toBe(true);
  });

  it('rechaza cero, negativos, decimales y texto', () => {
    for (const id of ['0', '-1', '1.5', 'abc', '', '01']) {
      expect(esIdValido(id)).toBe(false);
    }
  });
});
