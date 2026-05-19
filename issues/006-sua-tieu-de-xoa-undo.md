---
id: "006"
title: "Sửa tiêu đề inline + xóa việc với Undo"
category: enhancement
state: ready-for-agent
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Sửa tiêu đề việc bằng cách click vào tiêu đề (inline edit, không modal). Xóa việc chưa xong qua hover hoặc menu overflow gọn — sau khi xóa hiện toast **Undo** trong 5 giây; bấm Undo khôi phục việc. Module **UndoBuffer** giữ tối đa một lần xóa đang chờ; không persist qua reload. Không hộp thoại xác nhận khi xóa một việc.

## Acceptance criteria

- [ ] Click tiêu đề → sửa inline; lưu khi blur/Enter; tiêu đề không rỗng
- [ ] Nút xóa qua hover hoặc overflow menu (khó bấm nhầm trên mobile)
- [ ] Xóa một việc → toast Undo 5 giây; Undo khôi phục đúng việc
- [ ] Không dialog xác nhận cho xóa đơn
- [ ] UndoBuffer không persist sau refresh

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
