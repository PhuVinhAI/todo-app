---
id: "008"
title: "Export / Import JSON trong Settings"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Panel **Settings** (icon bánh răng trên header): export toàn bộ `AppState` ra file JSON tải về; import file JSON backup với hộp thoại xác nhận — cảnh báo ghi đè dữ liệu hiện tại và hiển thị số việc sẽ thay thế. `TaskStore.importSnapshot(json)` validate và replace toàn bộ state; từ chối JSON không hợp lệ.

## Acceptance criteria

- [x] Icon Settings mở panel export/import
- [x] Export tải file JSON chứa toàn bộ dữ liệu app
- [x] Import: chọn file → hiện số việc sẽ thay thế + cảnh báo ghi đè → xác nhận mới import
- [x] JSON không hợp lệ bị từ chối, không làm hỏng dữ liệu hiện tại
- [x] Unit test `TaskStore`: import reject invalid JSON; round-trip export/import

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/components/SettingsPanel.tsx` | Panel Cài đặt: nút xuất/nhập JSON, chọn file, hiển thị lỗi import |

### Files modified

| File | Mô tả |
|------|--------|
| `src/store/TaskStore.ts` | `exportSnapshot`, `importSnapshot`, `parseImportSnapshot`, `ImportError`, validate task shape |
| `src/store/TaskStore.test.ts` | Test export, round-trip import, reject invalid JSON |
| `src/App.tsx` | Icon bánh răng header, wire export download + import confirm dialog |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/008-export-import-json-settings.md` | Done + implementation notes |

### Files deleted

Không có.

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
