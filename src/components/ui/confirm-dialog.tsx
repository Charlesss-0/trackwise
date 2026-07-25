"use client";

import { Modal } from "./modal";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
};

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete", isLoading = false }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-base-content/70">{message}</p>
      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
        <button type="button" className="btn btn-error" onClick={onConfirm} disabled={isLoading}>
          {isLoading && <span className="loading loading-spinner loading-sm" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
