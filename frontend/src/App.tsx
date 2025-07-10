import { useState } from "react";
import { ArrowLeft, Layers, Plus } from "lucide-react";
import { AppProvider, useAppContext } from "./context/AppContext";
import * as api from "./services/apiService";

import { Dashboard } from "./components/Dashboard";
import { KanbanBoard } from "./components/KabanBoard";
import { ProjectModal } from "./components/ProjectModal";
import { EpicModal } from "./components/EpicModal";
import { TaskModal } from "./components/TaskModal";
import { BulkTaskModal } from "./components/BulkTaskModal";
import { UndoToast } from "./components/UndoToast";
import type { Task, TaskDataPayload } from "./types";

function AppContent() {
  const { projects, epics, tasks, selectedEpic, selectEpic, refreshTasks } =
    useAppContext();

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
    await api.saveProject(data);
    setProjectModalOpen(false);
  };

  const handleSaveEpic = async (data: {
    id?: string;
    title: string;
    priority: string;
    description: string;
  }) => {
    if (!editingEpicForProjectId) return;
    await api.saveEpic({ ...data, projectId: editingEpicForProjectId });
    setEpicModalOpen(false);
  };

  const handleSaveTask = async (data: TaskDataPayload) => {
    if (!selectedEpic) return;
    const payload = data.id ? data : { ...data, epicId: selectedEpic.id };
    await api.saveTask(payload);
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    await api.updateTaskStatus(taskId, newStatus);
  };

  const handleCompleteTask = async (taskId: string) => {
    await api.updateTaskStatus(taskId, "Hecho");
  };

  const handleDeleteTask = (taskToDelete: Task) => {
    if (undoTask) {
      clearTimeout(undoTask.timerId);
      api.deleteTask(undoTask.task.id);
    }
    refreshTasks();

    const timerId = setTimeout(() => {
      api.deleteTask(taskToDelete.id);
      setUndoTask(null);
    }, 5000);

    setUndoTask({ task: taskToDelete, timerId });
  };

  const handleUndoDelete = () => {
    if (!undoTask) return;
    clearTimeout(undoTask.timerId);
    refreshTasks();
    setUndoTask(null);
  };

  const handleBulkAddTask = async (bulkText: string) => {
    if (!selectedEpic) return;
    await api.addBulkTasks(selectedEpic.id, bulkText);
    setBulkModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          {selectedEpic && (
            <button
              onClick={() => selectEpic(null)}
              className="p-2 hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft />
            </button>
          )}
          <h1 className="text-2xl font-bold">
            {selectedEpic ? selectedEpic.title : "Dashboard"}
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

      <main className="flex-grow overflow-auto">
        {!selectedEpic ? (
          <Dashboard
            projects={projects}
            epics={epics}
            tasks={tasks}
            onSelectEpic={selectEpic}
            onShowProjectModal={() => setProjectModalOpen(true)}
            onShowEpicModal={(projectId) => {
              setEditingEpicForProjectId(projectId);
              setEpicModalOpen(true);
            }}
            onShowBulkModal={() => setBulkModalOpen(true)}
          />
        ) : (
          <KanbanBoard
            tasks={tasks.filter((t) => t.epicId === selectedEpic.id)}
            onEdit={(task) => {
              setEditingTask(task);
              setTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </main>

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
          onClose={() => {
            clearTimeout(undoTask.timerId);
            setUndoTask(null);
          }}
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
