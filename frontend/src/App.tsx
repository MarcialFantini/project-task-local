import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { ArrowLeft, Layers, Plus } from "lucide-react";

import { EpicModal } from "./components/EpicModal";
import { BulkTaskModal } from "./components/BulkTaskModal";
import { Dashboard } from "./components/Dashboard";
import { ProjectModal } from "./components/ProjectModal";
import { KanbanBoard } from "./components/KabanBoard";
import type { Project, Epic, Task, TaskDataPayload } from "./types";
import { TaskModal } from "./components/TaskModal";

// --- Constantes y Socket ---
const API_URL = "http://localhost:3000/api";
const SOCKET_URL = "http://localhost:3000";
const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

function App() {
  // --- Estados ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEpicModalOpen, setEpicModalOpen] = useState(false);
  const [editingEpicForProjectId, setEditingEpicForProjectId] = useState<
    string | null
  >(null);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);

  // --- Funciones de Fetch ---
  const fetchAll = useCallback(async () => {
    try {
      const [projectsRes, epicsRes, tasksRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/epics`),
        fetch(`${API_URL}/tasks`),
      ]);
      setProjects(await projectsRes.json());
      setEpics(await epicsRes.json());
      setTasks(await tasksRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // --- Efecto Principal ---
  useEffect(() => {
    fetchAll();
    socket.on("projects_updated", fetchAll);
    socket.on("epics_updated", fetchAll);
    socket.on("tasks_updated", fetchAll);

    return () => {
      socket.off("projects_updated", fetchAll);
      socket.off("epics_updated", fetchAll);
      socket.off("tasks_updated", fetchAll);
    };
  }, [fetchAll]);

  // --- Manejadores de Modales y Guardado ---
  const handleShowBulkModal = (epic: Epic) => {
    setSelectedEpic(epic);
    setBulkModalOpen(true);
  };

  const handleSaveEpic = async (epicData: {
    id?: string;
    title: string;
    priority: string;
    description: string;
  }) => {
    if (!editingEpicForProjectId) return;
    await fetch(`${API_URL}/epics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...epicData, projectId: editingEpicForProjectId }),
    });
    setEpicModalOpen(false);
    setEditingEpicForProjectId(null);
  };

  const handleSaveTask = async (taskData: TaskDataPayload) => {
    if (!selectedEpic) return;
    const { id, ...data } = taskData;
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;
    const body = id
      ? JSON.stringify(data)
      : JSON.stringify({ ...data, epicId: selectedEpic.id });
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    setTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleBulkAddTask = async (bulkText: string) => {
    if (!selectedEpic) return;
    await fetch(`${API_URL}/epics/${selectedEpic.id}/bulk-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulkText }),
    });
    setBulkModalOpen(false);
    await fetchAll();
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("¿Eliminar esta tarea?")) {
      await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" });
    }
  };

  const handleSaveProject = async (projectData: {
    title: string;
    description: string;
  }) => {
    await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });
    setProjectModalOpen(false);
  };

  // --- Renderizado ---
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          {selectedEpic && (
            <button
              onClick={() => setSelectedEpic(null)}
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
              onClick={() => handleShowBulkModal(selectedEpic)}
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
            onShowProjectModal={() => setProjectModalOpen(true)}
            onShowEpicModal={(projectId) => {
              setEditingEpicForProjectId(projectId);
              setEpicModalOpen(true);
            }}
            onSelectEpic={(epic) => setSelectedEpic(epic)}
            // --- Se pasa la función al Dashboard ---
            onShowBulkModal={handleShowBulkModal}
          />
        ) : (
          <KanbanBoard
            tasks={tasks.filter((t) => t.epicId === selectedEpic.id)}
            onEdit={(task) => {
              setEditingTask(task);
              setTaskModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </main>

      {/* Modales */}
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
          onClose={() => setTaskModalOpen(false)}
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
    </div>
  );
}

export default App;
