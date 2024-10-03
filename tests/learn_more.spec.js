const {test, expect} = require("@playwright/test");

test('pressing learn more button takes you to the learn more page', async ({ page }) => {
  const normaliseURL = (url) => new URL(url).toString()
  await page.goto('index.html');
  await page.click('a:has-text("Learn More")');
  await expect(normaliseURL(page.url())).toBe(normaliseURL(`file:///${process.cwd()}/index.html#features`));
});