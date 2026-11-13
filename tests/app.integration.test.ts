import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('testes de integração da API', () => {
  it('deve retornar status 200 na rota /health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
    });
  });

  it('deve retornar a soma correta', async () => {
    const response = await request(app).get('/soma?a=2&b=3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      resultado: 5,
    });
  });

  it('deve retornar erro quando os parâmetros não forem números', async () => {
    const response = await request(app).get('/soma?a=abc&b=3');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      erro: 'Os parâmetros a e b devem ser números.',
    });
  });
});
