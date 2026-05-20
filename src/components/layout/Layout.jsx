// ============================================================
// components/layout/Layout.js
// Layout principal: Sidebar + Topbar + conteúdo da página
// ============================================================

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";

export default function Layout({ titulo, subtitulo, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`layout ${collapsed ? "layout--collapsed" : ""}`}>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="layout__overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
      />

      {/* Conteúdo principal */}
      <div className="layout__main">
        <Topbar
          titulo={titulo}
          subtitulo={subtitulo}
          onMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main className="layout__content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
