---
id: "002"
title: "Bootstrap: scaffold + lưu việc + view Tất cả"
category: enhancement
state: done
created: 2026-05-19
---

## Parent

[#001 MVP: Trang quản lý công việc cá nhân (local-first)](./001-mvp-local-first-todo.md)

## What to build

Khởi tạo ứng dụng web tĩnh (React + Vite + TypeScript + Tailwind) và giao slice đầu tiên có thể dùng được: người dùng mở app, thêm việc bằng quick-add (chỉ tiêu đề, Enter), thấy danh sách việc chưa xong trong view **Tất cả** (sắp xếp theo hạn gần nhất, việc không hạn ở cuối), đánh dấu hoàn thành bằng checkbox, và mọi thay đổi tự lưu vào localStorage — refresh trang vẫn giữ dữ liệu.

Giao diện tiếng Việt; theme mặc định theo OS (`prefers-color-scheme`); không có màn hình đăng nhập. Empty state khi chưa có việc.

Schema và module lõi (theo PRD parent):

```ts
type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  tags: string[];
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type AppState = {
  schemaVersion: 1;
  tasks: Task[];
};
```

- **TaskStore** — đọc/ghi `AppState` vào localStorage, autosave sau mỗi mutation.
- **TaskDomain** — tạo việc (tiêu đề không rỗng, mặc định không hạn và không tag), toggle complete/uncomplete.
- **ViewFilters** — view Tất cả: `!completed`, sort hạn tăng dần rồi undated.

## Acceptance criteria

- [x] `npm run dev` và `npm run build` chạy thành công (static deploy, không backend)
- [x] Thêm việc bằng tiêu đề + Enter; việc mới không có hạn và không có tag
- [x] Focus quay lại ô quick-add sau khi tạo việc
- [x] View Tất cả hiển thị việc chưa xong, sắp xếp đúng quy tắc hạn
- [x] Checkbox đánh dấu hoàn thành / bỏ hoàn thành; thay đổi lưu tự động
- [x] Refresh trình duyệt giữ nguyên dữ liệu
- [x] Empty state tiếng Việt khi không có việc
- [x] Theme theo OS; nhãn UI tiếng Việt
- [x] Unit test cho `TaskDomain`, `ViewFilters` (All sort), `TaskStore` (round-trip với localStorage mock)

## Implementation notes

### Files created

| File | Mô tả |
|------|--------|
| `package.json` | Dependencies React/Vite/Tailwind/Vitest; scripts dev, build, lint, typecheck, test |
| `index.html` | Entry HTML, lang=vi |
| `vite.config.ts` | Vite + Vitest config |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | TypeScript strict project refs |
| `tailwind.config.js` | Tailwind v3, `darkMode: media` (theo OS) |
| `postcss.config.js` | PostCSS + Tailwind |
| `eslint.config.js` | ESLint flat config |
| `src/types.ts` | `Task`, `AppState` types |
| `src/domain/TaskDomain.ts` | Tạo việc, toggle complete/uncomplete |
| `src/domain/TaskDomain.test.ts` | Unit tests TaskDomain |
| `src/filters/ViewFilters.ts` | `filterAll`: incomplete + sort hạn |
| `src/filters/ViewFilters.test.ts` | Unit tests ViewFilters All sort |
| `src/store/TaskStore.ts` | localStorage read/write, autosave mutations |
| `src/store/TaskStore.test.ts` | Round-trip tests với memory Storage mock |
| `src/App.tsx` | Shell app: view Tất cả, quick-add, task list |
| `src/main.tsx` | React entry |
| `src/index.css` | Tailwind directives + dark/light body |
| `src/vite-env.d.ts` | Vite client types |
| `src/components/QuickAddBar.tsx` | Quick-add input, Enter submit, refocus |
| `src/components/TaskList.tsx` | Danh sách + empty state tiếng Việt |
| `src/components/TaskRow.tsx` | Checkbox + tiêu đề việc |

### Files modified

| File | Mô tả |
|------|--------|
| `.gitignore` | (đã có sẵn) patterns Node/dist |

### Files deleted

Không có.

## Blocked by

None — can start immediately
