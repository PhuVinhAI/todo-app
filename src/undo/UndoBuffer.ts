export type UndoBufferOptions = {
  timeoutMs?: number;
  onExpire?: () => void;
};

export class UndoBuffer<T> {
  private pending: T | null = null;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private readonly timeoutMs: number;
  private readonly onExpire?: () => void;

  constructor(options: UndoBufferOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? 5000;
    this.onExpire = options.onExpire;
  }

  hasPending(): boolean {
    return this.pending !== null;
  }

  push(item: T): void {
    this.clearTimer();
    this.pending = item;
    this.timerId = setTimeout(() => {
      this.pending = null;
      this.timerId = null;
      this.onExpire?.();
    }, this.timeoutMs);
  }

  undo(): T | null {
    const item = this.pending;
    this.clearTimer();
    this.pending = null;
    return item;
  }

  commit(): void {
    this.clearTimer();
    this.pending = null;
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
