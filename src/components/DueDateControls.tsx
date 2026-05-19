import { useRef } from "react";
import { formatDueLabel } from "../domain/DueDatePresentation";
import { addDaysToDateString } from "../filters/dateUtils";

type DueDateControlsProps = {
  dueDate: string | null;
  today: string;
  onChange: (dueDate: string | null) => void;
  showLabel?: boolean;
};

const chipClass =
  "rounded-full border border-gray-300 px-2.5 py-0.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800";

const chipActiveClass =
  "rounded-full border border-blue-500 bg-blue-50 px-2.5 py-0.5 text-sm text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200";

export function DueDateControls({
  dueDate,
  today,
  onChange,
  showLabel = false,
}: DueDateControlsProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const tomorrow = addDaysToDateString(today, 1);

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.();
    dateInputRef.current?.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showLabel && dueDate && (
        <span className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {formatDueLabel(dueDate, today)}
        </span>
      )}

      <button
        type="button"
        onClick={() => onChange(today)}
        className={dueDate === today ? chipActiveClass : chipClass}
      >
        Hôm nay
      </button>

      <button
        type="button"
        onClick={() => onChange(tomorrow)}
        className={dueDate === tomorrow ? chipActiveClass : chipClass}
      >
        Ngày mai
      </button>

      {dueDate !== null && (
        <button type="button" onClick={() => onChange(null)} className={chipClass}>
          Xóa hạn
        </button>
      )}

      <button type="button" onClick={openDatePicker} className={chipClass}>
        Chọn ngày
      </button>

      <input
        ref={dateInputRef}
        type="date"
        value={dueDate ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          if (value) {
            onChange(value);
          }
        }}
        className="sr-only"
        aria-label="Chọn ngày hạn"
        tabIndex={-1}
      />
    </div>
  );
}
