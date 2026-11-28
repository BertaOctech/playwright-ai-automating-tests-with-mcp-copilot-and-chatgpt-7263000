# Change Bug Severity End-to-End Test Plan

## Application Overview

Plan independent, parallel-safe end-to-end tests for changing bug severity, including save, cancel, modal behavior, and validation.

### Setup

- Run `node tests/fixtures/seed-severity-bugs.mjs` before the suite to prepare baseline HIGH, MID, and LOW bugs.
- Before browser actions, each scenario creates its own bug via `POST /api/bugs` with a unique run/worker title, lower-case severity, owner `buggy`, and description. Omit state; the API defaults it to `OPEN`.
- Authenticate using `tests/seed.spec.ts` after creating the scenario bug.

### Isolation and Cleanup

- Never modify or delete the persistent baseline bugs. Each test uses only its own API-created bug.
- Delete that bug by its returned ID with `DELETE /api/bugs/:id` during teardown, including after failures; expect status 204.

### UI Limitation

The severity dropdown only offers HIGH, MID, and LOW, so blank-severity validation cannot be tested through the UI unless the control gains an empty option.

## Test Scenarios

### 1. Change Bug Severity

**Seed:** `tests/seed.spec.ts`

#### 1.1. Open an existing bug and verify severity choices and color coding

**File:** `tests/change-severity/open-severity-dropdown.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, create a unique bug via POST /api/bugs with title 'Severity test - dropdown choices - <unique run/worker ID>', severity 'high', owner 'buggy', and description 'Isolated fixture for severity dropdown choices'. Omit state so it defaults to Open.
    - expect: The API returns 201 and a bug ID.
    - expect: The created bug has the requested unique title, severity HIGH, owner buggy, description, and Open state.
  2. After API setup, use tests/seed.spec.ts as the login seed convention, then locate this scenario's bug by its exact unique title and open its row.
    - expect: Login succeeds and the board is displayed.
    - expect: The selected row belongs to this scenario-specific fixture, not a persistent baseline row.
  3. Inspect the Edit bug dialog and its Severity dropdown without changing or saving any values.
    - expect: The dialog title identifies the fixture by ID.
    - expect: The Severity control offers exactly HIGH, MID, and LOW, with HIGH selected.
    - expect: The selected severity's text color matches the HIGH design token and board styling.
  4. In teardown, delete only this scenario-created bug by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204.
    - expect: The three persistent baseline rows remain untouched.

#### 1.2. Save a change to HIGH severity

**File:** `tests/change-severity/save-high-severity.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - save HIGH - <unique run/worker ID>' with severity 'low', owner 'buggy', and description 'Isolated fixture for saving HIGH severity'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with the requested title, LOW severity, owner, and description.
  2. After API setup, follow tests/seed.spec.ts for login, then locate the exact scenario fixture and open its row.
    - expect: The board is displayed and the scenario fixture shows LOW.
    - expect: No persistent baseline row is selected or modified.
  3. Select HIGH in the Severity dropdown and click Save, then verify the board row, reload the board, and reopen the same fixture.
    - expect: Save is enabled after the severity change.
    - expect: The dialog closes and the row displays HIGH.
    - expect: After reload, the row and edit dropdown retain HIGH and the bug remains Open.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; baseline rows are not changed.

#### 1.3. Save a change to MID severity

**File:** `tests/change-severity/save-mid-severity.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - save MID - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for saving MID severity'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with the requested title, HIGH severity, owner, and description.
  2. After API setup, follow tests/seed.spec.ts for login, then locate the exact scenario fixture and open its row.
    - expect: The board is displayed and the scenario fixture shows HIGH.
    - expect: No persistent baseline row is selected or modified.
  3. Select MID in the Severity dropdown and click Save, then verify the board row, reload the board, and reopen the same fixture.
    - expect: Save is enabled after the severity change.
    - expect: The dialog closes and the row displays MID.
    - expect: After reload, the row and edit dropdown retain MID and the bug remains Open.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; baseline rows are not changed.

#### 1.4. Save a change to LOW severity

**File:** `tests/change-severity/save-low-severity.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - save LOW - <unique run/worker ID>' with severity 'mid', owner 'buggy', and description 'Isolated fixture for saving LOW severity'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with the requested title, MID severity, owner, and description.
  2. After API setup, follow tests/seed.spec.ts for login, then locate the exact scenario fixture and open its row.
    - expect: The board is displayed and the scenario fixture shows MID.
    - expect: No persistent baseline row is selected or modified.
  3. Select LOW in the Severity dropdown and click Save, then verify the board row, reload the board, and reopen the same fixture.
    - expect: Save is enabled after the severity change.
    - expect: The dialog closes and the row displays LOW.
    - expect: After reload, the row and edit dropdown retain LOW and the bug remains Open.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; baseline rows are not changed.

#### 1.5. Cancel a severity change without saving

**File:** `tests/change-severity/cancel-severity-change.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - cancel - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for cancel behavior'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and the requested owner and description.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, then click Cancel.
    - expect: The dialog closes and the board still displays HIGH.
  3. Reopen this same fixture.
    - expect: The Severity dropdown still has HIGH selected; LOW was not persisted.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.6. Close with X without saving a severity change

**File:** `tests/change-severity/close-x-without-saving.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - close X - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for close X behavior'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and the requested owner and description.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, then click the dialog's X/Close control.
    - expect: The dialog closes and the board still displays HIGH.
  3. Reopen this same fixture.
    - expect: The Severity dropdown still has HIGH selected; the unsaved LOW value was not persisted.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.7. Press Escape without saving a severity change

**File:** `tests/change-severity/escape-without-saving.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - Escape - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for Escape behavior'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and the requested owner and description.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, then press Escape.
    - expect: The dialog closes and the board still displays HIGH.
  3. Reopen this same fixture.
    - expect: The Severity dropdown still has HIGH selected; the unsaved LOW value was not persisted.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.8. Backdrop click preserves an unsaved severity selection

**File:** `tests/change-severity/backdrop-preserves-severity.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - backdrop - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for backdrop behavior'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and the requested owner and description.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, and select LOW.
    - expect: LOW is selected in the open dialog; the board value remains HIGH until saved.
  3. Click the dimmed backdrop outside the dialog, then click Cancel and inspect the row.
    - expect: The backdrop click leaves the dialog open with LOW selected.
    - expect: Cancel closes the dialog and the board still displays HIGH.
  4. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.9. Save is disabled when severity is unchanged

**File:** `tests/change-severity/unchanged-severity-save-disabled.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - unchanged - <unique run/worker ID>' with severity 'mid', owner 'buggy', and description 'Isolated fixture for unchanged severity'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with MID severity and the requested owner and description.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, and open it without changing fields.
    - expect: The Save button is disabled.
  3. In teardown, delete only this fixture by its API-returned ID.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.10. Save is disabled when the title is blank

**File:** `tests/change-severity/blank-title-save-disabled.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - blank title - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for blank title validation'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and all required fields populated.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, and clear the Title field.
    - expect: The Save button is disabled while Title is blank.
  3. In teardown, delete only this fixture by its API-returned ID, even if the validation assertion fails.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.11. Save is disabled when the owner is blank

**File:** `tests/change-severity/blank-owner-save-disabled.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - blank owner - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for blank owner validation'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and all required fields populated.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, and clear the Owner field.
    - expect: The Save button is disabled while Owner is blank.
  3. In teardown, delete only this fixture by its API-returned ID, even if the validation assertion fails.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.

#### 1.12. Save is disabled when the description is blank

**File:** `tests/change-severity/blank-description-save-disabled.spec.ts`

**Steps:**
  1. Before any browser navigation or interaction, POST a unique bug titled 'Severity test - blank description - <unique run/worker ID>' with severity 'high', owner 'buggy', and description 'Isolated fixture for blank description validation'. Omit state to use the API's Open default.
    - expect: The API returns 201 and the fixture is Open with HIGH severity and all required fields populated.
  2. After API setup, follow tests/seed.spec.ts for login, locate this exact fixture, open it, select LOW, and clear the Description field.
    - expect: The Save button is disabled while Description is blank.
  3. In teardown, delete only this fixture by its API-returned ID, even if the validation assertion fails.
    - expect: DELETE /api/bugs/:id returns 204; persistent baseline rows remain untouched.
