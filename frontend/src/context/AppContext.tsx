import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import * as api from "../services/apiService";
import { ApiError } from "../services/apiService";
import type { Project, Epic, Task, TaskDataPayload } from "../types";

interface AppState {
  projects: Project[];
  epics: Epic[];
  tasks: Task[];
  selectedEpic: Epic | null;
  loading: boolean;
  error: string | null;
}

interface AppActions {
  selectEpic: (epic: Epic | null) => void;
  clearError: () => void;
  saveProject: (data: { title: string; description: string }) => Promise<void>;
  saveEpic: (data: {
    title: string;
    priority: string;
    description: string;
    projectId: string;
  }) => Promise<void>;
  saveTask: (data: TaskDataPayload) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addBulkTasks: (epicId: string, bulkText: string) => Promise<void>;
}

interface AppContextType extends AppState {
  actions: AppActions;
}

const AppContext = createContext<AppContextType | null>(null);

const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    projects: [],
    epics: [],
    tasks: [],
    selectedEpic: null,
    loading: true,
    error: null,
  });

  const handleError = (err: unknown) => {
    if (err instanceof ApiError) {
      setState((s) => ({ ...s, error: err.message }));
    } else if (err instanceof Error) {
      setState((s) => ({ ...s, error: err.message }));
    } else {
      setState((s) => ({ ...s, error: "Ocurrió un error inesperado." }));
    }
  };

  const loadInitialData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const [projects, epics, tasks] = await Promise.all([
        api.getProjects(),
        api.getEpics(),
        api.getTasks(),
      ]);
      setState((s) => ({ ...s, projects, epics, tasks, loading: false }));
    } catch (err) {
      handleError(err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    const handleProjectCreated = (newProject: Project) =>
      setState((s) => ({ ...s, projects: [...s.projects, newProject] }));
    const handleProjectUpdated = (updatedProject: Project) =>
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        ),
      }));
    const handleProjectDeleted = ({ id }: { id: string }) =>
      setState((s) => ({
        ...s,
        projects: s.projects.filter((p) => p.id !== id),
      }));

    const handleEpicCreated = (newEpic: Epic) =>
      setState((s) => ({ ...s, epics: [...s.epics, newEpic] }));
    const handleEpicUpdated = (updatedEpic: Epic) =>
      setState((s) => ({
        ...s,
        epics: s.epics.map((e) => (e.id === updatedEpic.id ? updatedEpic : e)),
      }));
    const handleEpicDeleted = ({ id }: { id: string }) =>
      setState((s) => ({ ...s, epics: s.epics.filter((e) => e.id !== id) }));

    const handleTaskCreated = (newTask: Task) =>
      setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }));
    const handleTaskUpdated = (updatedTask: Task) =>
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      }));
    const handleTaskDeleted = ({ id }: { id: string }) =>
      setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

    socket.on("project:created", handleProjectCreated);
    socket.on("project:updated", handleProjectUpdated);
    socket.on("project:deleted", handleProjectDeleted);
    socket.on("epic:created", handleEpicCreated);
    socket.on("epic:updated", handleEpicUpdated);
    socket.on("epic:deleted", handleEpicDeleted);
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("tasks_updated", loadInitialData);

    return () => {
      socket.off("project:created");
      socket.off("project:updated");
      socket.off("project:deleted");
      socket.off("epic:created");
      socket.off("epic:updated");
      socket.off("epic:deleted");
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("tasks_updated");
    };
  }, [loadInitialData]);

  const actions: AppActions = {
    selectEpic: (epic) => setState((s) => ({ ...s, selectedEpic: epic })),
    clearError: () => setState((s) => ({ ...s, error: null })),
    saveProject: async (data) => {
      try {
        await api.saveProject(data);
      } catch (err) {
        handleError(err);
      }
    },
    saveEpic: async (data) => {
      try {
        await api.saveEpic(data);
      } catch (err) {
        handleError(err);
      }
    },
    saveTask: async (data) => {
      try {
        await api.saveTask(data);
      } catch (err) {
        handleError(err);
      }
    },
    updateTaskStatus: async (taskId, status) => {
      try {
        await api.updateTaskStatus(taskId, status);
      } catch (err) {
        handleError(err);
      }
    },
    deleteTask: async (taskId) => {
      setState((s) => ({
        ...s,
        tasks: s.tasks.filter((t) => t.id !== taskId),
      }));
      try {
        await api.deleteTask(taskId);
      } catch (err) {
        handleError(err);
      }
    },
    addBulkTasks: async (epicId, bulkText) => {
      try {
        await api.addBulkTasks(epicId, bulkText);
      } catch (err) {
        handleError(err);
      }
    },
  };

  return (
    <AppContext.Provider value={{ ...state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
}
