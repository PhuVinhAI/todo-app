---
id: "009"
title: "Theme toggle + responsive mobile"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Toggle sáng/tối/theo hệ thống trên header; lưu lựa chọn user trong localStorage qua module **ThemePreference** (`system` | `light` | `dark`), ghi đè theme OS khi user chọn. Polish layout responsive cho chiều rộng điện thoại: tab bar, quick-add, task rows, settings panel, toast — dùng Tailwind breakpoints.

## Acceptance criteria

- [x] Toggle theme trên header: theo hệ thống / sáng / tối
- [x] Lựa chọn theme được nhớ sau refresh
- [x] Mặc định theo OS khi chưa override (hoặc khi chọn "theo hệ thống")
- [x] Layout usable trên viewport ~375px: không overflow che khuất, nút đủ lớn để thao tác
- [x] Tab, quick-add, task row, settings, toast hiển thị ổn trên mobile

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/theme/ThemePreference.ts` | Module `system` \| `light` \| `dark`; persist `todo-app-theme`; áp class `dark` trên `<html>`; lắng nghe OS khi `system` |
| `src/theme/ThemePreference.test.ts` | Unit tests persist, apply class, theo OS, bỏ qua OS khi override |
| `src/components/ThemeToggle.tsx` | Nhóm nút Theo hệ thống / Sáng / Tối trên header |

### Files modified

| File | Mô tả |
|------|--------|
| `tailwind.config.js` | `darkMode: "class"` thay cho `media` |
| `src/main.tsx` | `initTheme()` trước render React |
| `src/App.tsx` | Header: `ThemeToggle` + layout responsive (`overflow-x-hidden`, touch targets) |
| `src/components/ViewTabs.tsx` | Tab bar cuộn ngang trên mobile |
| `src/components/QuickAddBar.tsx` | `overflow-hidden` tránh chip tràn |
| `src/components/DueDateControls.tsx` | Chip `min-h-8` cho thao tác cảm ứng |
| `src/components/TitleFilter.tsx` | Input `text-base` trên mobile |
| `src/components/SettingsPanel.tsx` | Sheet dưới cùng mobile; nút `min-h-11` |
| `src/components/UndoToast.tsx` | Full-width mobile; căn giữa từ `sm:` |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status, AC 38–39, implementation notes |
| `issues/009-theme-toggle-responsive-mobile.md` | Done + implementation notes |

### Files deleted

Không có.

## Blocked by

[#002 Bootstrap: scaffold + lưu việc + view Tất cả](./002-bootstrap-luu-viec-view-tat-ca.md)
