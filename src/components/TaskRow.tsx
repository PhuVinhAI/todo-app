import { useEffect, useRef, useState } from "react";
import { formatDueLabel } from "../domain/DueDatePresentation";
import type { Task } from "../types";
import { DueDateControls } from "./DueDateControls";
import { TagControls } from "./TagControls";

type TaskRowProps = {
  task: Task;
  today: string;
  tagSuggestions: string[];
  onToggleComplete: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onDueDateChange: (id: string, dueDate: string | null) => void;
  onAddTag: (id: string, rawTag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDelete: (id: string) => void;
};

export function TaskRow({
  task,
  today,
  tagSuggestions,
  onToggleComplete,
  onTitleChange,
  onDueDateChange,
  onAddTag,
  onRemoveTag,
  onDelete,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(task.title);
    }
  }, [task.title, editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const saveTitle = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(task.title);
      setEditing(false);
      return;
    }

    if (trimmed !== task.title) {
      onTitleChange(task.id, trimmed);
    }
    setEditing(false);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(task.id);
  };

  return (
    <li className="group flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Đánh dấu hoàn thành: ${task.title}`}
          className="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                saveTitle();
              } else if (event.key === "Escape") {
                setDraft(task.title);
                setEditing(false);
              }
            }}
            aria-label="Sửa tiêu đề"
            className="min-w-0 flex-1 rounded border border-blue-400 bg-white px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-600 dark:bg-gray-950"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-w-0 flex-1 truncate text-left text-base hover:text-blue-600 dark:hover:text-blue-400"
            aria-label={`Sửa tiêu đề: ${task.title}`}
          >
            {task.title}
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Xóa: ${task.title}`}
          className="hidden shrink-0 rounded p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-950 dark:hover:text-red-400 sm:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div ref={menuRef} className="relative shrink-0 sm:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={`Tùy chọn cho ${task.title}`}
            aria-expanded={menuOpen}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[8rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                Xóa việc
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:items-end">
        {task.dueDate && (
          <span
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
            aria-label={`Hạn: ${formatDueLabel(task.dueDate, today)}`}
          >
            {formatDueLabel(task.dueDate, today)}
          </span>
        )}
        <DueDateControls
          dueDate={task.dueDate}
          today={today}
          onChange={(dueDate) => onDueDateChange(task.id, dueDate)}
        />
        <TagControls
          tags={task.tags}
          suggestions={tagSuggestions}
          onAdd={(raw) => onAddTag(task.id, raw)}
          onRemove={(tag) => onRemoveTag(task.id, tag)}
          inputLabel={`Thêm tag cho ${task.title}`}
        />
      </div>
    </li>
  );
}
