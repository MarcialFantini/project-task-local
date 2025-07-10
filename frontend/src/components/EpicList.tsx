import React from "react";
import { Plus, Edit } from "lucide-react";
import type { EpicListProps } from "../types";

export const EpicList: React.FC<EpicListProps> = ({
  epics,
  onSelectEpic,
  onShowEpicModal,
  onShowBulkModal,
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "border-l-4 border-red-500";
      case "baja":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-yellow-500";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Proyectos / Épicas</h1>
        <button
          onClick={() => onShowEpicModal(null)}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
        >
          <Plus size={20} className="mr-2" />
          Nueva Épica
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {epics.map((epic) => (
          <div
            key={epic.id}
            className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${getPriorityClass(
              epic.priority
            )}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2
                  className="text-xl font-bold text-white cursor-pointer hover:text-indigo-400"
                  onClick={() => onSelectEpic(epic.id)}
                >
                  {epic.title}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full text-white ${getPriorityClass(
                    epic.priority
                  )
                    .replace("border-l-4", "bg")
                    .replace("-500", "-500/30")}`}
                >
                  {epic.priority}
                </span>
              </div>
              <p className="text-gray-400 mt-2 h-12 overflow-hidden">
                {epic.description || "Sin descripción."}
              </p>
            </div>
            <div className="bg-gray-800/50 px-6 py-3 flex justify-end space-x-3">
              <button
                onClick={() => onShowBulkModal(epic.id)}
                className="text-gray-300 hover:text-white"
              >
                Añadir Tareas en Bloque
              </button>
              <button
                onClick={() => onShowEpicModal(epic)}
                className="text-gray-300 hover:text-white"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
