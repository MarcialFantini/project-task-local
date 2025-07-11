import React, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import {
  Briefcase,
  Layers,
  CheckCircle,
  ListTodo,
  Zap,
  ShieldAlert,
  BarChart3,
  ChevronDown,
  ChevronsUp,
  ChevronUp,
} from "lucide-react";
import type { Project, Epic, Task } from "../types";

// Pequeño componente reutilizable para las tarjetas de estadísticas
const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}> = ({ icon, title, value, color }) => (
  <div
    className={`bg-gray-800/50 p-4 rounded-lg flex items-center gap-4 border-l-4 ${color}`}
  >
    {icon}
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// Componente para la fila de resumen de cada proyecto
const ProjectSummaryRow: React.FC<{
  project: Project;
  epics: Epic[];
  tasks: Task[];
}> = ({ project, epics, tasks }) => {
  const projectTasks = tasks.filter((task) =>
    epics.some((epic) => epic.id === task.epicId)
  );
  const completedTasks = projectTasks.filter(
    (task) => task.status === "Hecho"
  ).length;
  const progress =
    projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  return (
    <div className="bg-gray-800 hover:bg-gray-700/80 p-3 rounded-md grid grid-cols-4 gap-4 items-center">
      <p className="font-semibold col-span-2">{project.title}</p>
      <p className="text-center">{epics.length}</p>
      <div className="w-full bg-gray-600 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export const GeneralDashboard: React.FC = () => {
  const { projects, epics, tasks } = useAppContext();

  const stats = useMemo(() => {
    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Task["status"], number>);

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<Task["priority"], number>);

    return { tasksByStatus, tasksByPriority };
  }, [tasks]);

  return (
    <div className="p-4 md:p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold">Dashboard General</h1>

      {/* Sección de KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Briefcase size={32} />}
          title="Proyectos Totales"
          value={projects.length}
          color="border-blue-500"
        />
        <StatCard
          icon={<Layers size={32} />}
          title="Épicas Totales"
          value={epics.length}
          color="border-purple-500"
        />
        <StatCard
          icon={<ListTodo size={32} />}
          title="Tareas Totales"
          value={tasks.length}
          color="border-teal-500"
        />
        <StatCard
          icon={<CheckCircle size={32} />}
          title="Tareas Completadas"
          value={stats.tasksByStatus["Hecho"] || 0}
          color="border-green-500"
        />
      </div>

      {/* Sección de Desglose de Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
            <BarChart3 />
            Desglose por Estado
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-red-400">Por Hacer</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByStatus["Por Hacer"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400">En Progreso</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByStatus["En Progreso"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-400">Hecho</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByStatus["Hecho"] || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
            <ShieldAlert />
            Desglose por Prioridad
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <ChevronsUp className="text-red-500" size={16} />
                Alta
              </span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByPriority["Alta"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <ChevronUp className="text-yellow-500" size={16} />
                Media
              </span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByPriority["Media"] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <ChevronDown className="text-blue-500" size={16} />
                Baja
              </span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded-md">
                {stats.tasksByPriority["Baja"] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Resumen de Proyectos */}
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Zap />
          Resumen de Proyectos
        </h2>
        <div className="grid grid-cols-4 gap-4 font-bold text-gray-400 mb-2 px-3">
          <span className="col-span-2">Nombre del Proyecto</span>
          <span className="text-center">Épicas</span>
          <span>Progreso</span>
        </div>
        <div className="space-y-2">
          {projects.map((p) => (
            <ProjectSummaryRow
              key={p.id}
              project={p}
              epics={epics.filter((e) => e.projectId === p.id)}
              tasks={tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
