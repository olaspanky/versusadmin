import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
     <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-11/12 max-w-2xl md:max-w-4xl h-3/4 md:h-5/6 overflow-y-auto">
  <button onClick={onClose} className="absolute top-4 right-4 text-lg font-bold">
    &times;
  </button>
  {children}
</div>
    </div>
  );
};

export default Modal;