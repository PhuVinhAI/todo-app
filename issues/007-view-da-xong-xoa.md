---
id: "007"
title: "View Đã xong: xóa một / xóa hết"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Tab **Đã xong** liệt kê việc đã hoàn thành, sắp xếp `completedAt` mới nhất trước. Cho phép xóa vĩnh viễn một việc đã xong. Nút xóa hết việc đã xong kèm hộp thoại xác nhận trước khi thực hiện.

## Acceptance criteria

- [x] Tab Đã xong hiển thị việc `completed`, mới nhất trước
- [x] Xóa vĩnh viễn một việc đã xong
- [x] Xóa hết việc đã xong → dialog xác nhận → xóa toàn bộ
- [x] Empty state tiếng Việt khi chưa có việc đã xong

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/components/ConfirmDialog.tsx` | Hộp thoại xác nhận tái dùng (overlay, Hủy / hành động chính) |

### Files modified

| File | Mô tả |
|------|--------|
| `src/types.ts` | `ViewId` thêm `"done"` |
| `src/filters/ViewFilters.ts` | `filterDone` — chỉ `completed`, sort `completedAt` giảm dần |
| `src/filters/ViewFilters.test.ts` | Unit tests `filterDone` |
| `src/store/TaskStore.ts` | `deleteAllCompleted()` — xóa mọi việc đã xong, trả số lượng |
| `src/store/TaskStore.test.ts` | Test persist `deleteAllCompleted` |
| `src/components/ViewTabs.tsx` | Tab **Đã xong** |
| `src/viewEmptyStates.ts` | Empty state "Chưa có việc đã xong." |
| `src/App.tsx` | View done, xóa vĩnh viễn (không Undo), nút xóa hết + `ConfirmDialog` |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/007-view-da-xong-xoa.md` | Done + implementation notes |

### Files deleted

Không có.

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
