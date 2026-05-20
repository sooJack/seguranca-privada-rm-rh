// ============================================================
// pages/auth/Login.jsx
// Tela de login com validação e feedback visual
// ============================================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SiStackhawk } from "react-icons/si";
import { FaLightbulb } from "react-icons/fa";
import { Lightbulb, LightbulbFilament } from "phosphor-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { Input, Button, Alert } from "../../components/ui";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    nome: location.state?.nome || "",
    cpf: location.state?.cpf || ""
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.cpf) {
      const message = "Preencha nome e CPF.";
      setErro(message);
      toast.warning("Campos obrigatórios", message);
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      await login({ nome: form.nome, cpf: form.cpf });
      toast.success("Login efetuado", "Bem-vindo ao painel de gestão.");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.mensagem || err.message || "Credenciais inválidas. Tente novamente.";
      setErro(message);
      toast.error("Falha no login", message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      {/* Botão tema */}
      <button className="login__theme-btn" onClick={toggleTheme} title="Alternar tema">
        {theme === "dark" ? <LightbulbFilament size={20} /> : <Lightbulb size={20} />}
      </button>

      <div className="login__card">
        {/* Logo */}
        <div className="login__logo">
          <span className="login__logo-icon"><SiStackhawk size={28} /></span>
          <div>
            <h1 className="login__logo-title">AEGIS DYNAMICS SECURITY</h1>
            <p className="login__logo-sub">Sistema AEGIS</p>
          </div>
        </div>

        <p className="login__welcome">Bem-vindo! Faça login para continuar.</p>

        {/* Feedback de erro */}
        {erro && <Alert type="error" onClose={() => setErro("")}>{erro}</Alert>}

        {/* Formulário */}
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nome"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            autoComplete="name"
            required
          />
          <Input
            label="CPF"
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            autoComplete="username"
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={carregando}
            className="login__btn"
          >
            Entrar
          </Button>
        </form>

        <p className="login__footer">
          Sistema de uso exclusivo da equipe autorizada.
        </p>
      </div>
    </div>
  );
}
