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
    <nav className="mb-4 border-b border-gray-200 dark:border-gray-800">
      {TABS.map((tab) => {
        const isActive = tab.id === activeView;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onViewChange(tab.id)}
            className={
              isActive
                ? "inline-block border-b-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600"
                : "inline-block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
