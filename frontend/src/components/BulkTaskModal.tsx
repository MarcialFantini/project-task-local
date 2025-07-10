import React, { useState } from "react";
import { X } from "lucide-react";

interface BulkTaskModalProps {
  onClose: () => void;
  onSave: (bulkText: string) => void;
}

export const BulkTaskModal: React.FC<BulkTaskModalProps> = ({
  onClose,
  onSave,
}) => {
  const [bulkText, setBulkText] = useState("");
  // --- TEXTO ACTUALIZADO ---
  const placeholderText = `Ejemplo:\nDiseñar nuevo logo - Hacerlo moderno y minimalista - Alta\nDesarrollar API de usuarios - Media\nCorregir bug en login`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkText.trim()) {
      onSave(bulkText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Añadir Tareas en Bloque</h2>
        <p className="text-gray-400 mb-4">
          Escribe tareas, una por línea. Formato: `Título - Descripción
          (opcional) - Prioridad (opcional)`.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-64 bg-gray-900 text-white p-4 rounded-md border border-gray-700 focus:ring-2 focus:ring-indigo-500 font-mono"
            placeholder={placeholderText}
          />
          <div className="flex items-center justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Añadir Tareas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
