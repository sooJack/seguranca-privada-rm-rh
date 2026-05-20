import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/vigilantes", icon: "👮", label: "Vigilantes" },
    { to: "/escalas", icon: "🗓️", label: "Escalas" },
    { to: "/ocorrencias", icon: "📋", label: "Ocorrências" },
    { to: "/relatorios", icon: "📈", label: "Relatórios" },
    { to: "/configuracoes", icon: "⚙️", label: "Configurações" },
    { to: "/rondas", icon: "🚨", label: "Rondas" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileOpen ? "sidebar--mobile-open" : ""}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">🛡️</div>
          <div className="sidebar__logo-text">
            <div className="sidebar__logo-title">Segurança</div>
            <div className="sidebar__logo-sub">RM · RH</div>
          </div>
        </div>
        <button className="sidebar__toggle" onClick={onToggle} title="Alternar barra">
          {collapsed ? "➤" : "◀"}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link${isActive ? " sidebar__link--active" : ""}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{usuario?.nome ? usuario.nome.slice(0, 2).toUpperCase() : "US"}</div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{usuario?.nome || "Usuário"}</div>
            <div className="sidebar__user-role">{usuario?.cargo || "Administrador"}</div>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  );
}
