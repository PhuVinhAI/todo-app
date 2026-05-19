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

  it("persists title update through storage", () => {
    const task = store.addTask("Việc cũ");
    store.updateTaskTitle(task.id, "Việc mới");

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].title).toBe("Việc mới");
  });

  it("deletes a task and returns the removed snapshot", () => {
    const task = store.addTask("Việc xóa");
    const removed = store.deleteTask(task.id);

    expect(removed?.title).toBe("Việc xóa");
    expect(store.getState().tasks).toHaveLength(0);

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks).toHaveLength(0);
  });

  it("deletes all completed tasks and returns the count removed", () => {
    const active = store.addTask("Việc đang làm");
    const done = store.addTask("Việc xong");
    store.toggleTaskComplete(done.id);

    const count = store.deleteAllCompleted();

    expect(count).toBe(1);
    expect(store.getState().tasks).toHaveLength(1);
    expect(store.getState().tasks[0].id).toBe(active.id);

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks).toHaveLength(1);
    expect(reloaded.getState().tasks[0].title).toBe("Việc đang làm");
  });

  it("restores a deleted task snapshot", () => {
    const task = store.addTask("Việc khôi phục");
    const removed = store.deleteTask(task.id);

    expect(removed).not.toBeNull();
    store.restoreTask(removed!);

    expect(store.getState().tasks).toHaveLength(1);
    expect(store.getState().tasks[0].title).toBe("Việc khôi phục");

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].title).toBe("Việc khôi phục");
  });

  it("exportSnapshot returns JSON of current app state", () => {
    store.addTask("Việc A");
    store.addTask("Việc B", "2026-05-20");

    const json = store.exportSnapshot();
    const parsed = JSON.parse(json);

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.tasks).toHaveLength(2);
    expect(parsed.tasks[0].title).toBe("Việc A");
    expect(parsed.tasks[1].dueDate).toBe("2026-05-20");
  });

  it("importSnapshot replaces state and round-trips through export", () => {
    store.addTask("Việc cũ");

    const otherStorage = createMemoryStorage();
    const otherStore = new TaskStore(otherStorage);
    otherStore.addTask("Việc nhập", "2026-05-21", ["work"]);
    otherStore.toggleTaskComplete(otherStore.getState().tasks[0].id);

    const snapshot = otherStore.exportSnapshot();
    store.importSnapshot(snapshot);

    expect(store.getState().tasks).toHaveLength(1);
    expect(store.getState().tasks[0].title).toBe("Việc nhập");
    expect(store.getState().tasks[0].dueDate).toBe("2026-05-21");
    expect(store.getState().tasks[0].tags).toEqual(["work"]);
    expect(store.getState().tasks[0].completed).toBe(true);

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].title).toBe("Việc nhập");

    expect(JSON.parse(store.exportSnapshot())).toEqual(JSON.parse(snapshot));
  });

  it("importSnapshot rejects invalid JSON without changing state", () => {
    store.addTask("Việc giữ lại");

    expect(() => store.importSnapshot("not json")).toThrow();
    expect(store.getState().tasks).toHaveLength(1);
    expect(store.getState().tasks[0].title).toBe("Việc giữ lại");

    expect(() => store.importSnapshot('{"schemaVersion":2,"tasks":[]}')).toThrow();
    expect(store.getState().tasks[0].title).toBe("Việc giữ lại");

    expect(() => store.importSnapshot('{"schemaVersion":1}')).toThrow();
    expect(store.getState().tasks[0].title).toBe("Việc giữ lại");

    const reloaded = new TaskStore(storage);
    expect(reloaded.getState().tasks[0].title).toBe("Việc giữ lại");
  });
});
