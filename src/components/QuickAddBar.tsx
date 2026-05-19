import { useRef, type FormEvent } from "react";

type QuickAddBarProps = {
  onAdd: (title: string) => void;
};

export function QuickAddBar({ onAdd }: QuickAddBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const input = inputRef.current;
    if (!input) return;

    const title = input.value.trim();
    if (!title) return;

    onAdd(title);
    input.value = "";
    input.focus();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Thêm việc mới…"
        aria-label="Thêm việc mới"
        autoFocus
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900"
      />
    </form>
  );
}
