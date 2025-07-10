import React from "react";
import { CheckCircle, X } from "lucide-react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onClose,
}) => {
  return (
    <div className="fixed bottom-5 right-5 bg-gray-900 border border-green-500 text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 z-50 animate-fade-in-up">
      <CheckCircle className="text-green-500" size={24} />
      <div className="flex-grow">
        <p>{message}</p>
        <button
          onClick={onUndo}
          className="text-blue-400 hover:underline font-bold"
        >
          Deshacer
        </button>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-white">
        <X size={20} />
      </button>
    </div>
  );
};
