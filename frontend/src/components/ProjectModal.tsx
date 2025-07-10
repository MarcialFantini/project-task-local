import React, { useState } from "react";
import { X } from "lucide-react";

interface ProjectModalProps {
  onClose: () => void;
  onSave: (projectData: { title: string; description: string }) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, description });
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
        <h2 className="text-2xl font-bold mb-6">Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="proj-title"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Título del Proyecto
            </label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="proj-desc"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 bg-gray-700 text-white p-2 rounded border border-gray-600"
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
              Guardar Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
