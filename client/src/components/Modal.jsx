import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >&times;</button>
        {title && <h2 id="modal-title" className="text-xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
