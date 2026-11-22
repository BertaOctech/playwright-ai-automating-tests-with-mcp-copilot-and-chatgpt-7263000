import { expect, test } from "@playwright/test";
import users from "./users.json" with { type: "json" };

test("logs in and creates a new bug", async ({ page }) => {
  const user = users[0];
  const bugTitle = `Playwright test bug ${Date.now()}`;

  await page.goto("/login");
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/board$/);

  await page.getByRole("button", { name: "New Bug" }).click();
  await page.getByLabel("Title", { exact: true }).fill(bugTitle);
  await page.getByLabel("Severity").selectOption("high");
  await page.getByLabel("Owner").fill(user.username);
  await page
    .getByLabel("Description")
    .fill("Created by the Playwright end-to-end test.");
  await page.getByRole("button", { name: "Save" }).click();

  const createdBug = page
    .getByRole("table", { name: "Bugs" })
    .getByRole("button")
    .filter({ hasText: bugTitle });
  await expect(createdBug).toBeVisible();
  await expect(createdBug).toContainText("HIGH");
  await expect(createdBug).toContainText(user.username);
});
