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
}
