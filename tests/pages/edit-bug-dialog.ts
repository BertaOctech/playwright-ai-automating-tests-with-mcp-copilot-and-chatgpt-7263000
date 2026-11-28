import type { Locator, Page } from '@playwright/test';

export class EditBugDialog {
  readonly dialog: Locator;
  readonly severity: Locator;

  constructor(page: Page, bugId: number) {
    this.dialog = page.getByRole('dialog', { name: `Edit bug #${bugId}` });
    this.severity = this.dialog.getByLabel('Severity');
  }
}