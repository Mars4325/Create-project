const { test, expect } = require('@playwright/test');

test.describe('TaskHub QA Sandbox - Basic UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('should load the main page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('TaskHub QA Sandbox');

    // Check header is visible
    await expect(page.locator('h1')).toContainText('TaskHub QA Sandbox');

    // Check navigation buttons are present
    await expect(page.locator('.nav-btn').filter({ hasText: 'Дашборд' })).toBeVisible();
    await expect(page.locator('.nav-btn').filter({ hasText: 'Пользователи' })).toBeVisible();
    await expect(page.locator('.nav-btn').filter({ hasText: 'Проекты' })).toBeVisible();
    await expect(page.locator('.nav-btn').filter({ hasText: 'Тест-кейсы' })).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Dashboard should be active by default
    await expect(page.locator('#dashboard')).toHaveClass(/active/);

    // Navigate to Users section
    await page.locator('.nav-btn').filter({ hasText: 'Пользователи' }).click();
    await expect(page.locator('#users')).toHaveClass(/active/);
    await expect(page.locator('#dashboard')).not.toHaveClass(/active/);

    // Navigate to Projects section
    await page.locator('.nav-btn').filter({ hasText: 'Проекты' }).click();
    await expect(page.locator('#projects')).toHaveClass(/active/);
    await expect(page.locator('#users')).not.toHaveClass(/active/);

    // Navigate to Test Cases section
    await page.locator('.nav-btn').filter({ hasText: 'Тест-кейсы' }).click();
    await expect(page.locator('#test-cases')).toHaveClass(/active/);
    await expect(page.locator('#projects')).not.toHaveClass(/active/);
  });

  test('should display dashboard statistics', async ({ page }) => {
    // Check dashboard stats are present
    await expect(page.locator('#users-count')).toBeVisible();
    await expect(page.locator('#projects-count')).toBeVisible();
    await expect(page.locator('#test-cases-count')).toBeVisible();
    await expect(page.locator('#active-tests-count')).toBeVisible();

    // Stats should be numbers (including 0)
    const usersCount = await page.locator('#users-count').textContent();
    const projectsCount = await page.locator('#projects-count').textContent();
    const testCasesCount = await page.locator('#test-cases-count').textContent();
    const activeTestsCount = await page.locator('#active-tests-count').textContent();

    expect(isNaN(parseInt(usersCount))).toBe(false);
    expect(isNaN(parseInt(projectsCount))).toBe(false);
    expect(isNaN(parseInt(testCasesCount))).toBe(false);
    expect(isNaN(parseInt(activeTestsCount))).toBe(false);
  });

  test('should have working quick actions', async ({ page }) => {
    // Check quick action buttons are present
    await expect(page.locator('.action-btn').filter({ hasText: 'Создать пользователя' })).toBeVisible();
    await expect(page.locator('.action-btn').filter({ hasText: 'Создать проект' })).toBeVisible();
    await expect(page.locator('.action-btn').filter({ hasText: 'Создать тест-кейс' })).toBeVisible();
    await expect(page.locator('.action-btn').filter({ hasText: 'API Документация' })).toBeVisible();
  });

  test('should open API docs in new tab', async ({ page, context }) => {
    // Click API docs button
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('.action-btn').filter({ hasText: 'API Документация' }).click()
    ]);

    // Check new page is opened with correct URL
    await expect(newPage).toHaveURL(/.*api-docs/);
  });

  test('should display users table', async ({ page }) => {
    // Navigate to users section
    await page.locator('.nav-btn').filter({ hasText: 'Пользователи' }).click();

    // Check users table is present
    await expect(page.locator('#users-table')).toBeVisible();

    // Check table headers
    await expect(page.locator('#users-table thead')).toContainText('Имя пользователя');
    await expect(page.locator('#users-table thead')).toContainText('Email');
    await expect(page.locator('#users-table thead')).toContainText('Роль');
    await expect(page.locator('#users-table thead')).toContainText('Дата создания');
    await expect(page.locator('#users-table thead')).toContainText('Действия');
  });

  test('should display projects table', async ({ page }) => {
    // Navigate to projects section
    await page.locator('.nav-btn').filter({ hasText: 'Проекты' }).click();

    // Check projects table is present
    await expect(page.locator('#projects-table')).toBeVisible();

    // Check table headers
    await expect(page.locator('#projects-table thead')).toContainText('Название');
    await expect(page.locator('#projects-table thead')).toContainText('Описание');
    await expect(page.locator('#projects-table thead')).toContainText('Владелец');
    await expect(page.locator('#projects-table thead')).toContainText('Статус');
    await expect(page.locator('#projects-table thead')).toContainText('Тест-кейсов');
    await expect(page.locator('#projects-table thead')).toContainText('Действия');
  });

  test('should display test cases table', async ({ page }) => {
    // Navigate to test cases section
    await page.locator('.nav-btn').filter({ hasText: 'Тест-кейсы' }).click();

    // Check test cases table is present
    await expect(page.locator('#test-cases-table')).toBeVisible();

    // Check table headers
    await expect(page.locator('#test-cases-table thead')).toContainText('Название');
    await expect(page.locator('#test-cases-table thead')).toContainText('Проект');
    await expect(page.locator('#test-cases-table thead')).toContainText('Приоритет');
    await expect(page.locator('#test-cases-table thead')).toContainText('Статус');
    await expect(page.locator('#test-cases-table thead')).toContainText('Исполнитель');
    await expect(page.locator('#test-cases-table thead')).toContainText('Действия');
  });

  test('should open user creation modal', async ({ page }) => {
    // Navigate to users section
    await page.locator('.nav-btn').filter({ hasText: 'Пользователи' }).click();

    // Click create user button
    await page.locator('.btn-primary').filter({ hasText: 'Создать пользователя' }).click();

    // Check modal is opened
    await expect(page.locator('#user-modal')).toBeVisible();
    await expect(page.locator('#user-modal-title')).toContainText('Создать пользователя');

    // Check form fields are present
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#role')).toBeVisible();
  });

  test('should close modal when clicking outside', async ({ page }) => {
    // Navigate to users section and open modal
    await page.locator('.nav-btn').filter({ hasText: 'Пользователи' }).click();
    await page.locator('.btn-primary').filter({ hasText: 'Создать пользователя' }).click();

    // Click outside modal (on modal background)
    await page.locator('.modal').click({ position: { x: 10, y: 10 } });

    // Check modal is closed
    await expect(page.locator('#user-modal')).not.toBeVisible();
  });
});
