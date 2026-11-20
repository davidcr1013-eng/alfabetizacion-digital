# Contrato del TAD ListaPasos (P5-01)

## Qué guarda

Una secuencia ordenada de pasos de una guía. Cada paso tiene la forma del contrato T0:

```ts
interface Paso { id: number; orden: number; texto: string; imagen_url: string | null }
```

## Operaciones

| Operación | Qué hace | Costo |
| --- | --- | --- |
| `agregar(paso: Readonly<Paso>): void` | Agrega el paso al final de la lista | O(1) |
| `obtener(indice: number): Readonly<Paso>` | Devuelve el paso en la posición `indice` | O(1) |
| `cantidad(): number` | Devuelve cuántos pasos hay | O(1) |
| `estaVacia(): boolean` | Indica si la lista no tiene pasos | O(1) |
| `ListaPasos.desde(pasos)` | Crea una lista con los pasos dados, en el mismo orden (atajo de varios `agregar`) | O(n) |

## Reglas (invariantes)

1. **Orden**: los pasos se guardan en el orden en que se agregan. La API ya los entrega ordenados por `orden`, así que la lista conserva ese orden.
2. **Índices desde cero**: el primer paso está en `obtener(0)` y el último en `obtener(cantidad() - 1)`. El campo `orden` de la base empieza en 1; la pantalla muestra `índice + 1` ("Paso 1 de 5").
3. **Índice inválido**: si `indice` no es un entero entre `0` y `cantidad() - 1`, `obtener` lanza `RangeError`. La pantalla lo evita con sus límites (Anterior desactivado en el primer paso, Ir a la práctica en el último).
4. **Encapsulación**: la colección interna es un campo privado (`#pasos`). Nadie fuera de la clase puede leerla ni cambiarla; solo se usan las operaciones.
5. **Inmutabilidad**: `agregar` guarda una copia congelada (`Object.freeze`). Cambiar el objeto original después de agregarlo no altera la lista, y el paso devuelto por `obtener` no se puede modificar.

## Representación

Un arreglo privado, como permite T0. Si la rúbrica exige una lista con nodos, se cambia solo la parte interna de la clase; las operaciones y las pantallas siguen igual (esa es la ventaja de un TAD).

## Pruebas

`ListaPasos.test.ts` cubre listas de cero, uno y cinco elementos, el orden, los límites (`-1`, `cantidad()`, decimales) y la encapsulación. Se ejecutan con `npm run test:run`.
