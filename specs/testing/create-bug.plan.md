# BuggyBoard: Create a Bug E2E Test Plan

## Application Overview

Focused end-to-end coverage for creating a bug from the authenticated BuggyBoard board. The running app was explored via Playwright MCP. The create dialog exposes Title, Severity (defaults to MID), Owner (prefilled with the signed-in user), and Description; a valid save closes the dialog and adds a row. Empty title/description and a cleared owner produce required-field alerts. The backdrop preserves the open form and its values; Escape and the X close it. The selected severity control applies severity-specific styles. One spec mismatch to account for: severity has no blank option, so a blank-severity user-flow test is currently not representable.

## Test Scenarios

### 1. Creating a new bug

**Seed:** `tests/seed.spec.ts`

#### 1.1. should open the create-bug form with required fields and defaults

**File:** `tests/create-bug/open-create-bug-modal.spec.ts`

**Steps:**
  1. Use the seed login to reach the authenticated board, then click New Bug.
    - expect: The Create bug dialog is visible.
    - expect: Title, Severity, Owner, and Description controls are present.
    - expect: Severity offers HIGH, MID, and LOW and initially selects MID.
    - expect: Owner is prefilled with the signed-in user's name.
    - expect: Save, Cancel, and the Close (X) control are available.

#### 1.2. should save a bug with all entered values and a generated ID

**File:** `tests/create-bug/save-new-bug.spec.ts`

**Steps:**
  1. Open New Bug; enter a unique title containing special characters, select HIGH, leave the current-user owner value, and enter a description containing < and >.
    - expect: The selected severity displays the HIGH severity styling.
  2. Capture the POST /api/bugs response, click Save, then reload the board.
    - expect: The dialog closes after save.
    - expect: The create response contains the submitted title, severity, owner, and description, plus an integer ID.
    - expect: After reload, the board contains exactly one row for the unique title with HIGH severity, the expected owner, and the generated ID.

#### 1.3. should prevent saving when title or description is blank

**File:** `tests/create-bug/required-fields.spec.ts`

**Steps:**
  1. Open New Bug with defaults intact and click Save while Title and Description are blank.
    - expect: The dialog remains open and no create request succeeds.
    - expect: The user sees required-field messages for Title and Description.

#### 1.4. should prevent saving when the owner is cleared

**File:** `tests/create-bug/required-fields.spec.ts`

**Steps:**
  1. Enter valid Title and Description, clear the prefilled Owner, and click Save.
    - expect: The dialog remains open and no create request succeeds.
    - expect: The user sees an Owner is required message.

#### 1.5. should cancel without creating a bug

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Enter a unique title and some other draft data, then click Cancel.
    - expect: The dialog closes.
    - expect: After reload, no row exists for the draft title.

#### 1.6. should close without creating a bug using X or Escape

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. For each dismissal method, reopen the dialog, enter a unique title, then use the Close (X) control or press Escape.
    - expect: Each action closes the dialog without saving.
    - expect: After reload, no row exists for either draft title.

#### 1.7. should preserve draft data when the backdrop is clicked

**File:** `tests/create-bug/dismiss-create-bug.spec.ts`

**Steps:**
  1. Open New Bug, enter Title and Description, then click the dimmed backdrop outside the dialog.
    - expect: The dialog remains open.
    - expect: The entered Title and Description remain unchanged.
    - expect: No bug is created.

#### 1.8. should apply matching styling for each selected severity

**File:** `tests/create-bug/severity-selection.spec.ts`

**Steps:**
  1. Open New Bug and select HIGH, MID, and LOW in turn.
    - expect: Each selected value is shown in the control.
    - expect: The control's computed text and background tint match the corresponding severity design tokens (HIGH #b84a2e, MID #a67c47, LOW #4a6b5e).
