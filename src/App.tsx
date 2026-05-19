import { useReducer, useRef, useState } from "react";
import { QuickAddBar } from "./components/QuickAddBar";
import { TagViewPicker } from "./components/TagViewPicker";
import { TaskList } from "./components/TaskList";
import { TitleFilter } from "./components/TitleFilter";
import { UndoToast } from "./components/UndoToast";
import { ViewTabs } from "./components/ViewTabs";
import { toLocalDateString } from "./filters/dateUtils";
import {
  filterAll,
  filterByTag,
  filterByTitle,
  filterOverdue,
  filterToday,
} from "./filters/ViewFilters";
import { TaskStore } from "./store/TaskStore";
import type { Task, ViewId } from "./types";
import { UndoBuffer } from "./undo/UndoBuffer";
import { VIEW_EMPTY_STATES } from "./viewEmptyStates";

function filterTasksForView(
  tasks: ReturnType<TaskStore["getState"]>["tasks"],
  view: ViewId,
  today: string,
  titleQuery: string,
  selectedTag: string | null,
) {
  const byView =
    view === "today"
      ? filterToday(tasks, today)
      : view === "overdue"
        ? filterOverdue(tasks, today)
        : view === "by-tag" && selectedTag
          ? filterByTag(tasks, selectedTag)
          : view === "by-tag"
            ? []
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

  const undoBufferRef = useRef<UndoBuffer<Task> | null>(null);
  if (!undoBufferRef.current) {
    undoBufferRef.current = new UndoBuffer<Task>({
      timeoutMs: 5000,
      onExpire: () => rerender(),
    });
  }
  const undoBuffer = undoBufferRef.current;

  const [activeView, setActiveView] = useState<ViewId>("today");
  const [titleQuery, setTitleQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const today = toLocalDateString(new Date());
  const tagSuggestions = store.getTagSuggestions();
  const tasks = filterTasksForView(
    store.getState().tasks,
    activeView,
    today,
    titleQuery,
    selectedTag,
  );
  const showQuickAdd = activeView === "today" || activeView === "all";

  const emptyMessage =
    activeView === "by-tag" && !selectedTag
      ? "Chọn một tag để xem việc."
      : VIEW_EMPTY_STATES[activeView];

  const handleAdd = (
    title: string,
    dueDate: string | null = null,
    tags: string[] = [],
  ) => {
    store.addTask(title, dueDate, tags);
    rerender();
  };

  const handleToggleComplete = (id: string) => {
    store.toggleTaskComplete(id);
    rerender();
  };

  const handleDueDateChange = (id: string, dueDate: string | null) => {
    store.updateTaskDue(id, dueDate);
    rerender();
  };

  const handleAddTag = (id: string, rawTag: string) => {
    store.addTag(id, rawTag);
    rerender();
  };

  const handleRemoveTag = (id: string, tag: string) => {
    store.removeTag(id, tag);
    rerender();
  };

  const handleTitleChange = (id: string, title: string) => {
    try {
      store.updateTaskTitle(id, title);
      rerender();
    } catch {
      // TaskRow rejects empty titles before calling; ignore unexpected errors.
    }
  };

  const handleDelete = (id: string) => {
    const removed = store.deleteTask(id);
    if (removed) {
      undoBuffer.push(removed);
      rerender();
    }
  };

  const handleUndo = () => {
    const task = undoBuffer.undo();
    if (task) {
      store.restoreTask(task);
      rerender();
    }
  };

  const handleViewChange = (view: ViewId) => {
    setActiveView(view);
    if (view !== "by-tag") {
      setSelectedTag(null);
    } else if (!selectedTag && tagSuggestions.length > 0) {
      setSelectedTag(tagSuggestions[0]);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Việc cần làm</h1>
      </header>

      <ViewTabs activeView={activeView} onViewChange={handleViewChange} />
      <TitleFilter value={titleQuery} onChange={setTitleQuery} />

      {activeView === "by-tag" && (
        <TagViewPicker
          suggestions={tagSuggestions}
          selectedTag={selectedTag}
          onSelect={setSelectedTag}
        />
      )}

      {showQuickAdd && (
        <QuickAddBar
          today={today}
          tagSuggestions={tagSuggestions}
          onAdd={handleAdd}
        />
      )}
      <TaskList
        tasks={tasks}
        today={today}
        emptyMessage={emptyMessage}
        tagSuggestions={tagSuggestions}
        onToggleComplete={handleToggleComplete}
        onTitleChange={handleTitleChange}
        onDueDateChange={handleDueDateChange}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onDelete={handleDelete}
      />
      <UndoToast visible={undoBuffer.hasPending()} onUndo={handleUndo} />
    </div>
  );
}
