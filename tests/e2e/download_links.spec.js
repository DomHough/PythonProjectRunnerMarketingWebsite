const {test, expect} = require("@playwright/test");
const {describe} = require("node:test");

describe ('windows download links', () => {
  test('windows has windows download link', async ({browser}) => {
    const context = await browser.newContext({userAgent: 'windows'});
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    await expect(downloadLinkContainer).toBeVisible();

    const downloadLinks = await downloadLinkContainer.locator('> div');
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

  test('windows x64 directs to correct download link', async ({ browser }) => {
    const context = await browser.newContext( { userAgent: 'windows' });
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    const downloadLinks = await downloadLinkContainer.locator('> div');
    const downloadButton = await downloadLinks.locator('button');

    const downloadVersionSelect = await downloadLinkContainer.locator('select');

    await downloadVersionSelect.selectOption({ label: 'x64'});

    const onClickFunction = await downloadButton.evaluate(button => button.getAttribute('onclick'));

    await expect(onClickFunction).toMatch(/window\.location\.href='http:\/\/pyrun-application-repository\.s3\.eu-west-2\.amazonaws\.com\/\d+\.\d+\.\d+\/PyRun-v\d+\.\d+\.\d+-windows-x64\.exe'/);
  });

  test('windows x86 directs to correct download link', async ({ browser }) => {
    const context = await browser.newContext( { userAgent: 'windows' });
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    const downloadLinks = await downloadLinkContainer.locator('> div');
    const downloadButton = await downloadLinks.locator('button');

    const downloadVersionSelect = await downloadLinkContainer.locator('select');

    await downloadVersionSelect.selectOption({ label: 'x86'});

    const onClickFunction = await downloadButton.evaluate(button => button.getAttribute('onclick'));

    await expect(onClickFunction).toMatch(/window\.location\.href='http:\/\/pyrun-application-repository\.s3\.eu-west-2\.amazonaws\.com\/\d+\.\d+\.\d+\/PyRun-v\d+\.\d+\.\d+-windows-x86\.exe'/);
  });
});

describe('linux download links', () => {
  test('linux has linux download link', async ({browser}) => {
    const context = await browser.newContext({userAgent: 'linux'});
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    await expect(downloadLinkContainer).toBeVisible();

    const downloadLinks = await downloadLinkContainer.locator('> div');
    await expect(downloadLinks).toHaveCount(1);

    const downloadButton = await downloadLinks.locator('button');
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toHaveText('Download For Linux');
  });

  test('linux directs to correct download link', async ({ browser }) => {
    const context = await browser.newContext( { userAgent: 'linux' });
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    const downloadLinks = await downloadLinkContainer.locator('> div');
    const downloadButton = await downloadLinks.locator('button');

    const onClickFunction = await downloadButton.evaluate(button => button.getAttribute('onclick'));

    await expect(onClickFunction).toMatch(/window\.location\.href='http:\/\/pyrun-application-repository\.s3\.eu-west-2\.amazonaws\.com\/\d+\.\d+\.\d+\/PyRun-v\d+\.\d+\.\d+-linux-x64'/);
  });
});

describe('mac download links', () => {

  test('mac has mac download link', async ({browser}) => {
    const context = await browser.newContext({userAgent: 'mac os'});
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    await expect(downloadLinkContainer).toBeVisible();

    const downloadLinks = await downloadLinkContainer.locator('> div');
    await expect(downloadLinks).toHaveCount(1);

    const downloadButton = await downloadLinks.locator('button');
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toHaveText('Download For Mac');

    const downloadVersionSelect = await downloadLinkContainer.locator('select');
    await expect(downloadVersionSelect).toBeVisible();

    const downloadVersionOptions = await downloadVersionSelect.locator('option');
    await expect(downloadVersionOptions).toHaveCount(2);

    await expect(downloadVersionOptions.nth(0)).toHaveText('x64');

    await expect(downloadVersionOptions.nth(1)).toHaveText('arm64');
  });

  test('macos x64 directs to correct download link', async ({ browser }) => {
    const context = await browser.newContext( { userAgent: 'mac os' });
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    const downloadLinks = await downloadLinkContainer.locator('> div');
    const downloadButton = await downloadLinks.locator('button');

    const downloadVersionSelect = await downloadLinkContainer.locator('select');

    await downloadVersionSelect.selectOption({ label: 'x64'});

    const onClickFunction = await downloadButton.evaluate(button => button.getAttribute('onclick'));

    await expect(onClickFunction).toMatch(/window\.location\.href='http:\/\/pyrun-application-repository\.s3\.eu-west-2\.amazonaws\.com\/\d+\.\d+\.\d+\/PyRun-v\d+\.\d+\.\d+-macos-x64'/);
  });

  test('macos arm64 directs to correct download link', async ({ browser }) => {
    const context = await browser.newContext( { userAgent: 'mac os' });
    const page = await context.newPage();
    await page.goto('index.html');

    const downloadLinkContainer = await page.locator('.download-links-container');
    const downloadLinks = await downloadLinkContainer.locator('> div');
    const downloadButton = await downloadLinks.locator('button');

    const downloadVersionSelect = await downloadLinkContainer.locator('select');

    await downloadVersionSelect.selectOption({ label: 'arm64'});

    const onClickFunction = await downloadButton.evaluate(button => button.getAttribute('onclick'));

    await expect(onClickFunction).toMatch(/window\.location\.href='http:\/\/pyrun-application-repository\.s3\.eu-west-2\.amazonaws\.com\/\d+\.\d+\.\d+\/PyRun-v\d+\.\d+\.\d+-macos-arm64'/);
  });
});

describe('unknown download links', () => {
  test('unknown has all downlaod links', async ({browser}) => {
    const context = await browser.newContext({userAgent: 'unknown'});
    const page = await context.newPage();
    await page.goto('index.html');

    // get '.download-links-container'
    const downloadLinkContainer = await page.locator('.download-links-container');
    await expect(downloadLinkContainer).toBeVisible();
    // get all download links
    const downloadLinks = await downloadLinkContainer.locator('> div');
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
});