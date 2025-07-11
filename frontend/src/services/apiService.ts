import type { Project, Epic, Task, TaskDataPayload } from "../types";

// Error personalizado para tener un formato de error predecible
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_URL = "http://localhost:3000/api";

// Helper de fetch refactorizado para manejar errores y respuestas
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // Si la respuesta no es exitosa, procesamos y lanzamos el error
  if (!response.ok) {
    // Intentamos obtener el mensaje de error del cuerpo de la respuesta
    const errorData = await response.json().catch(() => ({
      message: `Error ${response.status}: ${response.statusText}`,
    }));
    throw new ApiError(
      response.status,
      errorData.message || "Ocurrió un error desconocido."
    );
  }

  // Si la respuesta es 204 No Content (como en un DELETE), no hay cuerpo que parsear
  if (response.status === 204) {
    return;
  }

  return response.json();
};

// --- Las funciones de la API ahora son más limpias y consistentes ---

export const getProjects = (): Promise<Project[]> => apiFetch("/projects");
export const getEpics = (): Promise<Epic[]> => apiFetch("/epics");
export const getTasks = (): Promise<Task[]> => apiFetch("/tasks");

export const saveProject = (data: {
  title: string;
  description: string;
}): Promise<Project> => {
  return apiFetch("/projects", { method: "POST", body: JSON.stringify(data) });
};

export const saveEpic = (data: {
  title: string;
  priority: string;
  description: string;
  projectId: string;
}): Promise<Epic> => {
  return apiFetch("/epics", { method: "POST", body: JSON.stringify(data) });
};

export const saveTask = (taskData: TaskDataPayload): Promise<Task> => {
  const { id, ...data } = taskData;
  const method = id ? "PUT" : "POST";
  const url = id ? `/tasks/${id}` : "/tasks";
  return apiFetch(url, { method, body: JSON.stringify(data) });
};

export const updateTaskStatus = (
  taskId: string,
  status: Task["status"]
): Promise<Task> => {
  return apiFetch(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const deleteTask = (taskId: string): Promise<void> => {
  return apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
};

export const addBulkTasks = (
  epicId: string,
  bulkText: string
): Promise<{ message: string }> => {
  return apiFetch(`/tasks/bulk/epic/${epicId}`, {
    method: "POST",
    body: JSON.stringify({ bulkText }),
  });
};
