import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectDB } from './mongodb.js';
import { createSession, deleteSession, getSession } from './session.js';
import routes from './routes-mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const OPENAPI_JSON_PATH = fileURLToPath(new URL('../src/swagger/openapi.json', import.meta.url));

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
      api_docs: 'GET /api-docs',
      openapi_json: 'GET /api/openapi.json',
      vigilantes: 'GET /api/vigilantes',
      clientes: 'GET /api/clientes',
      postos: 'GET /api/postos',
      escalas: 'GET /api/escalas',
      ocorrencias: 'GET /api/ocorrencias'
    },
    docs: `http://localhost:${PORT}/api-docs`,
    frontend: FRONTEND_URL
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
    docs: `http://localhost:${PORT}/api-docs`,
    frontend: FRONTEND_URL
  });
});

app.get('/api-docs', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Swagger UI - Segurança Privada</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.32.6/swagger-ui.css" />
    <style>
      body { margin: 0; padding: 0; }
      #swagger-ui { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.32.6/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.32.6/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        SwaggerUIBundle({
          url: '/api/openapi.json',
          dom_id: '#swagger-ui',
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'StandaloneLayout',
          validatorUrl: null,
          docExpansion: 'none',
          deepLinking: true
        });
      };
    </script>
  </body>
</html>`);
});

app.get('/api/openapi.json', (req, res) => {
  res.sendFile(OPENAPI_JSON_PATH);
});

// Teste de conexão
app.get('/api/health', async (req, res) => {
  try {
    res.json({
      status: 'online',
      message: 'Conectado ao MongoDB Atlas',
      timestamp: new Date().toISOString(),
      database: 'MongoDB'
    });
  } catch (error) {
    res.status(503).json({
      status: 'erro',
      error: error.message
    });
  }
});

// Teste simples de conexão
app.get('/api/test', async (req, res) => {
  try {
    res.json({
      sucesso: true,
      mensagem: 'Conexão com MongoDB funcionando!'
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    res.status(500).json({
      sucesso: false,
      erro: error.message
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

    const row = rows[0];
    const userCargo = String(row.cargo || '').trim().toLowerCase();
    const userName = String(row.nome || '').trim().toLowerCase();
    const userCpf = String(row.cpf || '').trim();

    const adminCpfs = (process.env.ADMIN_CPF || '').split(',').map((item) => item.trim()).filter(Boolean);
    const adminNames = (process.env.ADMIN_NAME || '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);

    const isAdmin =
      userCargo === 'adm ultimate' ||
      userCargo === 'adm' ||
      userCargo === 'admin' ||
      userCargo === 'administrator' ||
      adminCpfs.includes(userCpf) ||
      adminNames.includes(userName);

    const usuario = {
      ...row,
      cargo: isAdmin ? 'ADM ULTIMATE' : row.cargo || 'Vigilante'
    };
    const token = `token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    createSession(token, usuario);

    return res.json({
      token,
      usuario
    });
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    res.status(500).json({ mensagem: 'Erro interno no login.', detalhe: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token) {
    deleteSession(token);
  }
  res.json({ mensagem: 'Logout realizado com sucesso.' });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const usuario = getSession(token);

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Sessão não encontrada ou token inválido.' });
  }

  res.json(usuario);
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
  try {
    await connectDB();
    console.log('✅ Conectado ao MongoDB!');
  } catch (error) {
    console.error('❌ Falha ao conectar ao MongoDB. O servidor não será iniciado.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 API Endpoints disponíveis em http://localhost:${PORT}/api`);
    console.log(`📄 Swagger UI local: http://localhost:${PORT}/api-docs`);
    console.log(`📘 OpenAPI JSON: http://localhost:${PORT}/api/openapi.json`);
    console.log(`🌐 Frontend: ${FRONTEND_URL}/`);
    console.log('');
  });
};

startServer();
