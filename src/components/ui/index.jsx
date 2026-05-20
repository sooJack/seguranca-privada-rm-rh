// ============================================================
// components/ui/index.js
// Componentes reutilizáveis: Button, Input, Badge, Card, Alert
// ============================================================

import React from "react";
import "./ui.css";

/* ── BUTTON ─────────────────────────────────────────────────── */
export function Button({
  children, variant = "primary", size = "md",
  loading = false, disabled, className = "", ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${loading ? "btn--loading" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn__spinner" />}
      {children}
    </button>
  );
}

/* ── INPUT ───────────────────────────────────────────────────── */
export function Input({ label, error, helper, required, className = "", ...rest }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label">
          {label}{required && <span className="field__required">*</span>}
        </label>
      )}
      <input className={`field__input ${error ? "field__input--error" : ""}`} {...rest} />
      {error && <span className="field__error">{error}</span>}
      {helper && !error && <span className="field__helper">{helper}</span>}
    </div>
  );
}

/* ── SELECT ──────────────────────────────────────────────────── */
export function Select({ label, error, required, children, className = "", ...rest }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label">
          {label}{required && <span className="field__required">*</span>}
        </label>
      )}
      <select className={`field__input field__select ${error ? "field__input--error" : ""}`} {...rest}>
        {children}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}

/* ── TEXTAREA ────────────────────────────────────────────────── */
export function Textarea({ label, error, required, className = "", ...rest }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label">
          {label}{required && <span className="field__required">*</span>}
        </label>
      )}
      <textarea
        className={`field__input field__textarea ${error ? "field__input--error" : ""}`}
        rows={4}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}

/* ── BADGE ───────────────────────────────────────────────────── */
export function Badge({ children, variant = "default" }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}

/* ── CARD ────────────────────────────────────────────────────── */
export function Card({ children, className = "", padding = true }) {
  return (
    <div className={`card ${padding ? "card--padded" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ── ALERT ───────────────────────────────────────────────────── */
export function Alert({ type = "info", children, onClose }) {
  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  return (
    <div className={`alert alert--${type}`} role="alert">
      <span className="alert__icon">{icons[type]}</span>
      <span className="alert__msg">{children}</span>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Fechar">✕</button>
      )}
    </div>
  );
}

/* ── SPINNER ─────────────────────────────────────────────────── */
export function Spinner({ size = "md" }) {
  return <div className={`spinner spinner--${size}`} role="status"><span className="sr-only">Carregando…</span></div>;
}

/* ── EMPTY STATE ─────────────────────────────────────────────── */
export function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {action}
    </div>
  );
}
