import { describe, expect, it, beforeEach } from "vitest";
import { createEmptyState, TaskStore } from "./TaskStore";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

describe("TaskStore", () => {
  let storage: Storage;
  let store: TaskStore;

  beforeEach(() => {
    storage = createMemoryStorage();
    store = new TaskStore(storage);
  });

  it("returns empty state when storage is empty", () => {
    expect(store.getState()).toEqual(createEmptyState());
  });

  it("persists state to storage on mutation", () => {
    store.addTask("Việc mới");

    const raw = storage.getItem("todo-app-state");
    expect(raw).not.toBeNull();

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks).toHaveLength(1);
    expect(reloaded.getState().tasks[0].title).toBe("Việc mới");
  });

  it("persists due date on add and update", () => {
    const task = store.addTask("Việc có hạn", "2026-05-20");

    expect(task.dueDate).toBe("2026-05-20");

    store.updateTaskDue(task.id, null);

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].dueDate).toBeNull();
  });

  it("persists tags on add and inline add/remove", () => {
    const task = store.addTask("Việc có tag", null, ["Work", "work", "home"]);

    expect(task.tags).toEqual(["Work", "home"]);

    store.addTag(task.id, "WORK");
    store.removeTag(task.id, "home");

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].tags).toEqual(["Work"]);
    expect(reloaded.getTagSuggestions()).toEqual(["Work"]);
  });

  it("round-trips toggle complete through storage", () => {
    const task = store.addTask("Việc A");
    store.toggleTaskComplete(task.id);

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].completed).toBe(true);

    reloaded.toggleTaskComplete(task.id);
    const again = new TaskStore(storage);
    expect(again.getState().tasks[0].completed).toBe(false);
  });
});
