---
id: "008"
title: "Export / Import JSON trong Settings"
category: enhancement
state: ready-for-agent
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Panel **Settings** (icon bánh răng trên header): export toàn bộ `AppState` ra file JSON tải về; import file JSON backup với hộp thoại xác nhận — cảnh báo ghi đè dữ liệu hiện tại và hiển thị số việc sẽ thay thế. `TaskStore.importSnapshot(json)` validate và replace toàn bộ state; từ chối JSON không hợp lệ.

## Acceptance criteria

- [ ] Icon Settings mở panel export/import
- [ ] Export tải file JSON chứa toàn bộ dữ liệu app
- [ ] Import: chọn file → hiện số việc sẽ thay thế + cảnh báo ghi đè → xác nhận mới import
- [ ] JSON không hợp lệ bị từ chối, không làm hỏng dữ liệu hiện tại
- [ ] Unit test `TaskStore`: import reject invalid JSON; round-trip export/import

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
