const { test, describe, expect } = require("@playwright/test");
const data = [
    {
        "path": "1.0.0/PyRun-v1.0.0-windows-x86.exe",
        "size": "24685256",
        "date": "2024-10-27T23:30:14.000Z",
    },
    {
        "path": "1.0.0/PyRun-v1.0.0-windows-x64.exe",
        "size": "24685256",
        "date": "2024-10-27T23:30:14.000Z",
    },
    {
        "path": "1.0.0/PyRun-v1.0.0-linux-x64",
        "size": "24685256",
        "date": "2024-10-27T23:30:14.000Z",
    },
    {
        "path": "1.0.0/PyRun-v1.0.0-macos-x64",
        "size": "24685256",
        "date": "2024-10-27T23:30:14.000Z",
    },
    {
        "path": "1.0.0/PyRun-v1.0.0-macos-arm64",
        "size": "24685256",
        "date": "2024-10-27T23:30:14.000Z",
    },

    {
        "path": "1.1.0/PyRun-v1.1.0-windows-x86.exe",
        "size": "28685256",
        "date": "2024-11-27T23:30:14.000Z",
    },
    {
        "path": "1.1.0/PyRun-v1.1.0-windows-x64.exe",
        "size": "28685256",
        "date": "2024-11-27T23:30:14.000Z",
    },
    {
        "path": "1.1.0/PyRun-v1.1.0-linux-x64",
        "size": "28685256",
        "date": "2024-11-27T23:30:14.000Z",
    },
    {
        "path": "1.1.0/PyRun-v1.1.0-macos-x64",
        "size": "28685256",
        "date": "2024-11-27T23:30:14.000Z",
    },
    {
        "path": "1.1.0/PyRun-v1.1.0-macos-arm64",
        "size": "28685256",
        "date": "2024-11-27T23:30:14.000Z",
    },


]

function convert_data_to_xml(data) {
    return `
        <ListBucketResults>
            <Name>pyrun-application-repository</Name>
            <Prefix/>
            <Marker/>
            <MaxKeys>1000</MaxKeys>
            <IsTruncated>false</IsTruncated>
            ${data.map(file => `
                <Contents>
                    <Key>${file.path}</Key>
                    <Size>${file.size}</Size>
                    <LastModified>${file.date}</LastModified>
                </Contents>
            `).join('')}
        </ListBucketResults>
    `
}

const xml = convert_data_to_xml(data)

test.beforeEach(async ({ page }) => {
    await page.route('http://pyrun-application-repository.s3.eu-west-2.amazonaws.com', async (route) => {
        await route.fulfill({
            status: 200,
            body: xml,
            contentType: 'text/xml'
        })
    })
    await page.waitForTimeout(500)

    await page.goto('downloads.html')
});
describe('Table filled with data', () => {
    test('Table filled with data', async ({ page }) => {
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(data.length)
    })
})

describe('Search query', () => {
    test('Search query with no results', async ({ page }) => {
        await page.fill('input[name="search"]', '2.0.0')
        await page.waitForTimeout(500)
        const table = page.locator('#downloads-table')
        const rows = table.locator('tr')
        expect(await rows.count()).toBe(1)
        expect(await rows.locator('td').textContent()).toBe('No files found')
    })
    test('Search query with results', async ({ page }) => {
        await page.fill('input[name="search"]', '1.0.0')
        await page.waitForTimeout(500)
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(5)
    })
    test('Search query with capital letters', async ({ page }) => {
        await page.fill('input[name="search"]', 'windows')
        await page.waitForTimeout(500)
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        await page.pause()
        expect(await rows.count()).toBe(4)
    })
})

describe('OS filter', () => {
    test('Windows filter', async ({ page }) => {
        await page.click('label[for="windows"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(4)
    })
    test('MacOS filter', async ({ page }) => {
        await page.click('label[for="macos"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(4)
    })
    test('Linux filter', async ({ page }) => {
        await page.click('label[for="linux"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(2);
    })
})

describe('Architecture filter', () => {
    test('Windows x86 filter', async ({ page }) => {
        await page.click('label[for="windows"]')
        await page.click('label[for="x86"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(2)
    });
    test('Windows x64 filter', async ({ page }) => {
        await page.click('label[for="windows"]')
        await page.click('label[for="x64"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(2)
    });
    test('Macos x64 filter', async ({ page }) => {
        await page.click('label[for="macos"]')
        await page.click('label[for="x64"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(2)
    });
    test('macos arm64 filter', async ({ page }) => {
        await page.click('label[for="macos"]')
        await page.click('label[for="arm64"]')
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.count()).toBe(2)
    });
})

describe('Sort by headers', () => {
    test('Sort by name ascending', async ({ page }) => {
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-linux-x64')
        expect(await rows.nth(1).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-macos-arm64')
        expect(await rows.nth(2).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-macos-x64')
        expect(await rows.nth(3).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-windows-x64')
        expect(await rows.nth(4).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-windows-x86')
        expect(await rows.nth(5).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-linux-x64')
        expect(await rows.nth(6).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-macos-arm64')
        expect(await rows.nth(7).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-macos-x64')
        expect(await rows.nth(8).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-windows-x64')
        expect(await rows.nth(9).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-windows-x86')
    })

    test('Sort by name descending', async ({ page }) => {
        await page.pause()
        await page.locator('th[data-key="name"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        await page.pause()

        expect(await rows.nth(0).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-windows-x86')
        expect(await rows.nth(1).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-windows-x64')
        expect(await rows.nth(2).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-macos-x64')
        expect(await rows.nth(3).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-macos-arm64')
        expect(await rows.nth(4).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.1.0-linux-x64')
        expect(await rows.nth(5).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-windows-x86')
        expect(await rows.nth(6).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-windows-x64')
        expect(await rows.nth(7).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-macos-x64')
        expect(await rows.nth(8).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-macos-arm64')
        expect(await rows.nth(9).locator('td[data-key="name"]').textContent()).toBe('PyRun-v1.0.0-linux-x64')
    })

    test('Sort by operating system ascending', async ({ page }) => {
        await page.locator('th[data-key="os"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="os"]').textContent()).toBe('Linux')
        expect(await rows.nth(1).locator('td[data-key="os"]').textContent()).toBe('Linux')
        expect(await rows.nth(2).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(3).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(4).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(5).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(6).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(7).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(8).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(9).locator('td[data-key="os"]').textContent()).toBe('Windows')
    });

    test('Sort by operating system descending', async ({ page }) => {
        await page.locator('th[data-key="os"]').click()
        await page.locator('th[data-key="os"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(1).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(2).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(3).locator('td[data-key="os"]').textContent()).toBe('Windows')
        expect(await rows.nth(4).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(5).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(6).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(7).locator('td[data-key="os"]').textContent()).toBe('macOS')
        expect(await rows.nth(8).locator('td[data-key="os"]').textContent()).toBe('Linux')
        expect(await rows.nth(9).locator('td[data-key="os"]').textContent()).toBe('Linux')
    });

    test('Sort by architecture ascending', async ({ page }) => {
        await page.locator('th[data-key="arch"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="arch"]').textContent()).toBe('arm64')
        expect(await rows.nth(1).locator('td[data-key="arch"]').textContent()).toBe('arm64')
        expect(await rows.nth(2).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(3).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(4).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(5).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(6).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(7).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(8).locator('td[data-key="arch"]').textContent()).toBe('x86')
        expect(await rows.nth(9).locator('td[data-key="arch"]').textContent()).toBe('x86')
    });

    test('Sort by architecture descending', async ({ page }) => {
        await page.locator('th[data-key="arch"]').click()
        await page.locator('th[data-key="arch"]').click()
        await page.pause()

        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="arch"]').textContent()).toBe('x86')
        expect(await rows.nth(1).locator('td[data-key="arch"]').textContent()).toBe('x86')
        expect(await rows.nth(2).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(3).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(4).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(5).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(6).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(7).locator('td[data-key="arch"]').textContent()).toBe('x64')
        expect(await rows.nth(8).locator('td[data-key="arch"]').textContent()).toBe('arm64')
        expect(await rows.nth(9).locator('td[data-key="arch"]').textContent()).toBe('arm64')
    });

    test('Sort by version ascending', async ({ page }) => {
        await page.locator('th[data-key="version"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(1).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(2).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(3).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(4).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(5).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(6).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(7).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(8).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(9).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
    });

    test('Sort by version descending', async ({ page }) => {
        await page.locator('th[data-key="version"]').click()
        await page.locator('th[data-key="version"]').click()

        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(1).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(2).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(3).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(4).locator('td[data-key="version"]').textContent()).toBe('1.1.0')
        expect(await rows.nth(5).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(6).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(7).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(8).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
        expect(await rows.nth(9).locator('td[data-key="version"]').textContent()).toBe('1.0.0')
    });

    test('Sort by release date ascending', async ({ page }) => {
        await page.locator('th[data-key="date"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(1).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(2).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(3).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(4).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(5).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(6).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(7).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(8).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(9).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
    });

    test('Sort by release date descending', async ({ page }) => {
        await page.locator('th[data-key="date"]').click()
        await page.locator('th[data-key="date"]').click()
        await page.pause()

        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(1).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(2).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(3).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(4).locator('td[data-key="date"]').textContent()).toBe('27/11/2024')
        expect(await rows.nth(5).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(6).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(7).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(8).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
        expect(await rows.nth(9).locator('td[data-key="date"]').textContent()).toBe('27/10/2024')
    });

    test('Sort by size ascending', async ({ page }) => {
        await page.locator('th[data-key="size"]').click()
        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(1).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(2).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(3).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(4).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(5).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(6).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(7).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(8).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(9).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
    });

    test('Sort by size descending', async ({ page }) => {
        await page.pause()
        await page.locator('th[data-key="size"]').click()
        await page.locator('th[data-key="size"]').click()
        await page.pause()

        const table = page.locator('#downloads-table')
        const tbody = table.locator('tbody')
        const rows = tbody.locator('tr')
        expect(await rows.nth(0).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(1).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(2).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(3).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(4).locator('td[data-key="size"]').textContent()).toBe('27.36 MB')
        expect(await rows.nth(5).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(6).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(7).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(8).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
        expect(await rows.nth(9).locator('td[data-key="size"]').textContent()).toBe('23.54 MB')
    });


})