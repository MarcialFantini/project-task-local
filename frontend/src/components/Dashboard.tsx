import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { ProjectCard } from "./ProjectCard";
import { Plus } from "lucide-react";
import type { Epic } from "../types";

interface DashboardProps {
  onShowProjectModal: () => void;
  onShowEpicModal: (projectId: string) => void;
  onShowBulkModal: (epic: Epic) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onShowProjectModal,
  onShowEpicModal,
  onShowBulkModal,
}) => {
  const { projects, epics, tasks, actions } = useAppContext();
  const [showCompletedProjects, setShowCompletedProjects] = useState(true);

  const processedProjects = useMemo(() => {
    if (showCompletedProjects) {
      return projects;
    }

    const completedProjectIds = new Set<string>();

    for (const project of projects) {
      const projectEpics = epics.filter((e) => e.projectId === project.id);
      if (projectEpics.length === 0) continue;

      const allEpicsAreDone = projectEpics.every((epic) => {
        const epicTasks = tasks.filter((t) => t.epicId === epic.id);
        if (epicTasks.length === 0) return false;
        return epicTasks.every((t) => t.status === "Hecho");
      });

      if (allEpicsAreDone) {
        completedProjectIds.add(project.id);
      }
    }

    return projects.filter((p) => !completedProjectIds.has(p.id));
  }, [projects, epics, tasks, showCompletedProjects]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Dashboard de Proyectos
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <label
              htmlFor="show-completed-projects"
              className="text-sm cursor-pointer"
            >
              Mostrar completados
            </label>
            <input
              id="show-completed-projects"
              type="checkbox"
              checked={showCompletedProjects}
              onChange={(e) => setShowCompletedProjects(e.target.checked)}
              className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <button
            onClick={onShowProjectModal}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Proyecto
          </button>
        </div>
      </div>
      <div className="space-y-8">
        {processedProjects.length > 0 ? (
          processedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              epics={epics.filter((e) => e.projectId === project.id)}
              tasks={tasks}
              onSelectEpic={actions.selectEpic}
              onShowEpicModal={() => onShowEpicModal(project.id)}
              onShowBulkModal={onShowBulkModal}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-gray-400">No hay proyectos activos.</h3>
            <p className="text-gray-500">
              ¡Crea un nuevo proyecto o muestra los completados!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
