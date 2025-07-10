import { Layers, Plus } from "lucide-react";
import type { Project, Epic, Task } from "../types";
import { ProgressBar } from "./ProgressBar";

interface ProjectCardProps {
  project: Project;
  epics: Epic[];
  tasks: Task[];
  onShowEpicModal: (projectId: string) => void;
  onSelectEpic: (epic: Epic) => void;
  // --- PROP AÑADIDA ---
  onShowBulkModal: (epic: Epic) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  epics,
  tasks,
  onShowEpicModal,
  onSelectEpic,
  onShowBulkModal, // Se recibe la nueva prop
}) => {
  const getProgress = (epicId?: string) => {
    const relevantTasks = epicId
      ? tasks.filter((t) => t.epicId === epicId)
      : tasks.filter((t) => epics.some((e) => e.id === t.epicId));

    if (relevantTasks.length === 0) return 0;
    const completedTasks = relevantTasks.filter(
      (t) => t.status === "Hecho"
    ).length;
    return Math.round((completedTasks / relevantTasks.length) * 100);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "bg-red-500/20 text-red-300";
      case "baja":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-yellow-500/20 text-yellow-300";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{project.title}</h2>
        <div className="w-1/4">
          <ProgressBar progress={getProgress()} />
        </div>
      </div>
      <p className="text-gray-400 mb-6">
        {project.description || "Sin descripción para este proyecto."}
      </p>

      <div className="space-y-4">
        {epics.map((epic) => (
          <div
            key={epic.id}
            className="bg-gray-900/70 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <div
              className="w-2/3 cursor-pointer"
              onClick={() => onSelectEpic(epic)}
            >
              <p className="font-semibold text-white">{epic.title}</p>
              <p className="text-sm text-gray-500">
                {epic.description || "Sin descripción"}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full ${getPriorityClass(
                epic.priority
              )}`}
            >
              {epic.priority}
            </span>
            <div className="w-1/4 flex items-center gap-4">
              <ProgressBar progress={getProgress(epic.id)} />
              {/* --- BOTÓN AÑADIDO --- */}
              <button
                onClick={() => onShowBulkModal(epic)}
                className="text-gray-400 hover:text-white"
                title="Añadir tareas en bloque"
              >
                <Layers size={18} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => onShowEpicModal(project.id)}
          className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:bg-gray-700 hover:text-white"
        >
          <Plus size={16} className="mr-2" /> Añadir Épica
        </button>
      </div>
    </div>
  );
};
