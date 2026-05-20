// ============================================================
// components/layout/Topbar.js
// Barra superior com título da página, toggle tema e breadcrumb
// ============================================================

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "./Topbar.css";

export default function Topbar({ titulo, subtitulo, onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="topbar">
      {/* Botão hamburger para mobile */}
      <button className="topbar__hamburger" onClick={onMenuToggle} title="Menu">
        ☰
      </button>

      {/* Título */}
      <div className="topbar__title-wrap">
        <h1 className="topbar__title">{titulo || "Dashboard"}</h1>
        {subtitulo && <span className="topbar__sub">{subtitulo}</span>}
      </div>

      {/* Ações à direita */}
      <div className="topbar__actions">
        {/* Toggle Dark/White Mode */}
        <button
          className="topbar__theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Modo claro" : "Modo escuro"}
        >
          {isDark ? "☀️" : "🌙"}
          <span className="topbar__theme-label">
            {isDark ? "Claro" : "Escuro"}
          </span>
        </button>
      </div>
    </header>
  );
}
