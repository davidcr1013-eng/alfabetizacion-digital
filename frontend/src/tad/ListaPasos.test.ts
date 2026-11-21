import { describe, expect, it } from 'vitest';
import type { Paso } from '../services/tipos';
import { ListaPasos } from './ListaPasos';

function crearPasos(cantidad: number): Paso[] {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: 11 + i,
    orden: i + 1,
    texto: `Paso número ${i + 1}`,
    imagen_url: null,
  }));
}

describe('ListaPasos con cero elementos', () => {
  const lista = new ListaPasos();

  it('está vacía y su cantidad es 0', () => {
    expect(lista.estaVacia()).toBe(true);
    expect(lista.cantidad()).toBe(0);
  });

  it('no deja obtener la posición 0', () => {
    expect(() => lista.obtener(0)).toThrow(RangeError);
  });
});

describe('ListaPasos con un elemento', () => {
  const [paso] = crearPasos(1);
  const lista = new ListaPasos();
  lista.agregar(paso);

  it('ya no está vacía y su cantidad es 1', () => {
    expect(lista.estaVacia()).toBe(false);
    expect(lista.cantidad()).toBe(1);
  });

  it('devuelve el paso en la posición 0', () => {
    expect(lista.obtener(0)).toEqual(paso);
  });

  it('no deja salir de los límites', () => {
    expect(() => lista.obtener(1)).toThrow(RangeError);
    expect(() => lista.obtener(-1)).toThrow(RangeError);
  });
});

describe('ListaPasos con cinco elementos', () => {
  const pasos = crearPasos(5);
  const lista = ListaPasos.desde(pasos);

  it('tiene cantidad 5', () => {
    expect(lista.cantidad()).toBe(5);
  });

  it('conserva el orden en que se agregaron', () => {
    const ordenes = Array.from({ length: lista.cantidad() }, (_, i) => lista.obtener(i).orden);
    expect(ordenes).toEqual([1, 2, 3, 4, 5]);
  });

  it('el último está en cantidad() - 1 y cantidad() es inválido', () => {
    expect(lista.obtener(4).id).toBe(15);
    expect(() => lista.obtener(5)).toThrow(RangeError);
  });

  it('rechaza índices que no son enteros', () => {
    expect(() => lista.obtener(1.5)).toThrow(RangeError);
    expect(() => lista.obtener(Number.NaN)).toThrow(RangeError);
  });
});

describe('Encapsulación', () => {
  it('cambiar el paso original no altera la lista', () => {
    const paso = crearPasos(1)[0];
    const lista = new ListaPasos();
    lista.agregar(paso);

    paso.texto = 'Texto cambiado desde fuera';

    expect(lista.obtener(0).texto).toBe('Paso número 1');
  });

  it('el paso devuelto no se puede modificar', () => {
    const lista = ListaPasos.desde(crearPasos(1));
    const paso = lista.obtener(0) as Paso;

    expect(() => {
      paso.texto = 'otro';
    }).toThrow(TypeError);
  });

  it('no expone su arreglo interno', () => {
    const lista = ListaPasos.desde(crearPasos(2));
    expect(Object.keys(lista)).toEqual([]);
  });
});
