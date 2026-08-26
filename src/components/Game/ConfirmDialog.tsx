import { useEffect } from "react";

import { useFocusTrap } from "./useFocusTrap";
import "./confirmDialog.styles.css";

export interface ConfirmDialogProps {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// A small in-app confirmation dialog, styled to match the rest of the app
// (BoardSettingsModal's backdrop+card pattern) -- used instead of the
// browser's native window.confirm(), which blocks all page JS (and any
// browser automation driving it) until dismissed and looks nothing like the
// app around it.
export default function ConfirmDialog({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Initial focus lands on Cancel, not the destructive Confirm action --
  // an accidental Enter/Space right after the dialog opens (e.g. a
  // double-click's second click landing here) shouldn't be able to
  // complete the destructive action by itself.
  const dialogRef = useFocusTrap<HTMLDivElement>(".confirm-dialog-button--cancel");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-button confirm-dialog-button--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog-button confirm-dialog-button--confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
