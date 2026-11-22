import { expect, test } from "@playwright/test";
import users from "./users.json" with { type: "json" };
import { BoardPage, LoginPage } from "./tests/pages/buggy-board-pages";

test("logs in and changes the first bug's severity", async ({ page }) => {
  const user = users[0];
  const loginPage = new LoginPage(page);
  const boardPage = new BoardPage(page);

  await loginPage.login(user.username, user.password);
  await expect(page).toHaveURL(/\/board$/);
  await expect(boardPage.bugRows.first()).toBeVisible();

  const firstBugRow = boardPage.bugRows.first();
  const bugId = (await firstBugRow.getByRole("cell").nth(0).innerText()).trim();
  const editModal = await boardPage.openFirstBug();
  await expect(editModal.dialog.getByRole("heading")).toHaveText(`Edit bug #${bugId}`);

  const currentSeverity = await editModal.severity.inputValue();
  const updatedSeverity = currentSeverity === "high" ? "mid" : "high";
  await editModal.severity.selectOption(updatedSeverity);
  await editModal.save();

  await expect(editModal.dialog).toBeHidden();
  await expect(boardPage.bugRowById(bugId)).toContainText(updatedSeverity.toUpperCase());
});
