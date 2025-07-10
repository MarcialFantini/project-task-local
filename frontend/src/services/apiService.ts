import type { Project, Epic, Task, TaskDataPayload } from "../types";

const API_URL = "http://localhost:3000/api";

// Helper para simplificar las llamadas fetch
const apiFetch = (url: string, options: RequestInit = {}) => {
  return fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
};

// --- Funciones de la API ---

export const getProjects = (): Promise<Project[]> =>
  apiFetch("/projects").then((res) => res.json());
export const getEpics = (): Promise<Epic[]> =>
  apiFetch("/epics").then((res) => res.json());
export const getTasks = (): Promise<Task[]> =>
  apiFetch("/tasks").then((res) => res.json());

export const saveProject = (data: { title: string; description: string }) => {
  return apiFetch("/projects", { method: "POST", body: JSON.stringify(data) });
};

export const saveEpic = (data: {
  title: string;
  priority: string;
  description: string;
  projectId: string;
}) => {
  return apiFetch("/epics", { method: "POST", body: JSON.stringify(data) });
};

export const saveTask = (taskData: TaskDataPayload) => {
  const { id, ...data } = taskData;
  const method = id ? "PUT" : "POST";
  const url = id ? `/tasks/${id}` : "/tasks";
  return apiFetch(url, { method, body: JSON.stringify(data) });
};

export const updateTaskStatus = (taskId: string, status: Task["status"]) => {
  return apiFetch(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const deleteTask = (taskId: string) => {
  return apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
};

export const addBulkTasks = (epicId: string, bulkText: string) => {
  // Usamos la URL refactorizada del backend
  return apiFetch(`/tasks/bulk/epic/${epicId}`, {
    method: "POST",
    body: JSON.stringify({ bulkText }),
  });
};
