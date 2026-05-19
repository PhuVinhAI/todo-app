import { useRef, useState, type FormEvent } from "react";
import { normalizeTag } from "../domain/TaskDomain";
import { DueDateControls } from "./DueDateControls";
import { TagControls } from "./TagControls";

function addPendingTag(
  current: string[],
  raw: string,
  suggestions: string[],
): string[] {
  const normalized = normalizeTag(raw);
  if (normalized === "") {
    return current;
  }

  if (current.some((tag) => normalizeTag(tag) === normalized)) {
    return current;
  }

  const known = [...suggestions, ...current];
  const display = known.find((tag) => normalizeTag(tag) === normalized) ?? raw.trim();
  return [...current, display];
}

type QuickAddBarProps = {
  today: string;
  tagSuggestions: string[];
  onAdd: (title: string, dueDate: string | null, tags: string[]) => void;
};

export function QuickAddBar({ today, tagSuggestions, onAdd }: QuickAddBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingDueDate, setPendingDueDate] = useState<string | null>(null);
  const [pendingTags, setPendingTags] = useState<string[]>([]);

  const submit = () => {
    const input = inputRef.current;
    if (!input) return;

    const title = input.value.trim();
    if (!title) return;

    onAdd(title, pendingDueDate, pendingTags);
    input.value = "";
    setPendingDueDate(null);
    setPendingTags([]);
    input.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Thêm việc mới…"
        aria-label="Thêm việc mới"
        autoFocus
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
      />
      <DueDateControls
        dueDate={pendingDueDate}
        today={today}
        onChange={setPendingDueDate}
      />
      <TagControls
        tags={pendingTags}
        suggestions={tagSuggestions}
        onAdd={(raw) =>
          setPendingTags((current) => addPendingTag(current, raw, tagSuggestions))
        }
        onRemove={(tag) =>
          setPendingTags((current) =>
            current.filter((t) => normalizeTag(t) !== normalizeTag(tag)),
          )
        }
        inputLabel="Thêm tag khi tạo việc"
      />
    </form>
  );
}
