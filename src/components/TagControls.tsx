import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

type TagControlsProps = {
  tags: string[];
  suggestions: string[];
  onAdd: (rawTag: string) => void;
  onRemove: (tag: string) => void;
  inputLabel?: string;
};

const chipClass =
  "inline-flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-0.5 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200";

export function TagControls({
  tags,
  suggestions,
  onAdd,
  onRemove,
  inputLabel = "Thêm tag",
}: TagControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const listId = useId();

  const submitTag = () => {
    const raw = inputValue.trim();
    if (!raw) return;

    onAdd(raw);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitTag();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitTag();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Tag">
          {tags.map((tag) => (
            <span key={tag} role="listitem" className={chipClass}>
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="rounded-full px-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label={`Xóa tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-1.5">
        <input
          ref={inputRef}
          type="text"
          list={listId}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Thêm tag…"
          aria-label={inputLabel}
          className="min-w-[8rem] flex-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
        />
        <datalist id={listId}>
          {suggestions.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </form>
    </div>
  );
}
