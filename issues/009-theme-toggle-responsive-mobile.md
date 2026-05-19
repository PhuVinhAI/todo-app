---
id: "009"
title: "Theme toggle + responsive mobile"
category: enhancement
state: ready-for-agent
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Toggle sáng/tối/theo hệ thống trên header; lưu lựa chọn user trong localStorage qua module **ThemePreference** (`system` | `light` | `dark`), ghi đè theme OS khi user chọn. Polish layout responsive cho chiều rộng điện thoại: tab bar, quick-add, task rows, settings panel, toast — dùng Tailwind breakpoints.

## Acceptance criteria

- [ ] Toggle theme trên header: theo hệ thống / sáng / tối
- [ ] Lựa chọn theme được nhớ sau refresh
- [ ] Mặc định theo OS khi chưa override (hoặc khi chọn "theo hệ thống")
- [ ] Layout usable trên viewport ~375px: không overflow che khuất, nút đủ lớn để thao tác
- [ ] Tab, quick-add, task row, settings, toast hiển thị ổn trên mobile

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
