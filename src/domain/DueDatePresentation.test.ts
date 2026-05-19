import { describe, expect, it } from "vitest";
import { formatDueLabel } from "./DueDatePresentation";

describe("DueDatePresentation", () => {
  const today = "2026-05-19";

  it("labels a due date that matches reference today as Hôm nay", () => {
    expect(formatDueLabel("2026-05-19", today)).toBe("Hôm nay");
  });

  it("labels the day after reference today as Ngày mai", () => {
    expect(formatDueLabel("2026-05-20", today)).toBe("Ngày mai");
  });

  it("labels other dates as dd/MM/yyyy", () => {
    expect(formatDueLabel("2026-06-01", today)).toBe("01/06/2026");
    expect(formatDueLabel("2025-12-31", today)).toBe("31/12/2025");
  });
});
