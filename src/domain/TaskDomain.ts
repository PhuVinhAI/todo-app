import type { Task } from "../types";

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function resolveTagDisplay(raw: string, existingDisplayTags: string[]): string {
  const normalized = normalizeTag(raw);
  if (normalized === "") {
    return "";
  }

  for (const tag of existingDisplayTags) {
    if (normalizeTag(tag) === normalized) {
      return tag;
    }
  }

  return raw.trim();
}

export function collectTagSuggestions(tasks: Task[]): string[] {
  const seen = new Set<string>();
  const suggestions: string[] = [];

  for (const task of tasks) {
    for (const tag of task.tags) {
      const key = normalizeTag(tag);
      if (key !== "" && !seen.has(key)) {
        seen.add(key);
        suggestions.push(tag);
      }
    }
  }

  return suggestions;
}

export function addTagToTask(
  task: Task,
  rawTag: string,
  knownDisplayTags: string[],
  now: string = new Date().toISOString(),
): Task {
  const display = resolveTagDisplay(rawTag, [...task.tags, ...knownDisplayTags]);
  if (display === "") {
    return task;
  }

  const normalized = normalizeTag(display);
  if (task.tags.some((tag) => normalizeTag(tag) === normalized)) {
    return task;
  }

  return {
    ...task,
    tags: [...task.tags, display],
    updatedAt: now,
  };
}

export function removeTagFromTask(
  task: Task,
  tagToRemove: string,
  now: string = new Date().toISOString(),
): Task {
  const normalized = normalizeTag(tagToRemove);
  if (normalized === "") {
    return task;
  }

  return {
    ...task,
    tags: task.tags.filter((tag) => normalizeTag(tag) !== normalized),
    updatedAt: now,
  };
}

export function createTask(
  title: string,
  now: string = new Date().toISOString(),
  id: string = crypto.randomUUID(),
  dueDate: string | null = null,
): Task {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Tiêu đề không được để trống");
  }

  return {
    id,
    title: trimmed,
    dueDate,
    tags: [],
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function toggleComplete(
  task: Task,
  now: string = new Date().toISOString(),
): Task {
  if (task.completed) {
    return {
      ...task,
      completed: false,
      completedAt: null,
      updatedAt: now,
    };
  }

  return {
    ...task,
    completed: true,
    completedAt: now,
    updatedAt: now,
  };
}

export function setDueDate(
  task: Task,
  dueDate: string | null,
  now: string = new Date().toISOString(),
): Task {
  return {
    ...task,
    dueDate,
    updatedAt: now,
  };
}
