// @ts-check
const { test, expect } = require('@playwright/test');

test('navbar dropdown toggle button is not visible on large screens', async ({ page }) => {
  await page.goto('index.html');
  await page.setViewportSize({ width: 1024, height: 768 });
  const dropdownButton = await page.locator('#navbar-dropdown-toggle');
  const navbar_links = await page.locator('.navbar-links');
  await expect(dropdownButton).not.toBeVisible();
  await expect(navbar_links).toBeVisible();
});

test('navbar dropdown is visible on small screens', async ({ page }) => {
  await page.goto('index.html');
  await page.setViewportSize({ width: 320, height: 768 });
  const dropdownButton = await page.locator('#navbar-dropdown-toggle');
  const navbar_links = await page.locator('.navbar-links');
  await expect(dropdownButton).toBeVisible();
  await expect(navbar_links).not.toBeVisible();
});

test('navbar dropdown toggle button toggles dropdown visibility', async ({ page }) => {
  await page.goto('index.html');
  await page.setViewportSize({ width: 320, height: 768 });
  const dropdownButton = await page.locator('#navbar-dropdown-toggle');
  const navbar_links = await page.locator('.navbar-links');
  await expect(dropdownButton).toBeVisible();
  await expect(navbar_links).not.toBeVisible();

  await dropdownButton.click();
  await expect(navbar_links).toBeVisible();
  await dropdownButton.click();
  await expect(navbar_links).not.toBeVisible();
});

test('navbar dropdown toggle button toggles between hamburger and close icons', async ({ page }) => {
  await page.goto('index.html');
  await page.setViewportSize({ width: 320, height: 768 });
  const dropdownButton = await page.locator('#navbar-dropdown-toggle');
  await expect(dropdownButton).toHaveText('☰');

  await dropdownButton.click();
  await expect(dropdownButton).toHaveText('✖');

  await dropdownButton.click();
  await expect(dropdownButton).toHaveText('☰');
});

test('navbar dropdown is hidden when window is resized to large screen', async ({ page }) => {
  await page.goto('index.html');
  await page.setViewportSize({ width: 320, height: 768 });
  const dropdownButton = await page.locator('#navbar-dropdown-toggle');
  const navbar_links = await page.locator('.navbar-links');
  await expect(dropdownButton).toBeVisible();
  await expect(navbar_links).not.toBeVisible();

  await dropdownButton.click(); // dropdown now open
  await expect(navbar_links).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 768 }); // moves to large screen - dropdown should close
  await expect(dropdownButton).not.toBeVisible();
  await expect(navbar_links).toBeVisible();
  await page.setViewportSize({ width: 320, height: 768 }); // moves to small screen - dropdown should remain closed
  await expect(dropdownButton).toBeVisible();
  await expect(navbar_links).not.toBeVisible();
});

