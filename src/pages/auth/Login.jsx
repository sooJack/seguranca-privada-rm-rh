// ============================================================
// pages/auth/Login.jsx
// Tela de login com validação e feedback visual
// ============================================================

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SiStackhawk } from "react-icons/si";
import { FaLightbulb } from "react-icons/fa";
import { Lightbulb, LightbulbFilament } from "phosphor-react";
import { LiaFlagUsaSolid } from "react-icons/lia";
import { GiBrazilFlag } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { Input, Button, Alert } from "../../components/ui";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = language === "en-US";

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
      const message = t("forms.filledBoth");
      setErro(message);
      toast.warning(t("forms.required"), message);
      return;
    }
    setErro("");
    setCarregando(true);
    try {
      await login({ nome: form.nome, cpf: form.cpf });
      toast.success("Login efetuado", "Bem-vindo ao painel de gestão.");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.mensagem || err.message || t("login.error");
      setErro(message);
      toast.error("Falha no login", message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      {/* Botões de controle */}
      <div className="login__controls">
        <button className="login__theme-btn" onClick={toggleLanguage} title={t("topbar.changeLanguage")}>
          {isEnglish ? <LiaFlagUsaSolid size={20} /> : <GiBrazilFlag size={20} />}
        </button>
        <button className="login__theme-btn" onClick={toggleTheme} title={theme === "dark" ? t("topbar.lightMode") : t("topbar.darkMode")}>
          {theme === "dark" ? <LightbulbFilament size={20} /> : <Lightbulb size={20} />}
        </button>
      </div>

      <div className="login__card">
        {/* Logo */}
        <div className="login__logo">
          <span className="login__logo-icon"><SiStackhawk size={28} /></span>
          <div>
            <h1 className="login__logo-title">AEGIS DYNAMICS SECURITY</h1>
            <p className="login__logo-sub">{t("login.systemInfo")}</p>
          </div>
        </div>

        <p className="login__welcome">{t("login.welcome")}</p>

        {/* Feedback de erro */}
        {erro && <Alert type="error" onClose={() => setErro("")}>{erro}</Alert>}

        {/* Formulário */}
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <Input
            label={t("login.name")}
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder={t("login.namePlaceholder")}
            autoComplete="name"
            required
          />
          <Input
            label={t("login.cpf")}
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder={t("login.cpfPlaceholder")}
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
            {t("login.login")}
          </Button>
        </form>

        <p className="login__info">{t("login.exclusive")}</p>
      </div>
    </div>
  );
}
