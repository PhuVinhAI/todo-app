type TitleFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TitleFilter({ value, onChange }: TitleFilterProps) {
  return (
    <div className="mb-4">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Lọc theo tiêu đề..."
        aria-label="Lọc theo tiêu đề"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:text-sm"
      />
    </div>
  );
}
