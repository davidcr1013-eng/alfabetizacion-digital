import type { Paso } from '../services/tipos';

/**
 * TAD ListaPasos (contrato en ListaPasos.md).
 *
 * Lista ordenada de pasos respaldada por un arreglo privado. Conserva el
 * orden en que se agregan (el orden que envía la API) y solo deja consultar
 * los pasos mediante sus operaciones: las pantallas nunca tocan el arreglo.
 */
export class ListaPasos {
  // `#` hace el campo privado de verdad: no se puede leer ni cambiar desde fuera.
  readonly #pasos: Readonly<Paso>[] = [];

  /** Crea una lista con los pasos dados, en el mismo orden. */
  static desde(pasos: readonly Paso[]): ListaPasos {
    const lista = new ListaPasos();
    for (const paso of pasos) {
      lista.agregar(paso);
    }
    return lista;
  }

  /** Agrega un paso al final. Guarda una copia congelada para que nadie la modifique. */
  agregar(paso: Readonly<Paso>): void {
    this.#pasos.push(Object.freeze({ ...paso }));
  }

  /**
   * Devuelve el paso de la posición `indice` (desde 0).
   * @throws RangeError si el índice no es un entero entre 0 y cantidad() - 1.
   */
  obtener(indice: number): Readonly<Paso> {
    if (!Number.isInteger(indice) || indice < 0 || indice >= this.#pasos.length) {
      throw new RangeError(
        `Índice ${indice} fuera de la lista: hay ${this.#pasos.length} paso(s).`,
      );
    }
    return this.#pasos[indice];
  }

  /** Número de pasos guardados. */
  cantidad(): number {
    return this.#pasos.length;
  }

  /** true si no hay ningún paso. */
  estaVacia(): boolean {
    return this.#pasos.length === 0;
  }
}
