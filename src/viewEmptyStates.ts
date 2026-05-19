import type { ViewId } from "./types";

export const VIEW_EMPTY_STATES: Record<ViewId, string> = {
  today: "Không có việc hôm nay hoặc quá hạn.",
  all: "Chưa có việc nào. Thêm việc đầu tiên ở trên.",
  overdue: "Không có việc quá hạn.",
  "by-tag": "Không có việc nào với tag đã chọn.",
  done: "Chưa có việc đã xong.",
};
