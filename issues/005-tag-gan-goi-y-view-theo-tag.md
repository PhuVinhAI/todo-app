---
id: "005"
title: "Tag: gán, gợi ý, view Theo tag"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Tag trên việc: nhập khi tạo việc và thêm/xóa inline trên từng dòng. Một việc có nhiều tag; Enter để thêm tag mới. Gợi ý từ tag đã dùng trước đó. Chuẩn hóa so sánh: `trim` + `toLowerCase()` (`Work` = `work`); lưu casing lần đầu gặp để hiển thị. View **Theo tag**: chọn một tag, chỉ hiện việc chưa xong có tag khớp (normalized). Chip tag không màu (v1). Xóa tag khỏi việc không cần xác nhận.

## Acceptance criteria

- [x] Quick-add: tùy chọn thêm tag; mặc định không tag nếu không nhập
- [x] Inline: thêm/xóa tag trên task row; nhiều tag/việc; Enter để thêm
- [x] Gợi ý tag từ tag đã dùng; không trùng do khác hoa thường
- [x] View Theo tag: chọn tag → chỉ việc chưa xong khớp tag
- [x] Chip tag không màu; xóa tag không cần xác nhận
- [x] Unit test `TaskDomain`: normalize tags, dedupe suggestions

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `src/components/TagControls.tsx` | Chip tag + ô nhập; gợi ý datalist; Enter thêm; × xóa không xác nhận |
| `src/components/TagViewPicker.tsx` | Chọn tag active cho view Theo tag |

### Files modified

| File | Mô tả |
|------|--------|
| `src/domain/TaskDomain.ts` | `normalizeTag`, `addTagToTask`, `removeTagFromTask`, `collectTagSuggestions` |
| `src/domain/TaskDomain.test.ts` | Unit tests normalize, dedupe, first-seen casing, suggestions |
| `src/filters/ViewFilters.ts` | `filterByTag` — việc chưa xong khớp tag (normalized) |
| `src/filters/ViewFilters.test.ts` | Unit tests filterByTag |
| `src/types.ts` | `ViewId` thêm `by-tag` |
| `src/store/TaskStore.ts` | `addTask` với tags; `addTag` / `removeTag`; `getTagSuggestions` |
| `src/store/TaskStore.test.ts` | Test persist tag qua localStorage |
| `src/components/QuickAddBar.tsx` | Tag tùy chọn khi tạo việc; dedupe pending tags |
| `src/components/TaskRow.tsx` | Tag inline trên task row |
| `src/components/TaskList.tsx` | Truyền tag handlers xuống row |
| `src/components/ViewTabs.tsx` | Tab Theo tag |
| `src/viewEmptyStates.ts` | Empty state view Theo tag |
| `src/App.tsx` | Wire tag CRUD, view filter, TagViewPicker |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/005-tag-gan-goi-y-view-theo-tag.md` | Đánh dấu done + implementation notes |

### Files deleted

Không có.

## Blocked by

[#003 Đa view: Hôm nay, Quá hạn + lọc tiêu đề](./003-da-view-hom-nay-qua-han-loc.md)
