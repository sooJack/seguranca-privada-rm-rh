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
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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

export default api;
