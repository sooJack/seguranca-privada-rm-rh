// ============================================================
// components/layout/Topbar.js
// Barra superior com título da página, toggle tema e breadcrumb
// ============================================================

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { LiaFlagUsaSolid } from "react-icons/lia";
import { GiBrazilFlag } from "react-icons/gi";
import "./Topbar.css";

export default function Topbar({ titulo, subtitulo, onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const isDark = theme === "dark";
  const isEnglish = language === "en-US";

  return (
    <header className="topbar">
      {/* Botão hamburger para mobile */}
      <button className="topbar__hamburger" onClick={onMenuToggle} title="Menu">
        ☰
      </button>

      {/* Título */}
      <div className="topbar__title-wrap">
        <h1 className="topbar__title">{titulo || t("common.dashboard")}</h1>
        {subtitulo && <span className="topbar__sub">{subtitulo}</span>}
      </div>

      {/* Ações à direita */}
      <div className="topbar__actions">
        {/* Toggle Language */}
        <button
          className="topbar__language-toggle"
          onClick={toggleLanguage}
          title={t("topbar.changeLanguage")}
        >
          {isEnglish ? <LiaFlagUsaSolid size={18} /> : <GiBrazilFlag size={18} />}
          <span className="topbar__language-label">
            {isEnglish ? "EN" : "PT"}
          </span>
        </button>

        {/* Toggle Dark/White Mode */}
        <button
          className="topbar__theme-toggle"
          onClick={toggleTheme}
          title={isDark ? t("topbar.lightMode") : t("topbar.darkMode")}
        >
          {isDark ? "☀️" : "🌙"}
          <span className="topbar__theme-label">
            {isDark ? t("common.light") : t("common.dark")}
          </span>
        </button>
      </div>
    </header>
  );
}
