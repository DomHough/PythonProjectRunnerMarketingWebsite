// @ts-check
const { test, expect, describe } = require('@playwright/test');

let urls = ['index.html', 'downloads.html']
urls.forEach(url => {
    describe(`Navbar dropdown on ${url}`, () => {
        test(`navbar dropdown toggle button is not visible on large screens on ${url}`, async ({page}) => {
            await page.goto(url);
            await page.setViewportSize({width: 1024, height: 768});
            await page.waitForTimeout(500); // wait for the page to adjust
            const dropdownButton = await page.locator('#navbar-dropdown-toggle');
            const navbar_links = await page.locator('.navbar-links');
            await expect(dropdownButton).not.toBeVisible();
            await expect(navbar_links).toBeVisible();
        });

        test(`navbar dropdown is visible on small screens on ${url}`, async ({page}) => {
            await page.goto(url);
            await page.setViewportSize({width: 320, height: 768});
            await page.waitForTimeout(500); // wait for the page to adjust
            const dropdownButton = await page.locator('#navbar-dropdown-toggle');
            const navbar_links = await page.locator('.navbar-links');
            await expect(dropdownButton).toBeVisible();
            await expect(navbar_links).not.toBeVisible();
        });

        test(`navbar dropdown toggle button toggles dropdown visibility on ${url}`, async ({page}) => {
            await page.goto(url);
            await page.setViewportSize({width: 320, height: 768});
            await page.waitForTimeout(500); // wait for the page to adjust
            const dropdownButton = await page.locator('#navbar-dropdown-toggle');
            const navbar_links = await page.locator('.navbar-links');
            await expect(dropdownButton).toBeVisible();
            await expect(navbar_links).not.toBeVisible();

            await dropdownButton.click();
            await expect(navbar_links).toBeVisible();
            await dropdownButton.click();
            await expect(navbar_links).not.toBeVisible();
        });

        test(`navbar dropdown toggle button toggles between hamburger and close icons on ${url}`, async ({page}) => {
            await page.goto(url);
            await page.setViewportSize({width: 320, height: 768});
            await page.waitForTimeout(500); // wait for the page to adjust
            const dropdownButton = await page.locator('#navbar-dropdown-toggle');
            await expect(dropdownButton).toHaveText('☰');

            await dropdownButton.click();
            await expect(dropdownButton).toHaveText('✖');

            await dropdownButton.click();
            await expect(dropdownButton).toHaveText('☰');
        });

        test(`navbar dropdown is hidden when window is resized to large screen on ${url}`, async ({page}) => {
            await page.goto(url);
            await page.setViewportSize({width: 320, height: 768});
            await page.waitForTimeout(500); // wait for the page to adjust
            const dropdownButton = await page.locator('#navbar-dropdown-toggle');
            const navbar_links = await page.locator('.navbar-links');
            await expect(dropdownButton).toBeVisible();
            await expect(navbar_links).not.toBeVisible();

            await dropdownButton.click(); // dropdown now open
            await expect(navbar_links).toBeVisible();
            await page.setViewportSize({width: 1024, height: 768}); // moves to large screen - dropdown should close
            await page.waitForTimeout(500); // wait for the page to adjust
            await expect(dropdownButton).not.toBeVisible();
            await expect(navbar_links).toBeVisible();
            await page.setViewportSize({width: 320, height: 768}); // moves to small screen - dropdown should remain closed
            await page.waitForTimeout(500); // wait for the page to adjust
            await expect(dropdownButton).toBeVisible();
            await expect(navbar_links).not.toBeVisible();
        });
    });
    describe(`navigate links on ${url}`, () => {
        test(`logo navigates to index.html on ${url}`, async ({page}) => {
            await page.goto(url);
            const navbar = await page.locator('.navbar');
            const logo = await navbar.locator('.logo');
            await logo.click();
            await expect(page.url().split('/').pop()).toBe(`index.html`);
        });
        test(`downloads links navigates to downloads.html on ${url}`, async ({page}) => {
            await page.goto(url);
            const downloadsLink = await page.locator('#navbar-downloads-anchor');
            await downloadsLink.click();
            await expect(page.url().split('/').pop()).toBe(`downloads.html`);
        });
    })
});