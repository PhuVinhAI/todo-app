import { describe, expect, it } from "vitest";
import {
  addTagToTask,
  collectTagSuggestions,
  createTask,
  normalizeTag,
  removeTagFromTask,
  setDueDate,
  toggleComplete,
  updateTaskTitle,
} from "./TaskDomain";
import type { Task } from "../types";

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

  it("updates task title and trims whitespace", () => {
    const task = createTask("Việc cũ", now, "id-1");
    const updated = updateTaskTitle(task, "  Việc mới  ", "2026-05-19T12:00:00.000Z");

    expect(updated.title).toBe("Việc mới");
    expect(updated.updatedAt).toBe("2026-05-19T12:00:00.000Z");
    expect(updated.id).toBe("id-1");
  });

  it("rejects empty title on update", () => {
    const task = createTask("Việc A", now, "id-1");

    expect(() => updateTaskTitle(task, "   ", now)).toThrow(
      "Tiêu đề không được để trống",
    );
  });

  describe("tags", () => {
    it("normalizes tags with trim and lowercase for comparison", () => {
      expect(normalizeTag("  Work  ")).toBe("work");
      expect(normalizeTag("")).toBe("");
      expect(normalizeTag("   ")).toBe("");
    });

    it("adds a tag and dedupes case-insensitively on the same task", () => {
      const task = createTask("Việc A", now, "id-1");
      const withWork = addTagToTask(task, "Work", [], now);
      const duplicate = addTagToTask(withWork, "  work ", [], now);

      expect(withWork.tags).toEqual(["Work"]);
      expect(duplicate.tags).toEqual(["Work"]);
    });

    it("reuses first-seen casing when adding a tag that already exists elsewhere", () => {
      const task = createTask("Việc A", now, "id-1");
      const existing: Task = { ...task, id: "id-2", tags: ["Work"] };

      const withTag = addTagToTask(task, "WORK", collectTagSuggestions([existing]), now);

      expect(withTag.tags).toEqual(["Work"]);
    });

    it("removes a tag by normalized match without confirmation semantics", () => {
      const task = createTask("Việc A", now, "id-1");
      const tagged = addTagToTask(task, "Work", [], now);
      const cleared = removeTagFromTask(tagged, "work", "2026-05-19T12:00:00.000Z");

      expect(cleared.tags).toEqual([]);
      expect(cleared.updatedAt).toBe("2026-05-19T12:00:00.000Z");
    });

    it("collects unique tag suggestions preserving first-seen display casing", () => {
      const tasks: Task[] = [
        { ...createTask("A", now, "1"), tags: ["Work", "home"] },
        { ...createTask("B", now, "2"), tags: ["work", "HOME"] },
      ];

      expect(collectTagSuggestions(tasks)).toEqual(["Work", "home"]);
    });
  });
});
