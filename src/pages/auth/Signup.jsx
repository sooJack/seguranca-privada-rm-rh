import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vigilantesService } from "../../services/api";
import { Mail, User, Phone, FileText } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { SiFuturelearn } from "react-icons/si";
import "./Login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoHome = () => navigate('/');
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    nivel_treinamento: "BASICO",
    status_vigilante: "ATIVO",
  });

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return false;
    // Validação básica (poderia ser mais robusta)
    return true;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefone = (telefone) => {
    const telefoneLimpo = telefone.replace(/\D/g, "");
    return telefoneLimpo.length >= 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações
    if (!formData.nome.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return;
    }
    if (!validarEmail(formData.email)) {
      setError("Email inválido");
      return;
    }
    if (!formData.cpf.trim()) {
      setError("CPF é obrigatório");
      return;
    }
    if (!validarCPF(formData.cpf)) {
      setError("CPF inválido (deve ter 11 dígitos)");
      return;
    }
    if (!formData.telefone.trim()) {
      setError("Telefone é obrigatório");
      return;
    }
    if (!validarTelefone(formData.telefone)) {
      setError("Telefone inválido");
      return;
    }

    setLoading(true);

    try {
      // Registrar como vigilante no banco de dados
      await vigilantesService.criar({
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        nivel_treinamento: formData.nivel_treinamento,
        status_vigilante: formData.status_vigilante,
      });

      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.response?.data?.error?.includes("UNIQUE constraint failed")) {
        setError("Este CPF já está cadastrado");
      } else {
        setError(error.response?.data?.error || "Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--landing-bg)",
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--landing-surface-strong)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--landing-shadow)",
        width: "100%",
        maxWidth: "480px",
        padding: "2rem",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--landing-border)",
      }}>
        {/* Header */}
        <div className="signup-header">
          <div className="signup-icon"><BsPeople /></div>
          <h1 className="signup-title">Criar Conta</h1>
          <p className="signup-sub">Registre-se como vigilante</p>
        </div>

        {/* Mensagens */}
        {error && (
          <div style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(209, 0, 0, 0.1)",
            color: "var(--primary)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(209, 0, 0, 0.3)",
            fontSize: "0.9rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(0, 168, 85, 0.1)",
            color: "#00A855",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(0, 168, 85, 0.3)",
            fontSize: "0.9rem",
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Nome */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "var(--landing-text)",
              fontSize: "0.9rem",
            }}>
              <User size={16} style={{ display: "inline-block", marginRight: "0.5rem" }} />
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="João Silva"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid var(--landing-border)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--landing-text)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "var(--landing-text)",
              fontSize: "0.9rem",
            }}>
              <Mail size={16} style={{ display: "inline-block", marginRight: "0.5rem" }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid var(--landing-border)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--landing-text)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* CPF */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "var(--landing-text)",
              fontSize: "0.9rem",
            }}>
              <FileText size={16} style={{ display: "inline-block", marginRight: "0.5rem" }} />
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid var(--landing-border)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--landing-text)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Telefone */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "var(--landing-text)",
              fontSize: "0.9rem",
            }}>
              <Phone size={16} style={{ display: "inline-block", marginRight: "0.5rem" }} />
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(83) 99999-9999"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid var(--landing-border)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--landing-text)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Nível Treinamento */}
          <div>
            <label style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "var(--landing-text)",
              fontSize: "0.9rem",
            }}>
              <SiFuturelearn /> Nível de Treinamento
            </label>
            <select
              name="nivel_treinamento"
              value={formData.nivel_treinamento}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid var(--landing-border)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.8)",
                color: "var(--landing-text)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            >
              <option value="BASICO">Básico</option>
              <option value="INTERMEDIARIO">Intermediário</option>
              <option value="AVANCADO">Avançado</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="signup-btn"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            style={{
              width: "100%",
              padding: "0.9rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--landing-border)",
              background: "transparent",
              color: "var(--landing-text)",
              fontWeight: "700",
              cursor: "pointer",
              marginTop: "0.75rem"
            }}
          >
            Voltar à Página Inicial
          </button>

          {/* Link para Login */}
          <p style={{
            textAlign: "center",
            color: "var(--landing-muted)",
            margin: "1rem 0 0 0",
            fontSize: "0.9rem",
          }}>
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Faça login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
