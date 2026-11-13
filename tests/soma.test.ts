import { describe, expect, it } from 'vitest';
import { soma } from '../src/soma.js';

describe('função soma', () => {
  it('deve somar dois números corretamente', () => {
    expect(soma(2, 3)).toBe(5);
  });

  it('deve somar números negativos', () => {
    expect(soma(-2, -3)).toBe(-5);
  });

  it('deve somar número positivo e negativo', () => {
    expect(soma(10, -4)).toBe(6);
  });
});
