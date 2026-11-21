// Importamos las tres funciones básicas de Vitest
import { describe, it, expect } from 'vitest';

// describe agrupa pruebas relacionadas bajo un título
describe('Configuración de pruebas', () => {
  // it describe UNA prueba: "debería..."
  it('debería ejecutar una prueba sencilla', () => {
    // Preparar: los datos de entrada
    const pasosTotales = 3;

    // Actuar: lo que queremos comprobar (como mostrar "Paso X de Y")
    const textoAvance = `Paso 1 de ${pasosTotales}`;

    // Comprobar: expect(valorReal).toBe(valorEsperado)
    expect(textoAvance).toBe('Paso 1 de 3');
  });
});