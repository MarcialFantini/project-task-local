import React from "react";
import { Edit, Trash2, ChevronUp, ChevronsUp, ChevronDown } from "lucide-react";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const PriorityIndicator: React.FC<{ priority: string }> = ({ priority }) => {
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
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-gray-800 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold text-base text-gray-100 break-words pr-2">
          {task.title}
        </p>
        <div className="flex-shrink-0 flex items-center space-x-1">
          <PriorityIndicator priority={task.priority} />
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-400 p-1"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-400 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-400 mt-2 break-words">
          {task.description}
        </p>
      )}
    </div>
  );
};
