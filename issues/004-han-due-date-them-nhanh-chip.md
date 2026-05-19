---
id: "004"
title: "Hạn (due date): thêm nhanh + chip inline"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Thêm hạn (ngày, không giờ) khi tạo việc và sửa hạn inline trên từng dòng việc. Module **DueDatePresentation** ánh xạ `YYYY-MM-DD` + ngày tham chiếu → nhãn thân thiện (`Hôm nay`, `Ngày mai`, `dd/MM/yyyy`). Quick-add và chip inline cung cấp: Hôm nay, Ngày mai, Xóa hạn, Chọn ngày — không cần hộp thoại xác nhận khi xóa hạn.

Việc có hạn mới xuất hiện đúng view (Hôm nay, Quá hạn, …) theo quy tắc đã có ở #003.

## Acceptance criteria

- [x] Quick-add: tùy chọn gán hạn (Hôm nay, Ngày mai, chọn ngày); mặc định vẫn không hạn nếu không chọn
- [x] Chip hạn inline trên task row: Hôm nay, Ngày mai, Xóa hạn, Chọn ngày
- [x] Lưu trữ `YYYY-MM-DD`; hiển thị `Hôm nay` / `Ngày mai` / `dd/MM/yyyy`
- [x] Xóa hạn không cần xác nhận
- [x] Việc có hạn xuất hiện đúng view Hôm nay / Quá hạn sau khi gán
- [x] Unit test `DueDatePresentation`: nhãn today/tomorrow/other

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/domain/DueDatePresentation.ts` | `formatDueLabel` — Hôm nay / Ngày mai / dd/MM/yyyy |
| `src/domain/DueDatePresentation.test.ts` | Unit tests nhãn today, tomorrow, other |
| `src/components/DueDateControls.tsx` | Chip Hôm nay, Ngày mai, Xóa hạn, Chọn ngày (dùng chung quick-add và task row) |

### Files modified

| File | Mô tả |
|------|--------|
| `src/filters/dateUtils.ts` | Thêm `addDaysToDateString` cho Ngày mai |
| `src/domain/TaskDomain.ts` | `createTask` nhận `dueDate` tùy chọn; thêm `setDueDate` |
| `src/domain/TaskDomain.test.ts` | Test gán/xóa hạn khi tạo và cập nhật |
| `src/store/TaskStore.ts` | `addTask(title, dueDate?)`, `updateTaskDue` |
| `src/store/TaskStore.test.ts` | Test persist due date qua localStorage |
| `src/components/QuickAddBar.tsx` | Chip gán hạn trước khi Enter; mặc định không hạn |
| `src/components/TaskRow.tsx` | Nhãn hạn + chip inline sửa/xóa hạn |
| `src/components/TaskList.tsx` | Truyền `today` và `onDueDateChange` xuống row |
| `src/App.tsx` | Wire quick-add + cập nhật hạn qua TaskStore |

### Files deleted

Không có.

## Blocked by

[#003 Đa view: Hôm nay, Quá hạn + lọc tiêu đề](./003-da-view-hom-nay-qua-han-loc.md)
