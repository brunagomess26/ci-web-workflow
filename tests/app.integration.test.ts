import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { db } from '../src/database.js';

describe('testes de integração da API', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM usuarios').run();
  });

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

  it('deve cadastrar um usuário no banco SQL', async () => {
    const response = await request(app).post('/usuarios').send({
      nome: 'Bruna',
      email: 'bruna@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nome: 'Bruna',
      email: 'bruna@example.com',
    });

    const usuario = db
      .prepare('SELECT nome, email FROM usuarios WHERE email = ?')
      .get('bruna@example.com');

    expect(usuario).toEqual({
      nome: 'Bruna',
      email: 'bruna@example.com',
    });
  });

  it('deve listar usuários cadastrados no banco SQL', async () => {
    db.prepare('INSERT INTO usuarios (nome, email) VALUES (?, ?)').run(
      'Bruna',
      'bruna@example.com',
    );

    const response = await request(app).get('/usuarios');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      nome: 'Bruna',
      email: 'bruna@example.com',
    });
  });

  it('deve consultar um usuário pelo id', async () => {
    const resultado = db
      .prepare('INSERT INTO usuarios (nome, email) VALUES (?, ?)')
      .run('Bruna', 'bruna@example.com');

    const response = await request(app).get(
      `/usuarios/${resultado.lastInsertRowid}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      nome: 'Bruna',
      email: 'bruna@example.com',
    });
  });
});
