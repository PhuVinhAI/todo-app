import type { Task } from "../types";
import { TaskRow } from "./TaskRow";

type TaskListProps = {
  tasks: Task[];
  today: string;
  emptyMessage: string;
  tagSuggestions: string[];
  onToggleComplete: (id: string) => void;
  onDueDateChange: (id: string, dueDate: string | null) => void;
  onAddTag: (id: string, rawTag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
};

export function TaskList({
  tasks,
  today,
  emptyMessage,
  tagSuggestions,
  onToggleComplete,
  onDueDateChange,
  onAddTag,
  onRemoveTag,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          today={today}
          tagSuggestions={tagSuggestions}
          onToggleComplete={onToggleComplete}
          onDueDateChange={onDueDateChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      ))}
    </ul>
  );
}
