# Integração do Banco de Dados - Segurança Privada

## 🗄️ Configuração do Banco de Dados

O projeto agora está integrado com o banco de dados MySQL `seguranca_privada`.

### Pré-requisitos

- MySQL instalado e rodando
- Node.js e npm

### 1. Criar o Banco de Dados

Execute os scripts SQL na seguinte ordem:

```bash
# No MySQL/phpMyAdmin ou MySQL Workbench:
1. database/create_tables.sql     # Cria tabelas
2. database/views.sql             # Cria views
3. database/procedures.sql        # Cria procedures
4. database/triggers.sql          # Cria triggers
5. database/inserts.sql           # Insere dados iniciais
```

### 2. Configurar Variáveis de Ambiente

Editar o arquivo `.env`:

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=seguranca_privada
DB_PORT=3306

# Servidor
SERVER_PORT=3001
NODE_ENV=development
```

### 3. Iniciar o Projeto

**Terminal 1 - Frontend (React/Vite)**
```bash
npm start
# Abre em http://localhost:5173/
```

**Terminal 2 - Backend (Servidor Express)**
```bash
npm run server
# Rodando em http://localhost:3001/
```

### 4. Acessar a API

- **Swagger UI**: http://localhost:5173/api-docs
- **Health Check**: http://localhost:3001/api/health

### 📡 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/vigilantes` | Listar todos os vigilantes |
| GET | `/api/vigilantes/:id` | Buscar vigilante por ID |
| POST | `/api/vigilantes` | Criar novo vigilante |
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/postos` | Listar postos |
| GET | `/api/escalas` | Listar escalas |
| GET | `/api/ocorrencias` | Listar ocorrências |
| GET | `/api/health` | Verificar status do servidor |

### 🔄 Usar a API no Frontend

```javascript
import { apiService } from '@/services/apiService'

// Buscar vigilantes
const vigilantes = await apiService.getVigilantes()

// Criar vigilante
const novoVigilante = await apiService.createVigilante({
  nome: 'João Silva',
  cpf: '123.456.789-00',
  telefone: '(11) 98765-4321',
  nivel_treinamento: 'BASICO',
  status_vigilante: 'ATIVO'
})

// Verificar saúde do servidor
const health = await apiService.checkHealth()
```

### ✅ Verificar Conexão

Abra o navegador em: `http://localhost:3001/api/health`

Deve retornar:
```json
{
  "status": "online",
  "timestamp": "2026-05-19T09:46:14.000Z"
}
```

### 📝 Estrutura do Banco

**Tabelas principais:**
- `vigilantes` - Vigilantes do sistema
- `clientes` - Clientes/empresas
- `postos` - Postos de vigilância
- `escalas` - Escalas de trabalho
- `ocorrencias` - Registro de ocorrências
- `ferias` - Controle de férias
- `horas_extras` - Controle de horas extras

### 🆘 Troubleshooting

**Erro: "ECONNREFUSED - Conexão recusada"**
- Verificar se MySQL está rodando
- Verificar credenciais em `.env`

**Erro: "CORS error"**
- Servidor backend está rodando em `http://localhost:3001`?
- CORS está habilitado no servidor

**Frontend não carrega dados**
- Verificar aba Network no navegador
- Verificar console do servidor (`npm run server`)
- Verificar `.env` com credenciais corretas
