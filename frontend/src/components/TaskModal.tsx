import React, { useState } from "react";
import { X } from "lucide-react";
import type { TaskModalProps } from "../types";

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  onSave,
  isNew,
}) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(
    task ? task.description || "" : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ id: task?.id, title, description });
      onClose();
    }
  };

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {isNew ? "Nueva Tarea" : "Editar Tarea"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            ></textarea>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
