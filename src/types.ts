export type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  tags: string[];
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  schemaVersion: 1;
  tasks: Task[];
};
