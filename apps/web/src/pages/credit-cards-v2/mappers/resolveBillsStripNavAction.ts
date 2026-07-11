export type BillsStripNavDirection = 'left' | 'right';

export interface BillsStripNavLastClick {
  readonly direction: BillsStripNavDirection;
  readonly at: number;
}

export interface ResolveBillsStripNavActionInput {
  readonly direction: BillsStripNavDirection;
  readonly now: number;
  readonly lastClick: BillsStripNavLastClick | null;
  readonly doubleTapMs?: number;
}

export interface ResolveBillsStripNavActionResult {
  readonly action: 'step' | 'edge';
  readonly nextLastClick: BillsStripNavLastClick | null;
}

const DEFAULT_DOUBLE_TAP_MS = 350;

export function resolveBillsStripNavAction({
  direction,
  now,
  lastClick,
  doubleTapMs = DEFAULT_DOUBLE_TAP_MS,
}: ResolveBillsStripNavActionInput): ResolveBillsStripNavActionResult {
  if (lastClick && lastClick.direction === direction && now - lastClick.at < doubleTapMs) {
    return {
      action: 'edge',
      nextLastClick: null,
    };
  }

  return {
    action: 'step',
    nextLastClick: { direction, at: now },
  };
}
