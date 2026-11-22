import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string): Promise<void> {
    await this.page.goto("/login");
    await this.page.getByLabel("Username").fill(username);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}

export class BoardPage {
  readonly bugRows: Locator;

  constructor(private readonly page: Page) {
    this.bugRows = page
      .getByRole("table", { name: "Bugs" })
      .locator("tbody tr[role='button']");
  }

  async openFirstBug(): Promise<EditBugModal> {
    await this.bugRows.first().click();
    return new EditBugModal(this.page);
  }

  bugRowById(id: string): Locator {
    return this.bugRows.filter({
      has: this.page.getByRole("cell", { name: id, exact: true }),
    });
  }
}

export class EditBugModal {
  readonly dialog: Locator;
  readonly severity: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole("dialog");
    this.severity = this.dialog.getByLabel("Severity");
  }

  async save(): Promise<void> {
    await this.dialog.getByRole("button", { name: "Save", exact: true }).click();
  }
}
