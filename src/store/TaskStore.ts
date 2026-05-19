import {
  addTagToTask as applyAddTag,
  collectTagSuggestions,
  createTask,
  removeTagFromTask as applyRemoveTag,
  setDueDate,
  toggleComplete,
  updateTaskTitle,
} from "../domain/TaskDomain";
import type { AppState, Task } from "../types";

const STORAGE_KEY = "todo-app-state";

export function createEmptyState(): AppState {
  return { schemaVersion: 1, tasks: [] };
}

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

function isValidTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Task;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    (task.dueDate === null || typeof task.dueDate === "string") &&
    Array.isArray(task.tags) &&
    task.tags.every((tag) => typeof tag === "string") &&
    typeof task.completed === "boolean" &&
    (task.completedAt === null || typeof task.completedAt === "string") &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}

export function parseImportSnapshot(json: string): AppState {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportError("JSON không hợp lệ");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed as AppState).schemaVersion !== 1 ||
    !Array.isArray((parsed as AppState).tasks)
  ) {
    throw new ImportError("Định dạng backup không hợp lệ");
  }

  const state = parsed as AppState;
  if (!state.tasks.every(isValidTask)) {
    throw new ImportError("Dữ liệu việc trong backup không hợp lệ");
  }

  return state;
}

function parseState(raw: string | null): AppState {
  if (!raw) {
    return createEmptyState();
  }

  try {
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.tasks)) {
      return createEmptyState();
    }
    return parsed;
  } catch {
    return createEmptyState();
  }
}

export class TaskStore {
  private state: AppState;
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
    this.state = parseState(storage.getItem(STORAGE_KEY));
  }

  getState(): AppState {
    return this.state;
  }

  private persist(): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private mutate(mutator: (state: AppState) => AppState): void {
    this.state = mutator(this.state);
    this.persist();
  }

  addTask(
    title: string,
    dueDate: string | null = null,
    tags: string[] = [],
    now: string = new Date().toISOString(),
  ): Task {
    const knownTags = collectTagSuggestions(this.state.tasks);
    let task = createTask(title, now, crypto.randomUUID(), dueDate);

    for (const raw of tags) {
      task = applyAddTag(task, raw, [...knownTags, ...task.tags], now);
    }

    this.mutate((state) => ({
      ...state,
      tasks: [...state.tasks, task],
    }));
    return task;
  }

  addTag(id: string, rawTag: string, now: string = new Date().toISOString()): void {
    const knownTags = collectTagSuggestions(this.state.tasks);

    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id
          ? applyAddTag(task, rawTag, [...knownTags, ...task.tags], now)
          : task,
      ),
    }));
  }

  removeTag(id: string, tag: string, now: string = new Date().toISOString()): void {
    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? applyRemoveTag(task, tag, now) : task,
      ),
    }));
  }

  getTagSuggestions(): string[] {
    return collectTagSuggestions(this.state.tasks);
  }

  updateTaskDue(
    id: string,
    dueDate: string | null,
    now: string = new Date().toISOString(),
  ): void {
    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? setDueDate(task, dueDate, now) : task,
      ),
    }));
  }

  toggleTaskComplete(id: string, now: string = new Date().toISOString()): void {
    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? toggleComplete(task, now) : task,
      ),
    }));
  }

  updateTaskTitle(
    id: string,
    title: string,
    now: string = new Date().toISOString(),
  ): void {
    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? updateTaskTitle(task, title, now) : task,
      ),
    }));
  }

  deleteAllCompleted(): number {
    const completedIds = new Set(
      this.state.tasks.filter((t) => t.completed).map((t) => t.id),
    );
    if (completedIds.size === 0) {
      return 0;
    }

    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.filter((t) => !completedIds.has(t.id)),
    }));
    return completedIds.size;
  }

  deleteTask(id: string): Task | null {
    const task = this.state.tasks.find((t) => t.id === id) ?? null;
    if (!task) {
      return null;
    }

    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
    return task;
  }

  restoreTask(task: Task): void {
    this.mutate((state) => {
      if (state.tasks.some((t) => t.id === task.id)) {
        return state;
      }
      return {
        ...state,
        tasks: [...state.tasks, task],
      };
    });
  }

  exportSnapshot(): string {
    return JSON.stringify(this.state);
  }

  importSnapshot(json: string): void {
    const nextState = parseImportSnapshot(json);
    this.state = nextState;
    this.persist();
  }
}
