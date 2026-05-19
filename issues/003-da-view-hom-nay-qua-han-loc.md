---
id: "003"
title: "Đa view: Hôm nay, Quá hạn + lọc tiêu đề"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Mở rộng điều hướng và bộ lọc view: tab bar **Hôm nay / Tất cả / Quá hạn** với quy tắc lọc đúng PRD. Việc đã xong biến mất khỏi các view đang làm (Hôm nay, Tất cả, Quá hạn). Ô lọc tiêu đề (substring, không phân biệt hoa thường) áp dụng trên view hiện tại. Empty state riêng cho từng view.

Quy tắc view (theo parent):

| View | Bao gồm |
|------|---------|
| Hôm nay | `!completed` AND (`dueDate` hôm nay OR `dueDate` < hôm nay) — loại việc không hạn |
| Tất cả | `!completed`; sort: có hạn tăng dần, undated ở cuối |
| Quá hạn | `!completed` AND `dueDate` < hôm nay (theo lịch local) |

Quick-add bar hiển thị trên view Hôm nay và Tất cả.

## Acceptance criteria

- [x] Tab chuyển giữa Hôm nay, Tất cả, Quá hạn; mỗi view lọc đúng quy tắc
- [x] Hôm nay gồm việc due hôm nay và quá hạn; loại việc không hạn
- [x] Việc đã xong không xuất hiện ở Hôm nay, Tất cả, Quá hạn
- [x] Ô lọc tiêu đề hoạt động trên view hiện tại (substring, case-insensitive)
- [x] Empty state tiếng Việt cho từng view khi không có việc phù hợp
- [x] Quick-add hiển thị trên Hôm nay và Tất cả
- [x] Unit test `ViewFilters`: Today bao gồm overdue; Overdue boundary midnight local; title filter

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/components/ViewTabs.tsx` | Tab bar Hôm nay / Tất cả / Quá hạn |
| `src/components/TitleFilter.tsx` | Ô lọc tiêu đề (substring, không phân biệt hoa thường) |
| `src/filters/dateUtils.ts` | `toLocalDateString` — ngày local `YYYY-MM-DD` cho so sánh hạn |
| `src/viewEmptyStates.ts` | Thông báo empty state tiếng Việt theo từng view |

### Files modified

| File | Mô tả |
|------|--------|
| `src/filters/ViewFilters.ts` | Thêm `filterToday`, `filterOverdue`, `filterByTitle` |
| `src/filters/ViewFilters.test.ts` | Unit tests Today/Overdue/title filter |
| `src/types.ts` | Thêm type `ViewId` |
| `src/App.tsx` | View state, pipeline lọc, quick-add có điều kiện, mặc định Hôm nay |
| `src/components/TaskList.tsx` | Nhận `emptyMessage` theo view |

### Files deleted

Không có.

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
