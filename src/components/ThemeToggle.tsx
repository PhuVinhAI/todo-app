import type { ThemeMode } from "../theme/ThemePreference";

const OPTIONS: { mode: ThemeMode; label: string; shortLabel: string }[] = [
  { mode: "system", label: "Theo hệ thống", shortLabel: "Hệ thống" },
  { mode: "light", label: "Sáng", shortLabel: "Sáng" },
  { mode: "dark", label: "Tối", shortLabel: "Tối" },
];

type ThemeToggleProps = {
  preference: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeToggle({ preference, onChange }: ThemeToggleProps) {
  return (
    <div
      className="flex shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800"
      role="group"
      aria-label="Chọn giao diện"
    >
      {OPTIONS.map((option) => {
        const isActive = option.mode === preference;
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => onChange(option.mode)}
            aria-pressed={isActive}
            className={
              isActive
                ? "min-h-9 rounded-md bg-white px-2 py-1.5 text-xs font-medium text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100 sm:px-2.5"
                : "min-h-9 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:px-2.5"
            }
          >
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
