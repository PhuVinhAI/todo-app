import { normalizeTag } from "../domain/TaskDomain";

type TagViewPickerProps = {
  suggestions: string[];
  selectedTag: string | null;
  onSelect: (tag: string) => void;
};

const chipClass =
  "rounded-full border border-gray-300 px-2.5 py-0.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800";

const chipActiveClass =
  "rounded-full border border-blue-500 bg-blue-50 px-2.5 py-0.5 text-sm text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200";

export function TagViewPicker({
  suggestions,
  selectedTag,
  onSelect,
}: TagViewPickerProps) {
  if (suggestions.length === 0) {
    return (
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Chưa có tag nào. Thêm tag trên việc để lọc theo tag.
      </p>
    );
  }

  const selectedNormalized = selectedTag ? normalizeTag(selectedTag) : "";

  return (
    <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Chọn tag">
      {suggestions.map((tag) => {
        const isActive = normalizeTag(tag) === selectedNormalized;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            className={isActive ? chipActiveClass : chipClass}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
