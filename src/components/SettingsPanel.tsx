import { useRef } from "react";

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
  importError: string | null;
};

export function SettingsPanel({
  open,
  onClose,
  onExport,
  onImportFile,
  importError,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    event.target.value = "";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="settings-panel-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Cài đặt
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cài đặt"
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onExport}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Xuất dữ liệu (JSON)
          </button>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Nhập dữ liệu (JSON)
            </button>
          </div>
        </div>

        {importError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {importError}
          </p>
        )}
      </div>
    </div>
  );
}
