import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { FiHome } from "react-icons/fi";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { LuClipboard } from "react-icons/lu";
import { FaClipboard } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";
import { GoGear } from "react-icons/go";
import { PiSiren } from "react-icons/pi";
import "./Sidebar.css";

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const { usuario, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <FiHome />, label: t("common.dashboard") },
    { to: "/vigilantes", icon: <GiPoliceOfficerHead />, label: t("common.vigilantes") },
    { to: "/escalas", icon: <LuClipboard />, label: t("common.escalas") },
    { to: "/ocorrencias", icon: <FaClipboard />, label: t("common.ocorrencias") },
    { to: "/relatorios", icon: <CiViewTable />, label: t("common.relatorios") },
    { to: "/configuracoes", icon: <GoGear />, label: t("common.configuracoes") },
    { to: "/rondas", icon: <PiSiren />, label: t("common.rondas") },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileOpen ? "sidebar--mobile-open" : ""}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-text">
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
        <button className="sidebar__logout" onClick={handleLogout}>{t("login.logout")}</button>
      </div>
    </aside>
  );
}
