import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UndoBuffer } from "./UndoBuffer";

describe("UndoBuffer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("holds one pending delete and clears after timeout", () => {
    const onExpire = vi.fn();
    const buffer = new UndoBuffer<{ id: string }>({ onExpire, timeoutMs: 5000 });

    buffer.push({ id: "task-1" });
    expect(buffer.hasPending()).toBe(true);

    vi.advanceTimersByTime(5000);
    expect(buffer.hasPending()).toBe(false);
    expect(onExpire).toHaveBeenCalledOnce();
  });

  it("undo returns pending item and clears buffer", () => {
    const buffer = new UndoBuffer<{ id: string }>({ timeoutMs: 5000 });
    buffer.push({ id: "task-1" });

    expect(buffer.undo()).toEqual({ id: "task-1" });
    expect(buffer.hasPending()).toBe(false);

    vi.advanceTimersByTime(5000);
    expect(buffer.undo()).toBeNull();
  });

  it("replaces previous pending delete with a new one", () => {
    const onExpire = vi.fn();
    const buffer = new UndoBuffer<{ id: string }>({ onExpire, timeoutMs: 5000 });

    buffer.push({ id: "first" });
    buffer.push({ id: "second" });

    expect(buffer.undo()).toEqual({ id: "second" });
    expect(onExpire).not.toHaveBeenCalled();
  });

  it("commit clears pending without returning item", () => {
    const buffer = new UndoBuffer<{ id: string }>({ timeoutMs: 5000 });
    buffer.push({ id: "task-1" });

    buffer.commit();
    expect(buffer.hasPending()).toBe(false);
    expect(buffer.undo()).toBeNull();
  });
});
