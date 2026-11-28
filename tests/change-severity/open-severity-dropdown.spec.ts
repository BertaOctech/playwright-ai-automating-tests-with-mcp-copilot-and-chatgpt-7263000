import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BugBoardPage } from '../pages/bug-board-page';
import { EditBugDialog } from '../pages/edit-bug-dialog';
import { LoginPage } from '../pages/login-page';

interface User { username: string; password: string }
interface Bug { id: number; title: string; severity: string; owner: string; description: string; state: string }

test.describe('Change Bug Severity - Open severity dropdown', () => {
  let bugId: number | undefined;
  let title: string;

  test.beforeEach(async ({ page, request }, testInfo) => {
    // Create an isolated fixture through the API before opening the browser page.
    title = `Severity test - dropdown choices - ${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}`;
    const apiBaseUrl = process.env.BUGGYBOARD_API_URL ?? 'http://localhost:3000';
    const createResponse = await request.post(`${apiBaseUrl}/api/bugs`, {
      data: {
        title,
        severity: 'high',
        owner: 'buggy',
        description: 'Isolated fixture for severity dropdown choices',
      },
    });

    expect(createResponse.status()).toBe(201);
    const createdBug = await createResponse.json() as Bug;
    bugId = createdBug.id;

    const bugResponse = await request.get(`${apiBaseUrl}/api/bugs/${bugId}`);
    expect(bugResponse.ok()).toBeTruthy();
    await expect(bugResponse.json()).resolves.toMatchObject({
      id: bugId,
      title,
      severity: 'HIGH',
      owner: 'buggy',
      description: 'Isolated fixture for severity dropdown choices',
      state: 'OPEN',
    });

    const usersPath = join(process.cwd(), 'users.json');
    const rawUsers = readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(rawUsers) as User[];
    const firstUser = users[0];

    await new LoginPage(page).login(firstUser.username, firstUser.password);
  });

  test.afterEach(async ({ request }) => {
    // Remove only the bug created for this test.
    if (bugId === undefined) return;

    const apiBaseUrl = process.env.BUGGYBOARD_API_URL ?? 'http://localhost:3000';
    const deleteResponse = await request.delete(`${apiBaseUrl}/api/bugs/${bugId}`);
    expect(deleteResponse.status()).toBe(204);
    bugId = undefined;
  });

  test('should show available severities and HIGH color coding when editing a bug', async ({ page }) => {
    const boardPage = new BugBoardPage(page);
    const bugRow = boardPage.bugRow(title);
    await expect(bugRow).toBeVisible();

    const boardSeverity = boardPage.severityBadge(title);
    await expect(boardSeverity).toBeVisible();
    await expect(boardSeverity).toHaveText('HIGH');
    await boardPage.openBug(title);

    if (bugId === undefined) throw new Error('Test bug fixture was not created');
    const editBugDialog = new EditBugDialog(page, bugId);
    await expect(editBugDialog.dialog).toBeVisible();

    const severity = editBugDialog.severity;
    await expect(severity.locator('option')).toHaveText(['HIGH', 'MID', 'LOW']);
    await expect(severity).toHaveValue('high');

    const highColor = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--color-severity-high)';
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    // The board badge and edit control should both use the HIGH design token.
    await expect(boardSeverity).toHaveCSS('color', highColor);
    await expect(severity).toHaveCSS('color', highColor);
  });
});
