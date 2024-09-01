const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3333;
const PATH_COMPRAR_INGRESSO = process.env.PATH_COMPRAR_INGRESSO || '/comprar-ingresso';
const PATH_HEALTH = process.env.PATH_HEALTH || '/health';

// Configuração do Sequelize
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Definição do modelo de dados para a tabela de ingressos
const Ticket = sequelize.define('ticket', {
  movie: Sequelize.STRING,
  date: Sequelize.DATE,
  time: Sequelize.TIME,
  quantity: Sequelize.INTEGER
});

// Sincronizar o modelo com o banco de dados (criar a tabela se não existir)
sequelize.sync().then(() => {
  console.log('Modelos sincronizados com o banco de dados');
}).catch(err => {
  console.error('Erro ao sincronizar modelos com o banco de dados:', err);
});

// Middlewares
app.use(cors({
  origin: '*' //`${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`// Substitua pela origem do seu frontend
}));
app.use(bodyParser.json());

// Rotas
app.post(PATH_COMPRAR_INGRESSO, async (req, res) => {
  const { movie, date, time, quantity } = req.body;
  try {
    const ticket = await Ticket.create({
      movie,
      date,
      time,
      quantity
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Erro ao comprar ingresso:', error);
    res.status(500).json({ error: 'Erro ao comprar ingresso. Por favor, tente novamente.' });
  }
});

app.get(PATH_HEALTH, (req, res) => {
  res.send('OK');
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
