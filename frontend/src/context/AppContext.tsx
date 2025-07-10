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
import type { Project, Epic, Task } from "../types";

// --- Tipos para el Contexto ---
interface AppContextType {
  projects: Project[];
  epics: Epic[];
  tasks: Task[];
  selectedEpic: Epic | null;
  selectEpic: (epic: Epic | null) => void;
  // Añadimos aquí las acciones que los componentes necesitarán
  refreshProjects: () => void;
  refreshEpics: () => void;
  refreshTasks: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

// --- Provider ---
export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

  // --- Funciones de Fetch específicas y eficientes ---
  const refreshProjects = useCallback(
    () => api.getProjects().then(setProjects).catch(console.error),
    []
  );
  const refreshEpics = useCallback(
    () => api.getEpics().then(setEpics).catch(console.error),
    []
  );
  const refreshTasks = useCallback(
    () => api.getTasks().then(setTasks).catch(console.error),
    []
  );

  useEffect(() => {
    // Carga inicial
    refreshProjects();
    refreshEpics();
    refreshTasks();

    // Suscripciones a Sockets
    socket.on("projects_updated", refreshProjects);
    socket.on("epics_updated", refreshEpics);
    socket.on("tasks_updated", refreshTasks);

    return () => {
      socket.off("projects_updated", refreshProjects);
      socket.off("epics_updated", refreshEpics);
      socket.off("tasks_updated", refreshTasks);
    };
  }, [refreshProjects, refreshEpics, refreshTasks]);

  const value = {
    projects,
    epics,
    tasks,
    selectedEpic,
    selectEpic: setSelectedEpic,
    refreshProjects,
    refreshEpics,
    refreshTasks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// --- Hook personalizado para consumir el contexto fácilmente ---
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
}
