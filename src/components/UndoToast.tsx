type UndoToastProps = {
  visible: boolean;
  onUndo: () => void;
};

export function UndoToast({ visible, onUndo }: UndoToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-3 right-3 z-50 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:bottom-6 sm:left-1/2 sm:right-auto sm:max-w-md sm:-translate-x-1/2 sm:justify-center"
    >
      <span className="text-sm text-gray-700 dark:text-gray-200">Đã xóa việc</span>
      <button
        type="button"
        onClick={onUndo}
        className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Hoàn tác
      </button>
    </div>
  );
}
