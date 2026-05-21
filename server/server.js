import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, testConnection } from './database.js';
import routes from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', routes);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    api: 'Servidor de Segurança Privada',
    version: '1.0.0',
    endpoints: {
      contador: 'GET /api',
      health: 'GET /api/health',
      test: 'GET /api/test',
      vigilantes: 'GET /api/vigilantes',
      clientes: 'GET /api/clientes',
      postos: 'GET /api/postos',
      escalas: 'GET /api/escalas',
      ocorrencias: 'GET /api/ocorrencias'
    },
    docs: 'http://localhost:5173/api-docs',
    frontend: 'http://localhost:5173/'
  });
});

// Rota /api de descrição
app.get('/api', (req, res) => {
  res.json({
    api: 'Servidor de Segurança Privada',
    version: '1.0.0',
    mensagem: 'Bem-vindo à API. Use os endpoints abaixo para acessar dados e operações.',
    endpoints: {
      health: 'GET /api/health',
      test: 'GET /api/test',
      vigilantes: 'GET /api/vigilantes',
      vigilante_por_id: 'GET /api/vigilantes/:id',
      criar_vigilante: 'POST /api/vigilantes',
      clientes: 'GET /api/clientes',
      postos: 'GET /api/postos',
      escalas: 'GET /api/escalas',
      ocorrencias: 'GET /api/ocorrencias',
      login: 'POST /api/auth/login'
    },
    docs: 'http://localhost:5173/api-docs',
    frontend: 'http://localhost:5173/'
  });
});

// Teste de conexão
app.get('/api/health', async (req, res) => {
  try {
    const connected = await testConnection();
    if (!connected) {
      return res.status(503).json({
        status: 'offline',
        error: 'Banco de dados não está acessível',
        config: {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          database: process.env.DB_NAME || 'seguranca_privada',
          port: process.env.DB_PORT || 3306
        },
        solucao: 'Verifique se MySQL está rodando e se as credenciais em .env estão corretas'
      });
    }
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      config: {
        database: process.env.DB_NAME || 'seguranca_privada'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'erro',
      error: error.message,
      config: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root'
      }
    });
  }
});

// Teste simples de conexão
app.get('/api/test', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [result] = await connection.query('SELECT 1 as test');
    connection.release();
    res.json({
      sucesso: true,
      mensagem: 'Conexão com banco de dados funcionando!',
      resultado: result
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    res.status(500).json({
      sucesso: false,
      erro: error.message,
      codigo: error.code,
      dica: 'MySQL está rodando? Banco seguranca_privada existe? Verifique .env'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { nome, cpf } = req.body;

    if (!nome || !cpf) {
      return res.status(400).json({ mensagem: 'Nome e CPF são obrigatórios.' });
    }

    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM vigilantes WHERE nome = ? AND cpf = ?', [nome, cpf]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'Nome ou CPF não encontrados. Verifique seus dados.' });
    }

    const usuario = rows[0];
    return res.json({
      token: 'token-falso-para-desenvolvimento',
      usuario
    });
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    res.status(500).json({ mensagem: 'Erro interno no login.', detalhe: error.message });
  }
});

// Rota 404
app.use((req, res) => {
  console.warn(`⚠️ Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    path: req.path,
    endpoints_disponiveis: [
      'GET /api/vigilantes',
      'POST /api/vigilantes',
      'PUT /api/vigilantes/:id',
      'DELETE /api/vigilantes/:id',
      'GET /api/clientes',
      'POST /api/clientes',
      'PUT /api/clientes/:id',
      'DELETE /api/clientes/:id',
      'GET /api/postos',
      'POST /api/postos',
      'PUT /api/postos/:id',
      'DELETE /api/postos/:id',
      'GET /api/escalas',
      'POST /api/escalas',
      'PUT /api/escalas/:id',
      'DELETE /api/escalas/:id',
      'GET /api/ocorrencias',
      'POST /api/ocorrencias',
      'DELETE /api/ocorrencias/:id',
      'GET /api/ferias',
      'POST /api/ferias',
      'DELETE /api/ferias/:id',
      'GET /api/horas-extras',
      'POST /api/horas-extras',
      'DELETE /api/horas-extras/:id',
      'GET /api/riscos',
      'POST /api/riscos',
      'PUT /api/riscos/:id',
      'DELETE /api/riscos/:id'
    ]
  });
});

const startServer = async () => {
  const connected = await testConnection();
  if (!connected) {
    console.error('⛔ Falha ao conectar ao banco de dados. O servidor não será iniciado.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 API Endpoints disponíveis em http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:5173/`);
    console.log('');
  });
};

startServer();
