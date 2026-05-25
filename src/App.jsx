import { Routes, Route, Navigate } from "react-router-dom";
import { Component } from "react";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Vigilantes from "./pages/Vigilantes";
import Escalas from "./pages/Escalas";
import Ocorrencias from "./pages/Ocorrencias";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Rondas from "./pages/Rondas";
import Layout from "./components/layout/Layout";
import { SwaggerDocs } from "./components/SwaggerDocs";
import "./styles/global.css";
import "./App.css";

// Error Boundary para evitar tela branca
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro crítico:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Erro ao carregar</h1>
          <p>Desculpe, ocorreu um erro. Recarregue a página.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "0.5rem 1rem" }}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { autenticado, carregando } = useAuth();
  const { t } = useLanguage();

  if (carregando) {
    return <div className="page-shell">{t("common.loading")}</div>;
  }

  return autenticado ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { autenticado } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={autenticado ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/api-docs" element={<SwaggerDocs />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout titulo="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vigilantes"
        element={
          <ProtectedRoute>
            <Layout titulo="Vigilantes">
              <Vigilantes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/escalas"
        element={
          <ProtectedRoute>
            <Layout titulo="Escalas">
              <Escalas />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ocorrencias"
        element={
          <ProtectedRoute>
            <Layout titulo="Ocorrências">
              <Ocorrencias />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <ProtectedRoute>
            <Layout titulo="Relatórios">
              <Relatorios />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute>
            <Layout titulo="Configurações">
              <Configuracoes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rondas"
        element={
          <ProtectedRoute>
            <Layout titulo="Rondas">
              <Rondas />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  );
}
