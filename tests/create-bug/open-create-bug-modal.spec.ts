import { test, expect } from '../fixtures/pages';

test.describe('Create Bug - Open create-bug modal from board', () => {
  test('should open the create-bug modal from the board page', async ({ page, loginPage, boardPage, createBugModal }) => {
    // Authenticate and verify successful navigation to the board
    await loginPage.loginWithFirstUser();
    await expect(page).toHaveURL(/\/board$/);

    // Verify the board title bar
    await expect(page.getByRole('heading', { name: 'BuggyBoard' })).toBeVisible();
    await expect(boardPage.newBugButton).toBeVisible();

    // Open the create-bug modal
    await boardPage.clickNewBugButton();

    // Verify the modal and all of its controls
    await expect(createBugModal.dialog).toBeVisible();
    await expect(createBugModal.titleInput).toBeVisible();
    await expect(createBugModal.severitySelect).toBeVisible();
    await expect(createBugModal.ownerInput).toBeVisible();
    await expect(createBugModal.descriptionInput).toBeVisible();
    await expect(createBugModal.saveButton).toBeVisible();
    await expect(createBugModal.cancelButton).toBeVisible();
  });
});
