import type { Task } from "../types";
import { TaskRow } from "./TaskRow";

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
};

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500 dark:text-gray-400">
        Chưa có việc nào. Thêm việc đầu tiên ở trên.
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
