/**
 * Utility functions for working with safe areas
 */

/**
 * Get safe area inset value from CSS variable
 * @param property - CSS variable name (e.g., '--safe-area-inset-top')
 * @returns Safe area inset value in pixels, or 0 if not available
 */
export function getSafeAreaInset(property: string): number {
  if (globalThis.window === undefined) return 0;

  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();

  // Parse value (e.g., "44px" -> 44)
  const regex = /(\d+(?:\.\d+)?)px/;
  const match = RegExp.prototype.exec.call(regex, value);
  return match ? Number.parseFloat(match[1]) : 0;
}

/**
 * Calculate padding with safe area inset
 * @param basePadding - Base padding value in pixels
 * @param insetProperty - CSS variable name for safe area inset
 * @returns Calculated padding value in pixels
 *
 * @example
 * ```tsx
 * const paddingTop = calculateSafePadding(16, '--safe-area-inset-top');
 * // Returns 16 + safe area top inset
 * ```
 */
export function calculateSafePadding(basePadding: number, insetProperty: string): number {
  return basePadding + getSafeAreaInset(insetProperty);
}

/**
 * Get all safe area insets as an object
 * @returns Object with top, right, bottom, left safe area insets
 */
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  return {
    top: getSafeAreaInset('--safe-area-inset-top'),
    right: getSafeAreaInset('--safe-area-inset-right'),
    bottom: getSafeAreaInset('--safe-area-inset-bottom'),
    left: getSafeAreaInset('--safe-area-inset-left'),
  };
}

/**
 * Check if device supports safe areas
 * @returns true if safe areas are supported and have non-zero values
 */
export function hasSafeAreas(): boolean {
  const insets = getSafeAreaInsets();
  return insets.top > 0 || insets.right > 0 || insets.bottom > 0 || insets.left > 0;
}

/**
 * Format safe area inset for CSS
 * @param value - Safe area inset value in pixels
 * @returns CSS value string (e.g., "44px")
 */
export function formatSafeAreaValue(value: number): string {
  return `${value}px`;
}
