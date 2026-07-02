require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const leitorRoutes = require('./routes/leitorRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/livros', livroRoutes);
app.use('/leitores', leitorRoutes);
app.use('/emprestimos', emprestimoRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Sistema de Gerenciamento de Biblioteca no ar!',
    documentacao: '/api-docs'
  });
});

// Handler genérico de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

module.exports = app;
