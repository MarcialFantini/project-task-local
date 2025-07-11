import { ChevronRight, Plus, Layers } from "lucide-react";
import type { Project, Epic, Task } from "../types";

interface ProjectCardProps {
  project: Project;
  epics: Epic[];
  tasks: Task[];
  onSelectEpic: (epic: Epic) => void;
  onShowEpicModal: () => void;
  onShowBulkModal: (epic: Epic) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  epics,
  tasks,
  onSelectEpic,
  onShowEpicModal,
  onShowBulkModal,
}) => {
  const handleBulkClick = (e: React.MouseEvent, epic: Epic) => {
    e.stopPropagation();
    onShowBulkModal(epic);
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{project.title}</h2>
        <button
          onClick={onShowEpicModal}
          className="flex items-center text-sm bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold py-1 px-3 rounded-lg"
        >
          <Plus size={16} className="mr-1" />
          Nueva Épica
        </button>
      </div>
      <div className="space-y-2">
        {epics.map((epic) => {
          const epicTasks = tasks.filter((t) => t.epicId === epic.id);
          const completedTasks = epicTasks.filter(
            (t) => t.status === "Hecho"
          ).length;
          const progress =
            epicTasks.length > 0
              ? (completedTasks / epicTasks.length) * 100
              : 0;

          return (
            <div
              key={epic.id}
              onClick={() => onSelectEpic(epic)}
              className="bg-gray-700/50 hover:bg-gray-700 p-3 rounded-lg cursor-pointer flex justify-between items-center group"
            >
              <div className="flex-grow">
                <p className="font-semibold">{epic.title}</p>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center pl-4">
                <span className="text-sm text-gray-400">
                  {completedTasks}/{epicTasks.length}
                </span>
                <button
                  onClick={(e) => handleBulkClick(e, epic)}
                  title="Añadir tareas en bloque"
                  className="p-2 text-gray-400 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Layers size={18} />
                </button>
                <ChevronRight size={20} className="text-gray-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
