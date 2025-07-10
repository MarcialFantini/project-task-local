import React, { useState } from "react";
import { X } from "lucide-react";
import type { Task } from "../types";
// Asumimos que estos tipos se exportan desde App.tsx o un archivo de tipos

// Se define un tipo para los datos que el modal puede guardar
export interface TaskDataPayload {
  id?: string;
  title: string;
  description?: string | null;
  priority: string;
}

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (taskData: TaskDataPayload) => void;
  isNew: boolean;
}

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
  // --- ESTADO AÑADIDO ---
  // Se añade un estado para manejar la prioridad de la tarea
  const [priority, setPriority] = useState(task?.priority || "Media");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Se incluye la prioridad en el objeto que se guarda
      onSave({ id: task?.id, title, description, priority });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">
          {isNew ? "Nueva Tarea" : "Editar Tarea"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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

          {/* --- CAMPO DE SELECCIÓN DE PRIORIDAD AÑADIDO --- */}
          <div>
            <label
              htmlFor="task-priority"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Prioridad
            </label>
            <select
              id="task-priority"
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
          <div className="flex items-center justify-end pt-4">
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
