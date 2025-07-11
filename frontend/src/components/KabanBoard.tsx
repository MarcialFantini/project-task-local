import React, { useState, useMemo } from "react";
import { Filter, ArrowUp, ArrowDown, Search } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task } from "../types";

type Status = "Por Hacer" | "En Progreso" | "Hecho";
type SortBy = "priority" | "order";
type SortOrder = "asc" | "desc";

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (taskId: string) => void;
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
  onComplete,
  onDragStart,
}) => {
  const columnColors: Record<Status, string> = {
    "Por Hacer": "border-t-4 border-red-500",
    "En Progreso": "border-t-4 border-yellow-500",
    Hecho: "border-t-4 border-green-500",
  };

  return (
    <div
      className={`bg-gray-800/50 rounded-lg p-3 flex-shrink-0 w-full md:w-96 flex flex-col ${columnColors[status]}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h3 className="font-bold text-lg mb-4 text-white flex justify-between items-center">
        {title}
        <span className="bg-gray-700 text-gray-300 text-sm font-semibold rounded-full px-2 py-1">
          {tasks.length}
        </span>
      </h3>
      <div className="space-y-3 overflow-y-auto pr-1 flex-grow">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
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
  onDelete: (task: Task) => void;
  onComplete: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  onUpdateTaskStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("order");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showCompleted, setShowCompleted] = useState(true);

  const statuses: Status[] = ["Por Hacer", "En Progreso", "Hecho"];
  const visibleStatuses = showCompleted
    ? statuses
    : statuses.filter((s) => s !== "Hecho");

  const processedTasks = useMemo(() => {
    let filteredTasks = tasks;

    if (searchTerm) {
      filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const priorityOrder: Record<string, number> = {
      Alta: 2,
      Media: 1,
      Baja: 0,
    };

    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "priority") {
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        comparison = a.order - b.order;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [tasks, searchTerm, sortBy, sortOrder]);

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
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 p-3 bg-gray-800 rounded-lg flex flex-wrap items-center gap-4">
        <div className="relative flex-grow md:flex-grow-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar tarea..."
            className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-white">
          <Filter size={20} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => {
              const newSortBy = e.target.value as SortBy;
              setSortBy(newSortBy);
              setSortOrder(newSortBy === "order" ? "asc" : "desc");
            }}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="order">Orden</option>
            <option value="priority">Prioridad</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sortOrder === "asc" ? (
              <ArrowUp size={20} />
            ) : (
              <ArrowDown size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-white">
          <label htmlFor="show-completed" className="text-sm cursor-pointer">
            Mostrar completadas
          </label>
          <input
            id="show-completed"
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-x-auto">
        {visibleStatuses.map((status) => (
          <KanbanColumn
            key={status}
            title={status}
            status={status}
            tasks={processedTasks.filter((t) => t.status === status)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};
