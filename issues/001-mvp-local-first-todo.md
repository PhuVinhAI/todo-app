---
id: "001"
title: "MVP: Trang quản lý công việc cá nhân (local-first)"
category: enhancement
state: in-progress
created: 2026-05-19
---

# PRD: MVP Trang quản lý công việc cá nhân (local-first)

## Status

Slice **#002 Bootstrap** hoàn thành (2026-05-19). Slice **#003 Đa view + lọc tiêu đề** hoàn thành (2026-05-19). Slice **#004 Hạn: thêm nhanh + chip inline** hoàn thành (2026-05-19). Slice **#005 Tag: gán, gợi ý, view Theo tag** hoàn thành (2026-05-19): quick-add tag tùy chọn, tag inline, gợi ý dedupe, view Theo tag, `TaskDomain` normalize. Slice **#006 Sửa tiêu đề inline + xóa việc với Undo** hoàn thành (2026-05-19): inline edit tiêu đề, xóa qua hover/overflow menu, toast Hoàn tác 5 giây, `UndoBuffer` in-memory. Slice **#007 View Đã xong: xóa một / xóa hết** hoàn thành (2026-05-19): tab Đã xong, sort `completedAt` mới nhất trước, xóa vĩnh viễn không Undo, xóa hết + dialog xác nhận. Các slice #008–#009 chưa implement.

## Acceptance criteria (MVP — tiến độ)

| # | User story / capability | Trạng thái |
|---|-------------------------|------------|
| 2 | Quick-add bằng Enter | ✅ #002 |
| 3 | Việc mới không hạn, không tag mặc định | ✅ #002 |
| 6 | Autosave localStorage | ✅ #002 |
| 7 | Checkbox hoàn thành | ✅ #002 |
| 21–22 | View Tất cả + sort hạn | ✅ #002 |
| 36 | UI tiếng Việt | ✅ #002 |
| 37 | Theme theo OS | ✅ #002 |
| 40 | Static deploy, không backend | ✅ #002 |
| 41 | Không đăng nhập | ✅ #002 |
| 1 | Mở app thấy Hôm nay + quá hạn | ✅ #003 #004 |
| 4 | Gán hạn khi tạo (Hôm nay, Ngày mai, chọn ngày) | ✅ #004 |
| 14 | Sửa/xóa hạn inline qua chip | ✅ #004 |
| 15 | Chip: Hôm nay, Ngày mai, Xóa hạn, Chọn ngày | ✅ #004 |
| 29 | Hạn chỉ theo ngày (không giờ) | ✅ #004 |
| 30 | Hiển thị Hôm nay / Ngày mai / dd/MM/yyyy | ✅ #004 |
| 44 | Xóa hạn không cần xác nhận | ✅ #004 |
| 8 | Việc xong ẩn khỏi Hôm nay/Tất cả/Quá hạn | ✅ #003 |
| 23–24 | View Quá hạn + quy tắc local | ✅ #003 |
| 25–27 | Hôm nay: loại undated, gồm due hôm nay + quá hạn | ✅ #003 |
| 28 | Lọc tiêu đề trong view hiện tại | ✅ #003 |
| 45 | Empty state theo view | ✅ #003 |
| 46 | Quick-add trên Hôm nay và Tất cả | ✅ #003 |
| 47 | Focus quick-add sau tạo việc | ✅ #002 |
| 50 | Load tasks sau refresh | ✅ #002 |
| 5 | Tag tùy chọn khi tạo | ✅ #005 |
| 16–20 | Tag inline, nhiều tag, Enter, gợi ý, chuẩn hóa | ✅ #005 |
| 25 | View Theo tag | ✅ #005 |
| 42–43 | Chip tag không màu; xóa tag không xác nhận | ✅ #005 |
| 13 | Sửa tiêu đề inline (click, blur/Enter) | ✅ #006 |
| 31 | Xóa việc chưa xong | ✅ #006 |
| 32 | Toast Undo 5 giây sau xóa một việc | ✅ #006 |
| 48 | Xóa qua hover hoặc overflow menu | ✅ #006 |
| 9 | View Đã xong liệt kê việc hoàn thành | ✅ #007 |
| 10 | Xóa vĩnh viễn một việc đã xong | ✅ #007 |
| 11 | Xóa hết việc đã xong | ✅ #007 |
| 12 | Dialog xác nhận trước khi xóa hết | ✅ #007 |
| 33–35, 38–39, 49 | Còn lại | ⏳ #008–#009 |

## Implementation notes

Ghi chú triển khai chi tiết: [#002](./002-bootstrap-luu-viec-view-tat-ca.md#implementation-notes), [#003](./003-da-view-hom-nay-qua-han-loc.md#implementation-notes), [#004](./004-han-due-date-them-nhanh-chip.md#implementation-notes), [#005](./005-tag-gan-goi-y-view-theo-tag.md#implementation-notes), [#006](./006-sua-tieu-de-xoa-undo.md#implementation-notes), [#007](./007-view-da-xong-xoa.md#implementation-notes).

### Files created (#002)

Toàn bộ codebase ứng dụng — xem bảng Files created trong issue #002.

### Files modified (#002)

Không có file ứng dụng sẵn có; chỉ cập nhật issue markdown.

### Files created (#003)

| File | Mô tả |
|------|--------|
| `src/components/ViewTabs.tsx` | Tab bar Hôm nay / Tất cả / Quá hạn |
| `src/components/TitleFilter.tsx` | Ô lọc tiêu đề |
| `src/filters/dateUtils.ts` | Ngày local `YYYY-MM-DD` |
| `src/viewEmptyStates.ts` | Empty state tiếng Việt theo view |

### Files modified (#003)

| File | Mô tả |
|------|--------|
| `src/filters/ViewFilters.ts` | `filterToday`, `filterOverdue`, `filterByTitle` |
| `src/filters/ViewFilters.test.ts` | Unit tests view + title filter |
| `src/types.ts` | `ViewId` |
| `src/App.tsx` | Điều hướng view, pipeline lọc, quick-add có điều kiện |
| `src/components/TaskList.tsx` | `emptyMessage` theo view |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/003-da-view-hom-nay-qua-han-loc.md` | Đánh dấu done + implementation notes |

### Files created (#004)

| File | Mô tả |
|------|--------|
| `src/domain/DueDatePresentation.ts` | Nhãn Hôm nay / Ngày mai / dd/MM/yyyy |
| `src/domain/DueDatePresentation.test.ts` | Unit tests DueDatePresentation |
| `src/components/DueDateControls.tsx` | Chip gán/sửa hạn dùng chung |

### Files modified (#004)

| File | Mô tả |
|------|--------|
| `src/filters/dateUtils.ts` | `addDaysToDateString` |
| `src/domain/TaskDomain.ts` | `dueDate` tùy chọn khi tạo; `setDueDate` |
| `src/domain/TaskDomain.test.ts` | Test gán/xóa hạn |
| `src/store/TaskStore.ts` | `addTask` với hạn; `updateTaskDue` |
| `src/store/TaskStore.test.ts` | Test persist hạn |
| `src/components/QuickAddBar.tsx` | Chip hạn trên quick-add |
| `src/components/TaskRow.tsx` | Chip hạn inline + nhãn |
| `src/components/TaskList.tsx` | Props `today`, `onDueDateChange` |
| `src/App.tsx` | Handlers tạo/cập nhật hạn |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/004-han-due-date-them-nhanh-chip.md` | Đánh dấu done + implementation notes |

### Files created (#005)

| File | Mô tả |
|------|--------|
| `src/components/TagControls.tsx` | Chip tag + nhập tag; gợi ý datalist; Enter thêm |
| `src/components/TagViewPicker.tsx` | Chọn tag cho view Theo tag |

### Files modified (#005)

| File | Mô tả |
|------|--------|
| `src/domain/TaskDomain.ts` | Normalize, add/remove tag, collect suggestions |
| `src/domain/TaskDomain.test.ts` | Unit tests tag domain |
| `src/filters/ViewFilters.ts` | `filterByTag` |
| `src/filters/ViewFilters.test.ts` | Unit tests filterByTag |
| `src/types.ts` | `ViewId` + `by-tag` |
| `src/store/TaskStore.ts` | Tag mutations + suggestions |
| `src/store/TaskStore.test.ts` | Test persist tags |
| `src/components/QuickAddBar.tsx` | Tag tùy chọn quick-add |
| `src/components/TaskRow.tsx` | Tag inline |
| `src/components/TaskList.tsx` | Wire tag props |
| `src/components/ViewTabs.tsx` | Tab Theo tag |
| `src/viewEmptyStates.ts` | Empty state by-tag |
| `src/App.tsx` | Tag view + handlers |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/005-tag-gan-goi-y-view-theo-tag.md` | Done + implementation notes |

### Files created (#006)

| File | Mô tả |
|------|--------|
| `src/undo/UndoBuffer.ts` | Giữ tối đa một lần xóa chờ; timer 5s; `push` / `undo` / `commit` |
| `src/undo/UndoBuffer.test.ts` | Unit tests timer, undo, thay thế pending, commit |
| `src/components/UndoToast.tsx` | Toast tiếng Việt "Đã xóa việc" + nút Hoàn tác |

### Files modified (#006)

| File | Mô tả |
|------|--------|
| `src/domain/TaskDomain.ts` | `updateTaskTitle` — trim, reject rỗng |
| `src/domain/TaskDomain.test.ts` | Unit tests cập nhật tiêu đề |
| `src/store/TaskStore.ts` | `updateTaskTitle`, `deleteTask`, `restoreTask` |
| `src/store/TaskStore.test.ts` | Test persist title, delete, restore |
| `src/components/TaskRow.tsx` | Inline edit tiêu đề; xóa hover (desktop) + overflow menu (mobile) |
| `src/components/TaskList.tsx` | Truyền `onTitleChange`, `onDelete` |
| `src/App.tsx` | Wire delete + UndoBuffer + UndoToast |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/006-sua-tieu-de-xoa-undo.md` | Done + implementation notes |

### Files created (#007)

| File | Mô tả |
|------|--------|
| `src/components/ConfirmDialog.tsx` | Hộp thoại xác nhận tái dùng (overlay, Hủy / hành động chính) |

### Files modified (#007)

| File | Mô tả |
|------|--------|
| `src/types.ts` | `ViewId` thêm `"done"` |
| `src/filters/ViewFilters.ts` | `filterDone` — chỉ `completed`, sort `completedAt` giảm dần |
| `src/filters/ViewFilters.test.ts` | Unit tests `filterDone` |
| `src/store/TaskStore.ts` | `deleteAllCompleted()` — xóa mọi việc đã xong, trả số lượng |
| `src/store/TaskStore.test.ts` | Test persist `deleteAllCompleted` |
| `src/components/ViewTabs.tsx` | Tab **Đã xong** |
| `src/viewEmptyStates.ts` | Empty state "Chưa có việc đã xong." |
| `src/App.tsx` | View done, xóa vĩnh viễn (không Undo), nút xóa hết + `ConfirmDialog` |
| `issues/001-mvp-local-first-todo.md` | Cập nhật Status và bảng AC |
| `issues/007-view-da-xong-xoa.md` | Done + implementation notes |

### Files deleted

Không có.

## Problem Statement

Người dùng solo cần một cách **nhanh và tập trung** để ghi nhận việc cần làm, xem đúng việc cần làm **hôm nay**, và hoàn thành việc mà không ma sát — nhưng không muốn phức tạp của công cụ nhóm (đăng nhập, đồng bộ cloud, kanban, v.v.). Các giải pháp hiện có thường quá nặng hoặc yêu cầu tài khoản cho nhu cầu cá nhân đơn giản.

## Solution

Một **ứng dụng web tĩnh** (React + Vite + TypeScript), giao diện **tiếng Việt**, lưu toàn bộ dữ liệu trong **localStorage** trên một trình duyệt. Người dùng thêm/sửa/hoàn thành việc qua **danh sách phẳng** với **tiêu đề, hạn (ngày), và tag**; mở app vào view **Hôm nay** (gồm việc quá hạn); có **export/import JSON** để backup; có **undo** khi xóa nhầm một việc.

## User Stories

1. As a solo user, I want to open the app and immediately see today's and overdue incomplete tasks, so that I know what to work on first without browsing everything.

2. As a solo user, I want to add a task by typing a title and pressing Enter, so that capturing a thought takes seconds.

3. As a solo user, I want newly created tasks to have no due date and no tags by default, so that quick capture is not blocked by optional fields.

4. As a solo user, I want to optionally set a due date when creating a task (Today, Tomorrow, or pick a date), so that I can schedule work without opening a heavy form.

5. As a solo user, I want to optionally add tags when creating a task, so that I can categorize work when it matters.

6. As a solo user, I want every change to save automatically to the browser, so that I never lose work because I forgot to click Save.

7. As a solo user, I want to mark a task complete with a checkbox, so that finishing work feels instant.

8. As a solo user, I want completed tasks to disappear from Today, All, Overdue, and By-tag views, so that active lists stay focused.

9. As a solo user, I want a Done view listing completed tasks, so that I can review what I finished.

10. As a solo user, I want to permanently delete a single completed task from the Done view, so that I can clean up mistakes.

11. As a solo user, I want to delete all completed tasks at once from the Done view, so that I can reset history periodically.

12. As a solo user, I want a confirmation dialog before deleting all completed tasks, so that I do not lose history by accident.

13. As a solo user, I want to edit a task title inline by clicking it, so that fixing typos does not require a modal.

14. As a solo user, I want to change or clear a due date via an inline due chip, so that rescheduling is fast.

15. As a solo user, I want due chips to offer Today, Tomorrow, Clear due, and Pick date, so that common cases are one click.

16. As a solo user, I want to add and remove tags inline on a task, so that categorization can evolve after creation.

17. As a solo user, I want to assign multiple tags to one task, so that work can belong to more than one context.

18. As a solo user, I want to type a new tag name and press Enter to add it, so that tag entry matches quick-add speed.

19. As a solo user, I want tag suggestions from tags I have used before, so that naming stays consistent.

20. As a solo user, I want `Work` and `work` treated as the same tag, so that duplicates do not clutter filters.

21. As a solo user, I want to switch to an All view showing all incomplete tasks, so that I can see my full backlog.

22. As a solo user, I want incomplete tasks in All sorted by due date (soonest first), with undated tasks at the bottom, so that ordering matches urgency.

23. As a solo user, I want a dedicated Overdue view, so that I can focus on missed deadlines.

24. As a solo user, I want an overdue task to be any incomplete task whose due date is before today (local calendar), so that "overdue" matches my timezone on this device.

25. As a solo user, I want a By-tag view where I pick one tag and see only matching incomplete tasks, so that I can work in one context at a time.

26. As a solo user, I want undated tasks excluded from Today, so that Today stays actionable.

27. As a solo user, I want Today to include incomplete tasks due today and all overdue incomplete tasks, so that nothing urgent is hidden.

28. As a solo user, I want a search/filter box that filters tasks in the current view by title substring, so that I can find a task in a long list without advanced search.

29. As a solo user, I want due dates to be day-only (no time), so that scheduling stays simple.

30. As a solo user, I want due dates displayed as friendly text (Today, Tomorrow, or dd/MM/yyyy), so that dates are scannable.

31. As a solo user, I want to delete an incomplete task, so that I can remove tasks I no longer need.

32. As a solo user, I want a 5-second Undo toast after deleting a single task, so that accidental deletes are recoverable without a dialog every time.

33. As a solo user, I want to export all data to a JSON file, so that I can back up before clearing browser data or switching machines manually.

34. As a solo user, I want to import a JSON backup, so that I can restore data on the same browser.

35. As a solo user, I want a confirmation dialog before import that warns the import will overwrite current data and shows how many tasks will be replaced, so that I do not destroy live data by mistake.

36. As a solo user, I want the UI in Vietnamese (labels, buttons, placeholders), so that the app feels natural to use.

37. As a solo user, I want the color theme to follow my OS preference by default, so that the app matches my environment.

38. As a solo user, I want a light/dark toggle in the header that remembers my choice, so that I can override system theme.

39. As a solo user, I want the layout to work on a phone-sized browser width, so that I can use the same app on mobile browser on this device.

40. As a solo user, I want the app deployable as static files without a backend, so that hosting is free and simple.

41. As a solo user, I want no login screen, so that there is zero friction to start.

42. As a solo user, I want tag chips without colors in v1, so that the UI stays minimal.

43. As a solo user, I want to clear a tag from a task without confirmation, so that minor edits stay fast.

44. As a solo user, I want to clear a due date without confirmation, so that minor edits stay fast.

45. As a solo user, I want empty states in each view explaining there are no tasks, so that I understand the UI is working.

46. As a solo user, I want the quick-add bar visible on Today and All views, so that I can add tasks where I work most.

47. As a solo user, I want focus to return to the quick-add input after creating a task, so that I can enter multiple tasks in a row.

48. As a solo user, I want delete on a task available via hover or a compact overflow menu, so that delete is available but not easy to mis-tap.

49. As a solo user, I want import/export controls in a Settings area (gear icon), so that backup is discoverable but not in the way daily.

50. As a solo user, I want the app to load my tasks on refresh, so that persistence feels reliable.

## Implementation Decisions

### Codebase state

Greenfield repository: no application code, ADRs, or domain glossary yet. First deliverable is the MVP described here.

### Stack

- React + Vite + TypeScript
- Tailwind CSS for layout, tabs, chips, toasts, dialogs
- Static deployment (Vercel, Netlify, or GitHub Pages)
- No backend, no authentication

### Deep modules (proposed)

1. **TaskStore** — Owns persistence: read/write app state to `localStorage`, schema version field, autosave on mutation, `exportSnapshot()` → JSON string, `importSnapshot(json)` with validation and full replace. Hides storage key names and migration hooks.

2. **TaskDomain** — Pure task operations: create/update/complete/uncomplete/delete task; normalize tag strings (trim, case-fold for equality); validate title non-empty; assign due as `YYYY-MM-DD` or null. No DOM or React.

3. **ViewFilters** — Pure functions: given task list + "as of" local date + active view + optional selected tag + title filter string → filtered ordered list. Encapsulates Today / All / Overdue / By-tag / Done rules and All sort order.

4. **DueDatePresentation** — Maps ISO date + reference today → display label (`Hôm nay`, `Ngày mai`, `dd/MM/yyyy`) and quick-pick actions. Keeps date-fns or similar behind one module.

5. **UndoBuffer** — Holds at most one pending delete with 5s timer; `commit()` / `undo()` API for UI toast. Not persisted across reload.

6. **ThemePreference** — Read/write user theme override (`system` | `light` | `dark`) in `localStorage`; apply `class` on `document.documentElement`.

### Task shape (v1)

```ts
type Task = {
  id: string;           // uuid
  title: string;
  dueDate: string | null;  // YYYY-MM-DD or null
  tags: string[];       // display form; compare normalized
  completed: boolean;
  completedAt: string | null;  // ISO timestamp when completed
  createdAt: string;    // ISO timestamp
  updatedAt: string;
};

type AppState = {
  schemaVersion: 1;
  tasks: Task[];
};
```

### View rules (canonical)

| View | Include |
|------|---------|
| Hôm nay | `!completed` AND (`dueDate` is today OR `dueDate` < today) |
| Tất cả | `!completed`; sort: dated ascending, then undated |
| Quá hạn | `!completed` AND `dueDate` < today |
| Theo tag | `!completed` AND has selected tag (normalized match) |
| Đã xong | `completed`; newest `completedAt` first |

Title filter: case-insensitive substring on `title` applied after view filter.

### Tag normalization

- Storage: preserve first-seen casing for display per tag string on task
- Equality: `trim` + `toLowerCase()` for matching and dedupe suggestions
- Suggestions: unique normalized tags across all tasks

### UI composition (shallow React layer)

- **AppShell**: header (title, theme toggle, settings), tab bar, optional title filter input
- **QuickAddBar**: title input, due picker triggers, tag input — calls TaskDomain + TaskStore
- **TaskList** + **TaskRow**: checkbox, inline title, due chip, tag chips, delete
- **SettingsPanel**: export download, import file picker + confirm modal
- **Toast**: undo delete

### Destructive actions

| Action | Behavior |
|--------|----------|
| Delete one task | Remove + Undo toast 5s |
| Delete all completed | Confirm dialog |
| Import JSON | Confirm + show task count; overwrite entire AppState |

### Defaults (not debated in design session; agent may adjust with comment)

- `crypto.randomUUID()` for ids
- Responsive layout via Tailwind breakpoints
- `date-fns` + `date-fns/locale/vi` for calendar math and formatting

## Testing Decisions

**What makes a good test:** Assert inputs and outputs of public module APIs only — never React hook internals or `localStorage` key strings from UI tests.

**Modules to unit test (recommended):**

| Module | Examples |
|--------|----------|
| TaskDomain | create, normalize tags, complete toggles |
| ViewFilters | Today includes overdue; All sort; Overdue boundary at midnight |
| DueDatePresentation | labels for today/tomorrow/other |
| TaskStore | round-trip save/load with mocked `localStorage`; import rejects invalid JSON |

**Modules deferred for v1:** UndoBuffer timer (optional fake timers test), full E2E (Playwright) — add after MVP if desired.

**Prior art:** None (greenfield).

## Out of Scope

- User accounts, authentication, cloud sync
- Multi-device real-time sync
- Recurring / repeating tasks
- Subtasks, checklists, projects hierarchy
- Kanban boards, drag-and-drop columns, manual ordering
- Push notifications and reminders
- Native mobile apps
- Long-form notes and file attachments
- Priority levels (high/medium/low)
- Sharing, assignment, comments
- Tag colors
- Due time (hours/minutes)
- Full-text search across tags and notes (title filter within current view only)
- Collaboration or teams

## Further Notes

- Design session language: Vietnamese UI copy throughout.
- "Effective" for this user means: fast capture, focused Today view, local trust (autosave + backup), minimal chrome.
- After MVP ships, natural v2 candidates: optional cloud sync, recurring tasks, keyboard shortcuts (`/` focus quick-add), PWA offline shell — none are in this PRD.
