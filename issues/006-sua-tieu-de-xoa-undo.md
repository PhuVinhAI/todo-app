---
id: "006"
title: "Sửa tiêu đề inline + xóa việc với Undo"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Sửa tiêu đề việc bằng cách click vào tiêu đề (inline edit, không modal). Xóa việc chưa xong qua hover hoặc menu overflow gọn — sau khi xóa hiện toast **Undo** trong 5 giây; bấm Undo khôi phục việc. Module **UndoBuffer** giữ tối đa một lần xóa đang chờ; không persist qua reload. Không hộp thoại xác nhận khi xóa một việc.

## Acceptance criteria

- [x] Click tiêu đề → sửa inline; lưu khi blur/Enter; tiêu đề không rỗng
- [x] Nút xóa qua hover hoặc overflow menu (khó bấm nhầm trên mobile)
- [x] Xóa một việc → toast Undo 5 giây; Undo khôi phục đúng việc
- [x] Không dialog xác nhận cho xóa đơn
- [x] UndoBuffer không persist sau refresh

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/undo/UndoBuffer.ts` | Giữ tối đa một lần xóa chờ; timer 5s; `push` / `undo` / `commit` |
| `src/undo/UndoBuffer.test.ts` | Unit tests timer, undo, thay thế pending, commit |
| `src/components/UndoToast.tsx` | Toast tiếng Việt "Đã xóa việc" + nút Hoàn tác |

### Files modified

| File | Mô tả |
|------|--------|
| `src/domain/TaskDomain.ts` | `updateTaskTitle` — trim, reject rỗng |
| `src/domain/TaskDomain.test.ts` | Unit tests cập nhật tiêu đề |
| `src/store/TaskStore.ts` | `updateTaskTitle`, `deleteTask`, `restoreTask` |
| `src/store/TaskStore.test.ts` | Test persist title, delete, restore |
| `src/components/TaskRow.tsx` | Inline edit tiêu đề; xóa hover (desktop) + overflow menu (mobile) |
| `src/components/TaskList.tsx` | Truyền `onTitleChange`, `onDelete` |
| `src/App.tsx` | Wire delete + UndoBuffer + UndoToast |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/006-sua-tieu-de-xoa-undo.md` | Đánh dấu done + implementation notes |

### Files deleted

Không có.

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
