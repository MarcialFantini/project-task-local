import React from "react";
import { ProjectCard } from "./ProjectCard";
import { Plus } from "lucide-react";
import type { Project, Epic, Task } from "../types";

interface DashboardProps {
  projects: Project[];
  epics: Epic[];
  tasks: Task[];
  onShowProjectModal: () => void;
  onShowEpicModal: (projectId: string) => void;
  onSelectEpic: (epic: Epic) => void;
  // --- PROP AÑADIDA ---
  onShowBulkModal: (epic: Epic) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  epics,
  tasks,
  onShowProjectModal,
  onShowEpicModal,
  onSelectEpic,
  onShowBulkModal,
}) => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Dashboard de Proyectos
        </h1>
        <button
          onClick={onShowProjectModal}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Proyecto
        </button>
      </div>
      <div className="space-y-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              epics={epics.filter((e) => e.projectId === project.id)}
              tasks={tasks}
              onShowEpicModal={onShowEpicModal}
              onSelectEpic={onSelectEpic}
              // --- PROP PASADA AL HIJO ---
              onShowBulkModal={onShowBulkModal}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-gray-400">No hay proyectos todavía.</h3>
            <p className="text-gray-500">
              ¡Crea tu primer proyecto para empezar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
