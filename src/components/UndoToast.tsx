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
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
    >
      <span className="text-sm text-gray-700 dark:text-gray-200">Đã xóa việc</span>
      <button
        type="button"
        onClick={onUndo}
        className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Hoàn tác
      </button>
    </div>
  );
}
