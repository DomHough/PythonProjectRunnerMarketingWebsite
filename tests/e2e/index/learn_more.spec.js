const {test, expect} = require("@playwright/test");

test('pressing learn more button takes you to the learn more page', async ({ page }) => {
  await page.goto('index.html');
  await page.click('a:has-text("Learn More")');
  await expect(new URL(page.url()).hash).toBe('#features');
});