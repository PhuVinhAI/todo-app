---
id: "005"
title: "Tag: gán, gợi ý, view Theo tag"
category: enhancement
state: ready-for-agent
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Tag trên việc: nhập khi tạo việc và thêm/xóa inline trên từng dòng. Một việc có nhiều tag; Enter để thêm tag mới. Gợi ý từ tag đã dùng trước đó. Chuẩn hóa so sánh: `trim` + `toLowerCase()` (`Work` = `work`); lưu casing lần đầu gặp để hiển thị. View **Theo tag**: chọn một tag, chỉ hiện việc chưa xong có tag khớp (normalized). Chip tag không màu (v1). Xóa tag khỏi việc không cần xác nhận.

## Acceptance criteria

- [ ] Quick-add: tùy chọn thêm tag; mặc định không tag nếu không nhập
- [ ] Inline: thêm/xóa tag trên task row; nhiều tag/việc; Enter để thêm
- [ ] Gợi ý tag từ tag đã dùng; không trùng do khác hoa thường
- [ ] View Theo tag: chọn tag → chỉ việc chưa xong khớp tag
- [ ] Chip tag không màu; xóa tag không cần xác nhận
- [ ] Unit test `TaskDomain`: normalize tags, dedupe suggestions

## Blocked by

[#003 Đa view: Hôm nay, Quá hạn + lọc tiêu đề](./003-da-view-hom-nay-qua-han-loc.md)
