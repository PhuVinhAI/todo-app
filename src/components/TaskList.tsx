import type { Task } from "../types";
import { TaskRow } from "./TaskRow";

type TaskListProps = {
  tasks: Task[];
  emptyMessage: string;
  onToggleComplete: (id: string) => void;
};

export function TaskList({ tasks, emptyMessage, onToggleComplete }: TaskListProps) {
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
        <TaskRow key={task.id} task={task} onToggleComplete={onToggleComplete} />
      ))}
    </ul>
  );
}
