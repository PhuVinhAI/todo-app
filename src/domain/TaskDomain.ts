import type { Task } from "../types";

export function createTask(
  title: string,
  now: string = new Date().toISOString(),
  id: string = crypto.randomUUID(),
  dueDate: string | null = null,
): Task {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Tiêu đề không được để trống");
  }

  return {
    id,
    title: trimmed,
    dueDate,
    tags: [],
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function toggleComplete(
  task: Task,
  now: string = new Date().toISOString(),
): Task {
  if (task.completed) {
    return {
      ...task,
      completed: false,
      completedAt: null,
      updatedAt: now,
    };
  }

  return {
    ...task,
    completed: true,
    completedAt: now,
    updatedAt: now,
  };
}

export function setDueDate(
  task: Task,
  dueDate: string | null,
  now: string = new Date().toISOString(),
): Task {
  return {
    ...task,
    dueDate,
    updatedAt: now,
  };
}
