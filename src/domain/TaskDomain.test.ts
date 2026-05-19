import { describe, expect, it } from "vitest";
import { createTask, setDueDate, toggleComplete } from "./TaskDomain";

describe("TaskDomain", () => {
  const now = "2026-05-19T10:00:00.000Z";

  it("creates a task with title, no due date, and no tags", () => {
    const task = createTask("Mua sữa", now, "id-1");

    expect(task).toEqual({
      id: "id-1",
      title: "Mua sữa",
      dueDate: null,
      tags: [],
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  it("rejects empty title", () => {
    expect(() => createTask("   ", now)).toThrow("Tiêu đề không được để trống");
  });

  it("marks a task complete with completedAt timestamp", () => {
    const task = createTask("Việc A", now, "id-1");
    const completed = toggleComplete(task, "2026-05-19T11:00:00.000Z");

    expect(completed.completed).toBe(true);
    expect(completed.completedAt).toBe("2026-05-19T11:00:00.000Z");
    expect(completed.updatedAt).toBe("2026-05-19T11:00:00.000Z");
  });

  it("creates a task with an optional due date", () => {
    const task = createTask("Việc có hạn", now, "id-2", "2026-05-20");

    expect(task.dueDate).toBe("2026-05-20");
  });

  it("sets and clears a due date", () => {
    const task = createTask("Việc A", now, "id-1");
    const withDue = setDueDate(task, "2026-05-20", "2026-05-19T12:00:00.000Z");
    const cleared = setDueDate(withDue, null, "2026-05-19T13:00:00.000Z");

    expect(withDue.dueDate).toBe("2026-05-20");
    expect(withDue.updatedAt).toBe("2026-05-19T12:00:00.000Z");
    expect(cleared.dueDate).toBeNull();
    expect(cleared.updatedAt).toBe("2026-05-19T13:00:00.000Z");
  });

  it("uncompletes a completed task", () => {
    const task = createTask("Việc A", now, "id-1");
    const completed = toggleComplete(task, "2026-05-19T11:00:00.000Z");
    const uncompleted = toggleComplete(completed, "2026-05-19T12:00:00.000Z");

    expect(uncompleted.completed).toBe(false);
    expect(uncompleted.completedAt).toBeNull();
    expect(uncompleted.updatedAt).toBe("2026-05-19T12:00:00.000Z");
  });
});
