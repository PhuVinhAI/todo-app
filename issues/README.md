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
| [001](./001-mvp-local-first-todo.md) | `ready-for-agent` | MVP: Trang quản lý công việc cá nhân (local-first) |

## Cho agent

Ưu tiên issue có `state: ready-for-agent`. Đọc toàn bộ file issue trước khi implement.
