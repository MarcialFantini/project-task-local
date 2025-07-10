import React from "react";
// --- CORRECCIÓN: Se ajusta la ruta de importación para que coincida con la estructura del proyecto ---
import { TaskCard } from "./TaskCard";
import type { Task } from "../types";

type Status = "Por Hacer" | "En Progreso" | "Hecho";

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  const columnColors: Record<Status, string> = {
    "Por Hacer": "border-t-4 border-red-500",
    "En Progreso": "border-t-4 border-yellow-500",
    Hecho: "border-t-4 border-green-500",
  };

  return (
    <div
      className={`bg-gray-800/50 rounded-lg p-3 flex-shrink-0 w-full md:w-96 ${columnColors[status]}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h3 className="font-bold text-lg mb-4 text-white flex justify-between items-center">
        {title}
        <span className="bg-gray-700 text-gray-300 text-sm font-semibold rounded-full px-2 py-1">
          {tasks.length}
        </span>
      </h3>
      <div className="h-full space-y-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onUpdateTaskStatus,
}) => {
  const statuses: Status[] = ["Por Hacer", "En Progreso", "Hecho"];

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: Status
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onUpdateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="p-4 md:p-6 flex-grow flex flex-col md:flex-row gap-6 overflow-x-auto">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
};
