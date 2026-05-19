import type { Task } from "../types";

type TaskRowProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
};

export function TaskRow({ task, onToggleComplete }: TaskRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        aria-label={`Đánh dấu hoàn thành: ${task.title}`}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="flex-1 text-base">{task.title}</span>
    </li>
  );
}
