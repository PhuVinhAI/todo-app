import { useReducer, useRef, useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { QuickAddBar } from "./components/QuickAddBar";
import { SettingsPanel } from "./components/SettingsPanel";
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
  filterDone,
  filterOverdue,
  filterToday,
} from "./filters/ViewFilters";
import { ImportError, parseImportSnapshot, TaskStore } from "./store/TaskStore";
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
        : view === "done"
          ? filterDone(tasks)
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
  const [confirmClearDone, setConfirmClearDone] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<{
    json: string;
    taskCount: number;
  } | null>(null);

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
  const completedCount = store
    .getState()
    .tasks.filter((task) => task.completed).length;
  const showClearDone = activeView === "done" && completedCount > 0;

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
    if (!removed) {
      return;
    }

    if (activeView !== "done") {
      undoBuffer.push(removed);
    }
    rerender();
  };

  const handleClearAllDone = () => {
    store.deleteAllCompleted();
    setConfirmClearDone(false);
    rerender();
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

  const handleExport = () => {
    const json = store.exportSnapshot();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-backup-${today}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);

    try {
      const json = await file.text();
      const snapshot = parseImportSnapshot(json);
      setPendingImport({ json, taskCount: snapshot.tasks.length });
    } catch (error) {
      setImportError(
        error instanceof ImportError ? error.message : "Không thể đọc file backup.",
      );
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) {
      return;
    }

    store.importSnapshot(pendingImport.json);
    undoBuffer.commit();
    setPendingImport(null);
    setSettingsOpen(false);
    setImportError(null);
    rerender();
  };

  const currentTaskCount = store.getState().tasks.length;

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Việc cần làm</h1>
        <button
          type="button"
          onClick={() => {
            setImportError(null);
            setSettingsOpen(true);
          }}
          aria-label="Cài đặt"
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
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

      {showClearDone && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmClearDone(true)}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Xóa hết việc đã xong
          </button>
        </div>
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

      <ConfirmDialog
        open={confirmClearDone}
        title="Xóa hết việc đã xong?"
        message={`Bạn sắp xóa vĩnh viễn ${completedCount} việc đã xong. Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa hết"
        onConfirm={handleClearAllDone}
        onCancel={() => setConfirmClearDone(false)}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setImportError(null);
        }}
        onExport={handleExport}
        onImportFile={handleImportFile}
        importError={importError}
      />

      <ConfirmDialog
        open={pendingImport !== null}
        title="Nhập dữ liệu backup?"
        message={`Thao tác này sẽ ghi đè ${currentTaskCount} việc hiện tại bằng ${pendingImport?.taskCount ?? 0} việc từ file backup. Dữ liệu hiện tại sẽ bị thay thế hoàn toàn.`}
        confirmLabel="Nhập"
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  );
}
