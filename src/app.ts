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
