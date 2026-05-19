import type { Task } from "../types";

function sortByDueDateAsc(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));
}

export function filterToday(tasks: Task[], today: string): Task[] {
  const incomplete = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate !== null &&
      task.dueDate <= today,
  );

  return sortByDueDateAsc(incomplete);
}

export function filterOverdue(tasks: Task[], today: string): Task[] {
  const incomplete = tasks.filter(
    (task) => !task.completed && task.dueDate !== null && task.dueDate < today,
  );

  return sortByDueDateAsc(incomplete);
}

export function filterByTitle(tasks: Task[], query: string): Task[] {
  const trimmed = query.trim();
  if (trimmed === "") {
    return tasks;
  }

  const lower = trimmed.toLowerCase();
  return tasks.filter((task) => task.title.toLowerCase().includes(lower));
}

export function filterAll(tasks: Task[]): Task[] {
  const incomplete = tasks.filter((task) => !task.completed);

  const dated = incomplete
    .filter((task) => task.dueDate !== null)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));

  const undated = incomplete.filter((task) => task.dueDate === null);

  return [...dated, ...undated];
}
