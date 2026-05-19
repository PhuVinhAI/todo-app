import type { ViewId } from "../types";

const TABS: { id: ViewId; label: string }[] = [
  { id: "today", label: "Hôm nay" },
  { id: "all", label: "Tất cả" },
  { id: "overdue", label: "Quá hạn" },
  { id: "by-tag", label: "Theo tag" },
  { id: "done", label: "Đã xong" },
];

type ViewTabsProps = {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
};

export function ViewTabs({ activeView, onViewChange }: ViewTabsProps) {
  return (
    <nav
      className="-mx-3 mb-4 overflow-x-auto border-b border-gray-200 dark:border-gray-800 sm:mx-0"
      aria-label="Chọn view"
    >
      <div className="flex min-w-max px-3 sm:px-0">
        {TABS.map((tab) => {
          const isActive = tab.id === activeView;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={
                isActive
                  ? "shrink-0 border-b-2 border-blue-600 px-3 py-2.5 text-sm font-medium text-blue-600 sm:px-4"
                  : "shrink-0 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:px-4"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
