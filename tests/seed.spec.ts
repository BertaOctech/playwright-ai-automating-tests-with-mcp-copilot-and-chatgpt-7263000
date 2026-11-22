import { expect, test } from "@playwright/test";
import users from "../users.json" with { type: "json" };
import { LoginPage } from "./pages/buggy-board-pages";

test("logs in with the first user", { tag: '@seed' }, async ({ page }) => {
  const user = users[0];
  const loginPage = new LoginPage(page);

  await loginPage.login(user.username, user.password);

  await expect(page).toHaveURL(/\/board$/);
});
