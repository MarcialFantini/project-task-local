// --- INTERFAZ CORREGIDA ---
// Se define un tipo que representa exactamente lo que el modal puede guardar.

import { X } from "lucide-react";
import { useState } from "react";
import type { EpicModalProps } from "../types";

export const EpicModal: React.FC<EpicModalProps> = ({
  epic,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(epic?.title || "");
  const [priority, setPriority] = useState(epic?.priority || "Media");
  const [description, setDescription] = useState(epic?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Se crea un objeto que coincide con el tipo EpicModalPayload.
      onSave({ id: epic?.id, title, priority, description });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          {epic ? "Editar Épica" : "Nueva Épica"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="epic-title"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Título de la Épica
            </label>
            <input
              id="epic-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="epic-priority"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Prioridad
            </label>
            <select
              id="epic-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500"
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="epic-description"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="epic-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
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
              Guardar Épica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
