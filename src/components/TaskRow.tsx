import { formatDueLabel } from "../domain/DueDatePresentation";
import type { Task } from "../types";
import { DueDateControls } from "./DueDateControls";
import { TagControls } from "./TagControls";

type TaskRowProps = {
  task: Task;
  today: string;
  tagSuggestions: string[];
  onToggleComplete: (id: string) => void;
  onDueDateChange: (id: string, dueDate: string | null) => void;
  onAddTag: (id: string, rawTag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
};

export function TaskRow({
  task,
  today,
  tagSuggestions,
  onToggleComplete,
  onDueDateChange,
  onAddTag,
  onRemoveTag,
}: TaskRowProps) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Đánh dấu hoàn thành: ${task.title}`}
          className="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="flex-1 text-base">{task.title}</span>
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
