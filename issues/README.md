# Local issues

Theo dõi công việc **trong repo** (markdown), không dùng GitHub Issues.

## Cấu trúc file

Mỗi issue một file: `NNN-slug.md` với frontmatter YAML:

```yaml
---
id: "001"
title: "Tiêu đề ngắn"
category: enhancement   # enhancement | bug
state: ready-for-agent  # needs-triage | needs-info | ready-for-agent | ready-for-human | wontfix
created: 2026-05-19
---
```

Phần dưới frontmatter là PRD / mô tả đầy đủ (Problem, Solution, User Stories, …).

## Danh sách

| ID | State | Title |
|----|-------|-------|
| [001](./001-mvp-local-first-todo.md) | `in-progress` | MVP: Trang quản lý công việc cá nhân (local-first) |
| [002](./002-bootstrap-luu-viec-view-tat-ca.md) | `done` | Bootstrap: scaffold + lưu việc + view Tất cả |
| [003](./003-da-view-hom-nay-qua-han-loc.md) | `ready-for-agent` | Đa view: Hôm nay, Quá hạn + lọc tiêu đề |
| [004](./004-han-due-date-them-nhanh-chip.md) | `ready-for-agent` | Hạn (due date): thêm nhanh + chip inline |
| [005](./005-tag-gan-goi-y-view-theo-tag.md) | `ready-for-agent` | Tag: gán, gợi ý, view Theo tag |
| [006](./006-sua-tieu-de-xoa-undo.md) | `ready-for-agent` | Sửa tiêu đề inline + xóa việc với Undo |
| [007](./007-view-da-xong-xoa.md) | `ready-for-agent` | View Đã xong: xóa một / xóa hết |
| [008](./008-export-import-json-settings.md) | `ready-for-agent` | Export / Import JSON trong Settings |
| [009](./009-theme-toggle-responsive-mobile.md) | `ready-for-agent` | Theme toggle + responsive mobile |

## Cho agent

Ưu tiên issue có `state: ready-for-agent`. Đọc toàn bộ file issue trước khi implement.
