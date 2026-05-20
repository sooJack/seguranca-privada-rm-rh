// ============================================================
// context/AuthContext.js
// Gerencia autenticação e usuário logado
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica sessão ao inicializar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService
        .me()
        .then((res) => setUsuario(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem("token", res.data.token);
    setUsuario(res.data.usuario);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando, autenticado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
