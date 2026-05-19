import { useReducer, useRef, useState } from "react";
import { TitleFilter } from "./components/TitleFilter";
import { QuickAddBar } from "./components/QuickAddBar";
import { TaskList } from "./components/TaskList";
import { ViewTabs } from "./components/ViewTabs";
import { toLocalDateString } from "./filters/dateUtils";
import {
  filterAll,
  filterByTitle,
  filterOverdue,
  filterToday,
} from "./filters/ViewFilters";
import { TaskStore } from "./store/TaskStore";
import type { ViewId } from "./types";
import { VIEW_EMPTY_STATES } from "./viewEmptyStates";

function filterTasksForView(
  tasks: ReturnType<TaskStore["getState"]>["tasks"],
  view: ViewId,
  today: string,
  titleQuery: string,
) {
  const byView =
    view === "today"
      ? filterToday(tasks, today)
      : view === "overdue"
        ? filterOverdue(tasks, today)
        : filterAll(tasks);

  return filterByTitle(byView, titleQuery);
}

export default function App() {
  const storeRef = useRef<TaskStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new TaskStore(localStorage);
  }
  const store = storeRef.current;

  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const [activeView, setActiveView] = useState<ViewId>("today");
  const [titleQuery, setTitleQuery] = useState("");

  const today = toLocalDateString(new Date());
  const tasks = filterTasksForView(store.getState().tasks, activeView, today, titleQuery);
  const showQuickAdd = activeView === "today" || activeView === "all";

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

      <ViewTabs activeView={activeView} onViewChange={setActiveView} />
      <TitleFilter value={titleQuery} onChange={setTitleQuery} />

      {showQuickAdd && <QuickAddBar onAdd={handleAdd} />}
      <TaskList
        tasks={tasks}
        emptyMessage={VIEW_EMPTY_STATES[activeView]}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}
