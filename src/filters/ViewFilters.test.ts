import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import {
  filterAll,
  filterByTag,
  filterByTitle,
  filterOverdue,
  filterToday,
} from "./ViewFilters";

function makeTask(overrides: Partial<Task> & Pick<Task, "id" | "title">): Task {
  return {
    dueDate: null,
    tags: [],
    completed: false,
    completedAt: null,
    createdAt: "2026-05-19T10:00:00.000Z",
    updatedAt: "2026-05-19T10:00:00.000Z",
    ...overrides,
  };
}

describe("ViewFilters", () => {
  describe("filterAll", () => {
    it("excludes completed tasks", () => {
      const tasks = [
        makeTask({ id: "1", title: "Active" }),
        makeTask({ id: "2", title: "Done", completed: true, completedAt: "2026-05-19T11:00:00.000Z" }),
      ];

      expect(filterAll(tasks)).toHaveLength(1);
      expect(filterAll(tasks)[0].title).toBe("Active");
    });

    it("sorts dated tasks ascending then undated at the bottom", () => {
      const tasks = [
        makeTask({ id: "1", title: "No date" }),
        makeTask({ id: "2", title: "Later", dueDate: "2026-05-25" }),
        makeTask({ id: "3", title: "Soon", dueDate: "2026-05-20" }),
        makeTask({ id: "4", title: "Also no date" }),
      ];

      const result = filterAll(tasks);

      expect(result.map((t) => t.title)).toEqual([
        "Soon",
        "Later",
        "No date",
        "Also no date",
      ]);
    });
  });

  describe("filterToday", () => {
    const today = "2026-05-19";

    it("includes incomplete tasks due today and overdue, excludes undated", () => {
      const tasks = [
        makeTask({ id: "1", title: "Due today", dueDate: "2026-05-19" }),
        makeTask({ id: "2", title: "Overdue", dueDate: "2026-05-15" }),
        makeTask({ id: "3", title: "No date" }),
        makeTask({ id: "4", title: "Future", dueDate: "2026-05-25" }),
      ];

      const result = filterToday(tasks, today);

      expect(result.map((t) => t.title)).toEqual(["Overdue", "Due today"]);
    });

    it("excludes completed tasks", () => {
      const tasks = [
        makeTask({ id: "1", title: "Active overdue", dueDate: "2026-05-15" }),
        makeTask({
          id: "2",
          title: "Done overdue",
          dueDate: "2026-05-15",
          completed: true,
          completedAt: "2026-05-19T11:00:00.000Z",
        }),
      ];

      expect(filterToday(tasks, today)).toHaveLength(1);
      expect(filterToday(tasks, today)[0].title).toBe("Active overdue");
    });
  });

  describe("filterOverdue", () => {
    const today = "2026-05-19";

    it("includes only incomplete tasks with dueDate before today", () => {
      const tasks = [
        makeTask({ id: "1", title: "Yesterday", dueDate: "2026-05-18" }),
        makeTask({ id: "2", title: "Today", dueDate: "2026-05-19" }),
        makeTask({ id: "3", title: "Tomorrow", dueDate: "2026-05-20" }),
        makeTask({ id: "4", title: "No date" }),
      ];

      expect(filterOverdue(tasks, today).map((t) => t.title)).toEqual(["Yesterday"]);
    });

    it("treats today as not overdue at local calendar day boundary", () => {
      const tasks = [
        makeTask({ id: "1", title: "Due today", dueDate: today }),
        makeTask({ id: "2", title: "Due yesterday", dueDate: "2026-05-18" }),
      ];

      const result = filterOverdue(tasks, today);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Due yesterday");
    });

    it("excludes completed tasks", () => {
      const tasks = [
        makeTask({ id: "1", title: "Active", dueDate: "2026-05-18" }),
        makeTask({
          id: "2",
          title: "Done",
          dueDate: "2026-05-18",
          completed: true,
          completedAt: "2026-05-19T11:00:00.000Z",
        }),
      ];

      expect(filterOverdue(tasks, today)).toHaveLength(1);
    });
  });

  describe("filterByTag", () => {
    it("shows only incomplete tasks with a normalized tag match", () => {
      const tasks = [
        makeTask({ id: "1", title: "Active work", tags: ["Work"] }),
        makeTask({ id: "2", title: "Also work", tags: ["work"] }),
        makeTask({
          id: "3",
          title: "Done work",
          tags: ["Work"],
          completed: true,
          completedAt: "2026-05-19T11:00:00.000Z",
        }),
        makeTask({ id: "4", title: "Other", tags: ["home"] }),
      ];

      expect(filterByTag(tasks, "WORK").map((t) => t.title)).toEqual([
        "Active work",
        "Also work",
      ]);
    });

    it("returns empty list when no tag is selected", () => {
      const tasks = [makeTask({ id: "1", title: "A", tags: ["Work"] })];

      expect(filterByTag(tasks, "   ")).toEqual([]);
    });
  });

  describe("filterByTitle", () => {
    it("filters by case-insensitive substring on title", () => {
      const tasks = [
        makeTask({ id: "1", title: "Buy Milk" }),
        makeTask({ id: "2", title: "Call dentist" }),
        makeTask({ id: "3", title: "MILK powder" }),
      ];

      expect(filterByTitle(tasks, "milk").map((t) => t.title)).toEqual([
        "Buy Milk",
        "MILK powder",
      ]);
    });

    it("returns all tasks when query is empty", () => {
      const tasks = [makeTask({ id: "1", title: "A" }), makeTask({ id: "2", title: "B" })];

      expect(filterByTitle(tasks, "")).toHaveLength(2);
      expect(filterByTitle(tasks, "   ")).toHaveLength(2);
    });
  });
});
