import { useReducer, useRef } from "react";
import { filterAll } from "./filters/ViewFilters";
import { QuickAddBar } from "./components/QuickAddBar";
import { TaskList } from "./components/TaskList";
import { TaskStore } from "./store/TaskStore";

export default function App() {
  const storeRef = useRef<TaskStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new TaskStore(localStorage);
  }
  const store = storeRef.current;

  const [, rerender] = useReducer((n: number) => n + 1, 0);

  const tasks = filterAll(store.getState().tasks);

  const handleAdd = (title: string) => {
    store.addTask(title);
    rerender();
  };

  const handleToggleComplete = (id: string) => {
    store.toggleTaskComplete(id);
    rerender();
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Việc cần làm</h1>
      </header>

      <nav className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <span className="inline-block border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600">
          Tất cả
        </span>
      </nav>

      <QuickAddBar onAdd={handleAdd} />
      <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />
    </div>
  );
}
