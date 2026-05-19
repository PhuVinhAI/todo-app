import type { Task } from "../types";

export function filterAll(tasks: Task[]): Task[] {
  const incomplete = tasks.filter((task) => !task.completed);

  const dated = incomplete
    .filter((task) => task.dueDate !== null)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));

  const undated = incomplete.filter((task) => task.dueDate === null);

  return [...dated, ...undated];
}
