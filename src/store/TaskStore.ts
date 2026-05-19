import { createTask, toggleComplete } from "../domain/TaskDomain";
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

  addTask(title: string, now: string = new Date().toISOString()): Task {
    const task = createTask(title, now);
    this.mutate((state) => ({
      ...state,
      tasks: [...state.tasks, task],
    }));
    return task;
  }

  toggleTaskComplete(id: string, now: string = new Date().toISOString()): void {
    this.mutate((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === id ? toggleComplete(task, now) : task,
      ),
    }));
  }
}
