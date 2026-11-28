import type { Locator, Page } from '@playwright/test';

export class BugBoardPage {
  constructor(private readonly page: Page) {}

  bugRow(title: string): Locator {
    return this.page.getByRole('button', { name: title });
  }

  severityBadge(title: string): Locator {
    return this.bugRow(title).locator('.severity-badge');
  }

  async openBug(title: string): Promise<void> {
    await this.bugRow(title).click();
  }
}