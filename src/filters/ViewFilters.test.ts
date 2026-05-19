import { describe, expect, it } from "vitest";
import type { Task } from "../types";
import { filterAll } from "./ViewFilters";

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
});
