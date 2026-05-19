---
id: "004"
title: "Hạn (due date): thêm nhanh + chip inline"
category: enhancement
state: ready-for-agent
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Thêm hạn (ngày, không giờ) khi tạo việc và sửa hạn inline trên từng dòng việc. Module **DueDatePresentation** ánh xạ `YYYY-MM-DD` + ngày tham chiếu → nhãn thân thiện (`Hôm nay`, `Ngày mai`, `dd/MM/yyyy`). Quick-add và chip inline cung cấp: Hôm nay, Ngày mai, Xóa hạn, Chọn ngày — không cần hộp thoại xác nhận khi xóa hạn.

Việc có hạn mới xuất hiện đúng view (Hôm nay, Quá hạn, …) theo quy tắc đã có ở #003.

## Acceptance criteria

- [ ] Quick-add: tùy chọn gán hạn (Hôm nay, Ngày mai, chọn ngày); mặc định vẫn không hạn nếu không chọn
- [ ] Chip hạn inline trên task row: Hôm nay, Ngày mai, Xóa hạn, Chọn ngày
- [ ] Lưu trữ `YYYY-MM-DD`; hiển thị `Hôm nay` / `Ngày mai` / `dd/MM/yyyy`
- [ ] Xóa hạn không cần xác nhận
- [ ] Việc có hạn xuất hiện đúng view Hôm nay / Quá hạn sau khi gán
- [ ] Unit test `DueDatePresentation`: nhãn today/tomorrow/other

## Blocked by

[#003 Đa view: Hôm nay, Quá hạn + lọc tiêu đề](./003-da-view-hom-nay-qua-han-loc.md)
