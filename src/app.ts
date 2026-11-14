import { db } from './database.js';
import express from 'express';
import { soma } from './soma.js';

export const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Aplicação CI funcionando');
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.get('/soma', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({
      erro: 'Os parâmetros a e b devem ser números.',
    });
  }

  return res.status(200).json({
    resultado: soma(a, b),
  });
});

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({
      erro: 'Nome e email são obrigatórios.',
    });
  }

  try {
    const resultado = db
      .prepare('INSERT INTO usuarios (nome, email) VALUES (?, ?)')
      .run(nome, email);

    return res.status(201).json({
      id: resultado.lastInsertRowid,
      nome,
      email,
    });
  } catch {
    return res.status(409).json({
      erro: 'Email já cadastrado.',
    });
  }
});

app.get('/usuarios', (_req, res) => {
  const usuarios = db
    .prepare('SELECT id, nome, email FROM usuarios ORDER BY id')
    .all();

  return res.status(200).json(usuarios);
});

app.get('/usuarios/:id', (req, res) => {
  const usuario = db
    .prepare('SELECT id, nome, email FROM usuarios WHERE id = ?')
    .get(req.params.id);

  if (!usuario) {
    return res.status(404).json({
      erro: 'Usuário não encontrado.',
    });
  }

  return res.status(200).json(usuario);
});
