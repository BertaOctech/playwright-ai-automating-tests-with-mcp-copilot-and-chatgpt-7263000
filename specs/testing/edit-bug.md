# Edit Bug End-to-End Test Plan

## Application Overview

Validate BuggyBoard's edit-bug modal from opening a valid existing bug through field editability, severity choices and design-token colors, persistence, dismissal without saving, backdrop behavior, and save-button validation. Each test is independent and starts from a fresh authenticated state using the existing bug fixture; capture the bug's actual ID and original values instead of assuming a fixed ID. Use a disposable/resettable fixture bug for mutations. The seed file authenticates with the first user; it does not create bug data.

## Test Scenarios

### 1. Edit Bug

**Seed:** `tests/seed.spec.ts`

#### 1.1. Open a bug and verify modal identity and field editability

**File:** `tests/edit-bug/open-bug-and-verify-fields.spec.ts`

**Steps:**
  1. Starting from an independently seeded authenticated session with a valid existing bug fixture, record a row's actual ID and displayed title, severity, and owner; use a record with non-empty title, owner, and description.
    - expect: The chosen bug exists in the board fixture and has a valid severity of HIGH, MID, or LOW.
  2. Click the chosen bug's board row.
    - expect: An edit dialog opens.
    - expect: The dialog title is exactly "Edit bug #<actual ID>".
    - expect: The dialog displays that bug's ID, title, severity, owner, and description.
    - expect: Save and Cancel controls are visible.
  3. Inspect the ID control and attempt to focus and change it; then enter temporary distinct values into title, owner, and description, and choose another available severity.
    - expect: The ID is displayed but cannot be edited.
    - expect: Title, severity, owner, and description accept edits.
    - expect: Temporary edits do not change the stored bug because Save was not used.

#### 1.2. Verify severity choices and color consistency with the board

**File:** `tests/edit-bug/severity-options-and-colors.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open an existing fixture bug and note the severity badge's computed color on the board before opening its row.
    - expect: The selected bug has valid fixture data and the severity badge is visible on the board.
  2. Inspect the severity control and its available options; select HIGH, MID, and LOW in turn, checking each selected display against the corresponding board severity badge and CSS custom property.
    - expect: Severity is a dropdown offering exactly HIGH, MID, and LOW.
    - expect: HIGH uses the strong terracotta token #b84a2e (--color-severity-high).
    - expect: MID uses the amber token #a67c47 (--color-severity-mid).
    - expect: LOW uses the muted sage token #4a6b5e (--color-severity-low).
    - expect: The selected severity text (and optional light background tint) matches the corresponding board severity styling.

#### 1.3. Save edits and verify they persist after reopening

**File:** `tests/edit-bug/save-persisted-changes.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a disposable valid fixture bug and record its actual ID and original title, severity, owner, and description.
    - expect: The selected bug is a valid existing fixture record with all required fields populated.
  2. Change one or more editable fields to distinct valid values and click Save.
    - expect: The dialog closes.
    - expect: The board displays the updated values for the same bug.
  3. Open the same bug again using its row.
    - expect: The reopened dialog shows the saved values, confirming persistence beyond the initial modal close.
    - expect: The bug ID remains unchanged.

#### 1.4. Cancel edits without saving

**File:** `tests/edit-bug/cancel-preserves-original.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug and capture its original title, severity, owner, and description.
    - expect: The original values are available for comparison.
  2. Change one or more fields to distinct valid values and click Cancel.
    - expect: The dialog closes.
  3. Reopen the same bug from its board row.
    - expect: The dialog shows the original values; none of the unsaved edits were persisted.

#### 1.5. Close with X without saving

**File:** `tests/edit-bug/x-preserves-original.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug and capture its original field values.
    - expect: The edit dialog is open for the selected bug.
  2. Change one or more fields to distinct valid values, then click the X control in the dialog's upper-right corner.
    - expect: The dialog closes.
  3. Reopen the same bug.
    - expect: The original values remain unchanged and no unsaved edit was persisted.

#### 1.6. Close with Escape without saving

**File:** `tests/edit-bug/escape-preserves-original.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug and capture its original field values.
    - expect: The edit dialog is open for the selected bug.
  2. Change one or more fields to distinct valid values and press Escape.
    - expect: The dialog closes.
  3. Reopen the same bug.
    - expect: The original values remain unchanged and no unsaved edit was persisted.

#### 1.7. Backdrop click preserves the open dialog and edits

**File:** `tests/edit-bug/backdrop-preserves-edits.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug and enter a distinct temporary value in an editable field.
    - expect: The edit dialog remains open with the temporary value present before the backdrop click.
  2. Click the dimmed backdrop outside the dialog.
    - expect: The dialog remains open.
    - expect: The temporary field value is preserved.
    - expect: The bug's stored values remain unchanged because Save was not used.

#### 1.8. Save is disabled when no fields have changed

**File:** `tests/edit-bug/save-disabled-without-changes.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug and do not modify any field.
    - expect: The dialog displays the existing valid fixture values.
  2. Inspect the Save control without changing the form.
    - expect: Save is disabled while all fields match their original values.

#### 1.9. Save is disabled when a required field is blank

**File:** `tests/edit-bug/save-disabled-required-fields.spec.ts`

**Steps:**
  1. In a fresh authenticated session, open a valid fixture bug with all required fields populated.
    - expect: The dialog has non-empty title, severity, owner, and description values initially.
  2. Clear each required field in turn (title, owner, and description); where the severity control permits an empty selection, select it. Restore the original value between checks so each field is tested independently.
    - expect: Save becomes disabled whenever a required field is blank.
    - expect: The user cannot save while a required field is blank.
    - expect: After restoring all required fields to non-empty valid values, Save becomes enabled because the form differs from its original state.
