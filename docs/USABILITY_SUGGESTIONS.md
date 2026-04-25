# Usability Suggestions

UX improvement ideas focused on making basic financial tracking fast and intuitive, especially on mobile.

## 1. Floating Action Button (FAB)

A fixed `+` button in the bottom-right corner on mobile. Allows starting a new transaction from anywhere without scrolling or searching for the action button.

**Status**: Implemented in `ViewDefault` via `TransactionTypeModal`.

## 2. Haptic and visual feedback

Add vibration (Haptic Feedback) on save and smooth success animations (e.g., green checkmark). Provides immediate sensory confirmation of actions.

## 3. Optimized numeric keyboard

Ensure monetary value fields use `inputMode="decimal"` to open the numeric keyboard on mobile. Reduces taps and speeds up entry.

## 4. Swipe gestures

In the transaction list, allow swiping left to reveal Edit/Delete actions. Accelerates record maintenance without opening a detail screen.

## 5. Smart pre-selection

When opening the new expense modal, auto-focus the amount field. User flow: open -> type amount -> pick category -> save (~3 seconds).

## 6. Persistent privacy mode

The eye-toggle to hide monetary values should persist the user's preference across sessions. Already implemented via `usePreferencesStore`.
