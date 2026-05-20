// ============================================================
// components/modals/ConfirmModal.js
// Modal de confirmação para exclusão com overlay
// ============================================================

import React from "react";
import { Button } from "../ui";
import "./Modal.css";

export default function ConfirmModal({ aberto, titulo, mensagem, onConfirmar, onCancelar, carregando }) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header modal__header--danger">
          <span className="modal__header-icon">🗑️</span>
          <h2 className="modal__title">{titulo || "Confirmar exclusão"}</h2>
        </div>
        <div className="modal__body">
          <p>{mensagem || "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."}</p>
        </div>
        <div className="modal__footer">
          <Button variant="ghost" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmar} loading={carregando}>
            Sim, excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
