// ============================================================
// services/api.js
// Camada de comunicação com a API (Swagger + MySQL)
// Ajuste BASE_URL conforme seu backend
// ============================================================

import axios from "axios";

// 🔧 CONFIGURAÇÃO — altere a URL base conforme seu projeto
// Em Vite use `import.meta.env.VITE_API_URL` (defina em .env se necessário)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor: injeta token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: trata erros globais (ex: 401 redireciona para login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || "";
    const isLoginRequest = requestUrl.endsWith("/auth/login");
    if (err.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.hash = "#/login";
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// ─── FUNCIONÁRIOS (RH) ───────────────────────────────────────
export const funcionariosService = {
  listar: (params) => api.get("/funcionarios", { params }),
  buscarPorId: (id) => api.get(`/funcionarios/${id}`),
  criar: (dados) => api.post("/funcionarios", dados),
  atualizar: (id, dados) => api.put(`/funcionarios/${id}`, dados),
  excluir: (id) => api.delete(`/funcionarios/${id}`),
};

// ─── VIGILANTES ──────────────────────────────────────────────
export const vigilantesService = {
  listar: (params) => api.get("/vigilantes", { params }),
  buscarPorId: (id) => api.get(`/vigilantes/${id}`),
  criar: (dados) => api.post("/vigilantes", dados),
  atualizar: (id, dados) => api.put(`/vigilantes/${id}`, dados),
  excluir: (id) => api.delete(`/vigilantes/${id}`),
};

// ─── CLIENTES ────────────────────────────────────────────────
export const clientesService = {
  listar: (params) => api.get("/clientes", { params }),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  criar: (dados) => api.post("/clientes", dados),
  atualizar: (id, dados) => api.put(`/clientes/${id}`, dados),
  excluir: (id) => api.delete(`/clientes/${id}`),
};

// ─── POSTOS ──────────────────────────────────────────────────
export const postosService = {
  listar: (params) => api.get("/postos", { params }),
  buscarPorId: (id) => api.get(`/postos/${id}`),
  criar: (dados) => api.post("/postos", dados),
  atualizar: (id, dados) => api.put(`/postos/${id}`, dados),
  excluir: (id) => api.delete(`/postos/${id}`),
};

// ─── ESCALAS (RM — Resource Management) ─────────────────────
export const escalasService = {
  listar: (params) => api.get("/escalas", { params }),
  buscarPorId: (id) => api.get(`/escalas/${id}`),
  criar: (dados) => api.post("/escalas", dados),
  atualizar: (id, dados) => api.put(`/escalas/${id}`, dados),
  excluir: (id) => api.delete(`/escalas/${id}`),
};

// ─── OCORRÊNCIAS ─────────────────────────────────────────────
export const ocorrenciasService = {
  listar: (params) => api.get("/ocorrencias", { params }),
  buscarPorId: (id) => api.get(`/ocorrencias/${id}`),
  criar: (dados) => api.post("/ocorrencias", dados),
  atualizar: (id, dados) => api.put(`/ocorrencias/${id}`, dados),
  excluir: (id) => api.delete(`/ocorrencias/${id}`),
};

// ─── FÉRIAS ──────────────────────────────────────────────────
export const feriasService = {
  listar: (params) => api.get("/ferias", { params }),
  buscarPorId: (id) => api.get(`/ferias/${id}`),
  criar: (dados) => api.post("/ferias", dados),
  atualizar: (id, dados) => api.put(`/ferias/${id}`, dados),
  excluir: (id) => api.delete(`/ferias/${id}`),
};

// ─── HORAS EXTRAS ────────────────────────────────────────────
export const horasExtrasService = {
  listar: (params) => api.get("/horas-extras", { params }),
  buscarPorId: (id) => api.get(`/horas-extras/${id}`),
  criar: (dados) => api.post("/horas-extras", dados),
  atualizar: (id, dados) => api.put(`/horas-extras/${id}`, dados),
  excluir: (id) => api.delete(`/horas-extras/${id}`),
};

// ─── RISCOS (Gestão de Riscos RM) ────────────────────────────
export const riscosService = {
  listar: (params) => api.get("/riscos", { params }),
  buscarPorId: (id) => api.get(`/riscos/${id}`),
  criar: (dados) => api.post("/riscos", dados),
  atualizar: (id, dados) => api.put(`/riscos/${id}`, dados),
  excluir: (id) => api.delete(`/riscos/${id}`),
};

export default api;
