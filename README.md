# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Sistema de Segurança Privada - RM / RH

Projeto acadêmico de banco de dados voltado para gestão de segurança privada com interface web moderna.

## 🚀 Quick Start

```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
npm run server
```

- Frontend: http://localhost:5173/
- Swagger API: http://localhost:5173/api-docs
- Backend API: http://localhost:3001/api/

## 📋 Estrutura do Projeto

### Frontend
- `src/` - Código React
- `src/components/` - Componentes reutilizáveis
- `src/services/apiService.js` - Cliente HTTP para API
- `src/swagger/` - Documentação OpenAPI

### Backend
- `server/server.js` - Servidor Express
- `server/database.js` - Conexão MySQL

### Banco de Dados
- `database/create_tables.sql` - Criação do banco, tabelas e índices
- `database/views.sql` - Views do sistema
- `database/procedures.sql` - Procedures armazenadas
- `database/triggers.sql` - Triggers do banco
- `database/inserts.sql` - Dados iniciais
- `database/consultas.sql` - Consultas SQL para análise

## 🛠️ Tecnologias

**Frontend:**
- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Swagger UI 5

**Backend:**
- Node.js / Express
- MySQL 2
- CORS

**Banco de Dados:**
- MySQL
- SQL

## 📊 Funcionalidades

- Cadastro de vigilantes
- Controle de postos
- Gestão de escalas
- Registro de ocorrências
- Gestão de riscos
- Controle de férias
- Controle de horas extras
- Documentação interativa da API (Swagger)

## ⚙️ Configuração do Banco de Dados

Veja [BANCO_DE_DADOS.md](./BANCO_DE_DADOS.md) para instruções completas de setup.

### Resumo:
1. Executar scripts SQL em `database/` (na ordem indicada)
2. Configurar credenciais em `.env`
3. Iniciar servidor backend com `npm run server`
4. Frontend conectará automaticamente

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/vigilantes` | Listar vigilantes |
| POST | `/api/vigilantes` | Criar vigilante |
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/postos` | Listar postos |
| GET | `/api/escalas` | Listar escalas |
| GET | `/api/ocorrencias` | Listar ocorrências |
| GET | `/api/health` | Status do servidor |

## 📖 Scripts Disponíveis

```bash
npm start          # Inicia frontend (http://localhost:5173)
npm run dev        # Inicia Vite com HMR
npm run server     # Inicia backend (http://localhost:3001)
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # ESLint
```

## 🔍 Verificar Conexão

```bash
# Testar se backend está rodando
curl http://localhost:3001/api/health

# Resposta esperada:
# {"status":"online","timestamp":"2026-05-19T..."}
```
## 💻 Developers

1. Arlan
2. Filemon
3. Jack