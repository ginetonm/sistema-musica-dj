const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
const port = 3000;
const users = [];

// Rota de Registro
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = { email, password };
  users.push(user);
  res.status(201).send('Usuário registrado com sucesso');
});

// Rota de Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).send('Credenciais inválidas.');
});

// Middleware para autenticar JWT
const autenticarJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send('Token não fornecido.');

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.user = dados;
    next();
  } catch {
    res.status(403).send('Token inválido.');
  }
};

// Rota protegida
app.get('/musicas', autenticarJWT, (req, res) => {
  res.json([
    { id: 1, titulo: 'Música A', artista: 'DJ A' },
    { id: 2, titulo: 'Música B', artista: 'DJ B' },
  ]);
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
