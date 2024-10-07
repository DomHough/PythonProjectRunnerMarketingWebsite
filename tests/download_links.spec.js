const {test, expect} = require("@playwright/test");
test('windows has windows download link', async ({ browser }) => {
  const context = await browser.newContext( { userAgent: 'windows' });
  const page = await context.newPage();
  await page.goto('index.html');

  const downloadLinkContainer = await page.locator('.download-links-container');
  await expect(downloadLinkContainer).toBeVisible();

  const downloadLinks = await downloadLinkContainer.locator('div');
  await expect(downloadLinks).toHaveCount(1);

  const downloadButton = await downloadLinks.locator('button');
  await expect(downloadButton).toBeVisible();
  await expect(downloadButton).toHaveText('Download For Windows');

  const downloadVersionSelect = await downloadLinkContainer.locator('select');
  await expect(downloadVersionSelect).toBeVisible();

  const downloadVersionOptions = await downloadVersionSelect.locator('option');
  await expect(downloadVersionOptions).toHaveCount(2);

  await expect(downloadVersionOptions.nth(0)).toHaveText('x64');

  await expect(downloadVersionOptions.nth(1)).toHaveText('x86');
});

test('linux has linux download link', async ({ browser }) => {
  const context = await browser.newContext( { userAgent: 'linux' });
  const page = await context.newPage();
  await page.goto('index.html');

  const downloadLinkContainer = await page.locator('.download-links-container');await expect(downloadLinkContainer).toBeVisible();

  const downloadLinks = await downloadLinkContainer.locator('div');
  await expect(downloadLinks).toHaveCount(1);

  const downloadButton = await downloadLinks.locator('button');
  await expect(downloadButton).toBeVisible();
  await expect(downloadButton).toHaveText('Download For Linux');
});

test('mac has mac download link', async ({ browser }) => {
  const context = await browser.newContext( { userAgent: 'mac os' });
  const page = await context.newPage();
  await page.goto('index.html');

  const downloadLinkContainer = await page.locator('.download-links-container');
  await expect(downloadLinkContainer).toBeVisible();

  const downloadLinks = await downloadLinkContainer.locator('div');
  await expect(downloadLinks).toHaveCount(1);

  const downloadButton = await downloadLinks.locator('button');
  await expect(downloadButton).toBeVisible();
  await expect(downloadButton).toHaveText('Download For Mac');

  const downloadVersionSelect = await downloadLinkContainer.locator('select');
  await expect(downloadVersionSelect).toBeVisible();

  const downloadVersionOptions = await downloadVersionSelect.locator('option');
  await expect(downloadVersionOptions).toHaveCount(2);

  await expect(downloadVersionOptions.nth(0)).toHaveText('Intel');

  await expect(downloadVersionOptions.nth(1)).toHaveText('Arm');

});

test('unknown has all downlaod links', async ({ browser }) => {
  const context = await browser.newContext( { userAgent: 'unknown' });
  const page = await context.newPage();
  await page.goto('index.html');

  // get '.download-links-container'
  const downloadLinkContainer = await page.locator('.download-links-container');
  await expect(downloadLinkContainer).toBeVisible();
  // get all download links
  const downloadLinks = await downloadLinkContainer.locator('div');
  await expect(downloadLinks).toHaveCount(3);

  var downloadButton = await downloadLinks.locator('button').nth(0);
  await expect(downloadButton).toBeVisible();

  await expect(downloadButton).toHaveText('Download For Windows');
  var downloadButton = await downloadLinks.locator('button').nth(1);
  await expect(downloadButton).toBeVisible();

  await expect(downloadButton).toHaveText('Download For Mac');
  var downloadButton = await downloadLinks.locator('button').nth(2);
  await expect(downloadButton).toBeVisible();

  await expect(downloadButton).toHaveText('Download For Linux');
  var downloadButton = await downloadLinks.locator('button').nth(2);
  await expect(downloadButton).toBeVisible();

});