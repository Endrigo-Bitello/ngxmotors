const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // Adicionar JWT para autenticação
const compression = require('compression');
const fs = require('fs');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json()); // Para entender requisições no formato JSON
app.use(compression());

app.use(cors({
  origin: `${process.env.NEXT_PUBLIC_CORS_ORIGIN}`, // Autoriza requisições do frontend (porta 3000)
}));

app.use(bodyParser.json()); // Suporte para JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Suporte para URL-encoded bodies
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Deve ser true em produção com HTTPS
}));

// Conectar ao MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[MongoDB] Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Importar modelos
const Carros = require('./models/Carros');
const Motos = require('./models/Motos');

// Função para carregar os carros do banco de dados
async function carregarCarros() {
  try {
    const carros = await Carros.find(); // Busca todos os carros
    console.log(`Carros carregados: ${carros.length}`);
    carros.forEach(carro => {
      console.log(`Carro: ${carro.marca} ${carro.modelo} - ID: ${carro.customId}`);
    });
  } catch (error) {
    console.error('Erro ao carregar os carros:', error);
  }
}

async function carregarMotos() {
  try {
    const motos = await Motos.find();
    console.log(`Motos carregadas: ${motos.length}`);
    motos.forEach(moto => {
      console.log(`Moto: ${moto.marca} ${moto.modelo} - ID: ${moto.customId}`);
    });
  } catch (error) {
    console.error('Erro ao carregar as motos', error);
  }
}


// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Pega o token dos cookies

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado, faça o login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token JWT
    req.user = decoded; // Armazena o usuário no request
    next(); // Prossegue para a rota
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

// Rotas
const carRoutes = require('./routes/carsRoutes');
const motorcycleRoutes = require('./routes/motorcyclesRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const financiamentoRoutes = require('./routes/financiamentoRoutes');
const mensagensRoutes = require('./routes/mensagensRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const vehiclesRoutes = require('./routes/vehiclesRoutes');
const searchRoutes = require('./routes/searchRoutes');
const customersRoutes = require('./routes/customersRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Usar as rotas
app.use('/api/carros', carRoutes);
app.use('/api/motos', motorcycleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/financiamentos', financiamentoRoutes);
app.use('/api/mensagens', mensagensRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/clientes', customersRoutes);
app.use('/api', contactRoutes);
app.use('/api', protectedRoutes);
app.use('/api', searchRoutes);

app.get('/api/fipeAPI', (req, res) => {
  const { marca, modelo, ano } = req.query;

  // Chamada para API externa da FIPE
  const url = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${marca}/modelos/${modelo}/anos/${ano}`;
  axios.get(url)
      .then(response => res.json(response.data))
      .catch(error => res.status(500).json({ error: 'Erro ao buscar dados da FIPE' }));
});


app.get('/', (req, res) => {
  res.send('Você não possui acesso.');
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[EMX Tecnologia] Sistema iniciado com sucesso`);
  console.log(`[EMX Tecnologia] Servidor rodando na porta: ${PORT}`);

  carregarCarros(); 
  carregarMotos()
});
