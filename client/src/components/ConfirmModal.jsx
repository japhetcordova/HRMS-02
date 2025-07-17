import React, { useEffect, useRef } from "react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  const cancelBtnRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
      // Trap focus inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" role="document" ref={modalRef}>
        {title && (
          <h2 id="confirm-modal-title" className="text-xl font-bold mb-4">
            {title}
          </h2>
        )}
        <p id="confirm-modal-message" className="mb-6">
          {message}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
