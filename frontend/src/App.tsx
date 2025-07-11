import { useState } from "react";
import { ArrowLeft, Layers, Plus } from "lucide-react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Dashboard } from "./components/Dashboard";
import { KanbanBoard } from "./components/KabanBoard";
import { ProjectModal } from "./components/ProjectModal";
import { EpicModal } from "./components/EpicModal";
import { TaskModal } from "./components/TaskModal";
import { BulkTaskModal } from "./components/BulkTaskModal";
import { UndoToast } from "./components/UndoToast";
import { GeneralDashboard } from "./components/GeneralDashboard";
import type { Epic, Task, TaskDataPayload } from "./types";

function AppContent() {
  const { tasks, selectedEpic, loading, actions } = useAppContext();
  const [view, setView] = useState<"projects" | "general">("projects");

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isEpicModalOpen, setEpicModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEpicForProjectId, setEditingEpicForProjectId] = useState<
    string | null
  >(null);
  const [undoTask, setUndoTask] = useState<{
    task: Task;
    timerId: number;
  } | null>(null);

  const handleSaveProject = async (data: {
    title: string;
    description: string;
  }) => {
    await actions.saveProject(data);
    setProjectModalOpen(false);
  };

  const handleSaveEpic = async (data: {
    id?: string;
    title: string;
    priority: string;
    description: string;
  }) => {
    if (!editingEpicForProjectId) return;
    await actions.saveEpic({ ...data, projectId: editingEpicForProjectId });
    setEpicModalOpen(false);
  };

  const handleSaveTask = async (data: TaskDataPayload) => {
    if (!selectedEpic && !data.id) return;
    const payload = data.id ? data : { ...data, epicId: selectedEpic!.id };
    await actions.saveTask(payload);
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleBulkAddTask = async (bulkText: string) => {
    if (!selectedEpic) return;
    await actions.addBulkTasks(selectedEpic.id, bulkText);
    setBulkModalOpen(false);
  };

  const handleShowBulkModal = (epic: Epic) => {
    actions.selectEpic(epic);
    setBulkModalOpen(true);
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    if (undoTask) {
      clearTimeout(undoTask.timerId);
      actions.deleteTask(undoTask.task.id);
    }
    actions.deleteTask(taskToDelete.id); // Optimistic UI update from context
    const timerId = setTimeout(() => {
      setUndoTask(null);
    }, 5000);
    setUndoTask({ task: taskToDelete, timerId });
  };

  const handleUndoDelete = () => {
    if (!undoTask) return;
    clearTimeout(undoTask.timerId);
    // The socket event will restore the task, we just need to refresh
    // This is a placeholder for a more direct state restoration if needed
    window.location.reload(); // Simple but effective way to re-sync state
    setUndoTask(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Cargando...
      </div>
    );
  }

  let currentView;
  if (selectedEpic) {
    currentView = (
      <KanbanBoard
        tasks={tasks.filter((t) => t.epicId === selectedEpic.id)}
        onEdit={(task) => {
          setEditingTask(task);
          setTaskModalOpen(true);
        }}
        onDelete={handleDeleteTask}
        onComplete={(taskId) => actions.updateTaskStatus(taskId, "Hecho")}
        onUpdateTaskStatus={actions.updateTaskStatus}
      />
    );
  } else {
    switch (view) {
      case "general":
        currentView = <GeneralDashboard />;
        break;
      case "projects":
      default:
        currentView = (
          <Dashboard
            onShowProjectModal={() => setProjectModalOpen(true)}
            onShowEpicModal={(projectId) => {
              setEditingEpicForProjectId(projectId);
              setEpicModalOpen(true);
            }}
            onShowBulkModal={handleShowBulkModal}
          />
        );
        break;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          {selectedEpic && (
            <button
              onClick={() => actions.selectEpic(null)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft />
            </button>
          )}
          {!selectedEpic && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("projects")}
                className={`px-3 py-1 rounded-md text-sm font-semibold ${
                  view === "projects"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Proyectos
              </button>
              <button
                onClick={() => setView("general")}
                className={`px-3 py-1 rounded-md text-sm font-semibold ${
                  view === "general"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                General
              </button>
            </div>
          )}
          <h1 className="text-2xl font-bold">
            {selectedEpic ? selectedEpic.title : ""}
          </h1>
        </div>
        {selectedEpic && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Layers size={20} className="mr-2" /> Añadir en Bloque
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
              }}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              <Plus size={20} className="mr-2" /> Nueva Tarea
            </button>
          </div>
        )}
      </header>

      <main className="flex-grow overflow-auto">{currentView}</main>

      {isProjectModalOpen && (
        <ProjectModal
          onClose={() => setProjectModalOpen(false)}
          onSave={handleSaveProject}
        />
      )}
      {isEpicModalOpen && (
        <EpicModal
          epic={null}
          onClose={() => setEpicModalOpen(false)}
          onSave={handleSaveEpic}
        />
      )}
      {isTaskModalOpen && selectedEpic && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          isNew={!editingTask}
        />
      )}
      {isBulkModalOpen && selectedEpic && (
        <BulkTaskModal
          onClose={() => setBulkModalOpen(false)}
          onSave={handleBulkAddTask}
        />
      )}
      {undoTask && (
        <UndoToast
          message={`Tarea "${undoTask.task.title}" eliminada.`}
          onUndo={handleUndoDelete}
          onClose={() => setUndoTask(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
