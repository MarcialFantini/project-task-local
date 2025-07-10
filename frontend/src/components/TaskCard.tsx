import React from "react";
import {
  Edit,
  Trash2,
  CheckSquare,
  ChevronUp,
  ChevronsUp,
  ChevronDown,
} from "lucide-react";
import type { Task } from "../types";

// Interfaz de props actualizada para incluir la nueva acción
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void; // Ahora pasamos la tarea completa para poder deshacer
  onComplete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

// Componente de indicador de prioridad (sin cambios, pero incluido para contexto)
const PriorityIndicator: React.FC<{ priority: string }> = ({ priority }) => {
  // ... (código del indicador sin cambios)
  switch (priority?.toLowerCase()) {
    case "alta":
      return (
        <span title="Prioridad Alta">
          <ChevronsUp className="text-red-500" size={16} />
        </span>
      );
    case "baja":
      return (
        <span title="Prioridad Baja">
          <ChevronDown className="text-blue-500" size={16} />
        </span>
      );
    default:
      return (
        <span title="Prioridad Media">
          <ChevronUp className="text-yellow-500" size={16} />
        </span>
      );
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      // 'group' permite mostrar los botones al hacer hover sobre la tarjeta
      className="bg-gray-800 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing group relative"
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold text-base text-gray-100 break-words pr-2">
          {task.title}
        </p>
        <div className="flex-shrink-0">
          <PriorityIndicator priority={task.priority} />
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-400 mt-2 break-words">
          {task.description}
        </p>
      )}

      {/* Los botones de acción ahora aparecen al hacer hover */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-gray-900/50 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {task.status !== "Hecho" && (
          <button
            onClick={() => onComplete(task.id)}
            className="text-gray-400 hover:text-green-400 p-1"
            title="Completar tarea"
          >
            <CheckSquare size={16} />
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="text-gray-400 hover:text-blue-400 p-1"
          title="Editar tarea"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-gray-400 hover:text-red-400 p-1"
          title="Eliminar tarea"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
