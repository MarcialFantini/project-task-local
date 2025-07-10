export interface Project {
  id: string;
  title: string;
  description?: string | null;
}
export interface Epic {
  id: string;
  title: string;
  priority: string;
  description?: string | null;
  projectId: string;
}
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "Por Hacer" | "En Progreso" | "Hecho";
  order: number;
  epicId: string;
  priority: string;
}
export interface TaskDataPayload {
  id?: string;
  title: string;
  description?: string | null;
}
export interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (taskData: TaskDataPayload) => void;
  isNew: boolean;
}

export interface EpicListProps {
  epics: Epic[];
  onSelectEpic: (epicId: string) => void;
  onShowEpicModal: (epic: Epic | null) => void;
  onShowBulkModal: (epicId: string) => void;
}
// No necesita conocer el projectId, ya que eso lo maneja el componente padre (App.tsx).
interface EpicModalPayload {
  id?: string;
  title: string;
  priority: string;
  description: string;
}

export interface EpicModalProps {
  epic: Epic | null;
  onClose: () => void;
  // La función onSave ahora espera el tipo de payload que definimos arriba.
  onSave: (epicData: EpicModalPayload) => void;
}
