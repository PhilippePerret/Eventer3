# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-reorder.spec.js >> ⌘+↑/↓ déplacement brins >> ⌘+↑ déplace un brin vers le haut
- Location: specs/e2e/_tdd/brin-reorder.spec.js:24:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item').first()
Expected substring: "Autre brin"
Received string:    "Mon brinMONbrin#d9c8a9"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item').first()
    14 × locator resolved to <div data-id="b1" tabindex="-1" class="brin-item">…</div>
       - unexpected value "Mon brinMONbrin#d9c8a9"

```

```yaml
- text: "Mon brin MON brin #d9c8a9"
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/brin/brin-reorder.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1, press } from '../__setup__.js'
  4  | 
  5  | test.describe('⌘+↑/↓ déplacement brins', () => {
  6  | 
  7  |   test.beforeEach(() => installFixtures('with-brins'))
  8  | 
  9  |   test('⌘+↓ déplace un brin vers le bas', async ({ page }) => {
  10 |     await page.goto('/')
  11 |     await pane1(page).locator('#projects-panel').waitFor()
  12 |     await press(page, 'ArrowRight')
  13 |     await pane1(page).locator('#events-panel').waitFor()
  14 |     await press(page, 'b')
  15 |     await pane1(page).locator('#brins-panel').waitFor()
  16 |     const items = pane1(page).locator('.brin-item')
  17 |     await expect(items.nth(0)).toContainText('Mon brin')
  18 |     await expect(items.nth(1)).toContainText('Autre brin')
  19 |     await press(page, 'Meta+ArrowDown')
  20 |     await expect(items.nth(0)).toContainText('Autre brin')
  21 |     await expect(items.nth(1)).toContainText('Mon brin')
  22 |   })
  23 | 
  24 |   test('⌘+↑ déplace un brin vers le haut', async ({ page }) => {
  25 |     await page.goto('/')
  26 |     await pane1(page).locator('#projects-panel').waitFor()
  27 |     await press(page, 'ArrowRight')
  28 |     await pane1(page).locator('#events-panel').waitFor()
  29 |     await press(page, 'b')
  30 |     await pane1(page).locator('#brins-panel').waitFor()
  31 |     const items = pane1(page).locator('.brin-item')
  32 |     await expect(items.nth(0)).toContainText('Mon brin')
  33 |     await expect(items.nth(1)).toContainText('Autre brin')
  34 |     await press(page, 'ArrowDown')
  35 |     await press(page, 'Meta+ArrowUp')
> 36 |     await expect(items.nth(0)).toContainText('Autre brin')
     |                                ^ Error: expect(locator).toContainText(expected) failed
  37 |     await expect(items.nth(1)).toContainText('Mon brin')
  38 |   })
  39 | 
  40 |   test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
  41 |     await page.goto('/')
  42 |     await pane1(page).locator('#projects-panel').waitFor()
  43 |     await press(page, 'ArrowRight')
  44 |     await pane1(page).locator('#events-panel').waitFor()
  45 |     await press(page, 'b')
  46 |     await pane1(page).locator('#brins-panel').waitFor()
  47 |     const items = pane1(page).locator('.brin-item')
  48 |     await expect(items.nth(0)).toContainText('Mon brin')
  49 |     await expect(items.nth(1)).toContainText('Autre brin')
  50 |     await press(page, 'Meta+ArrowDown')
  51 |     await expect(items.nth(0)).toContainText('Autre brin')
  52 |     await expect(items.nth(1)).toContainText('Mon brin')
  53 |     await page.waitForTimeout(500)
  54 |     await page.reload()
  55 |     await pane1(page).locator('#projects-panel').waitFor()
  56 |     await press(page, 'ArrowRight')
  57 |     await pane1(page).locator('#events-panel').waitFor()
  58 |     await press(page, 'b')
  59 |     await pane1(page).locator('#brins-panel').waitFor()
  60 |     await expect(items.nth(0)).toContainText('Autre brin')
  61 |     await expect(items.nth(1)).toContainText('Mon brin')
  62 |   })
  63 | 
  64 |   test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
  65 |     await page.goto('/')
  66 |     await pane1(page).locator('#projects-panel').waitFor()
  67 |     await press(page, 'ArrowRight')
  68 |     await pane1(page).locator('#events-panel').waitFor()
  69 |     await press(page, 'b')
  70 |     await pane1(page).locator('#brins-panel').waitFor()
  71 |     const items = pane1(page).locator('.brin-item')
  72 |     await expect(items.nth(0)).toContainText('Mon brin')
  73 |     await expect(items.nth(1)).toContainText('Autre brin')
  74 |     await press(page, 'ArrowDown')
  75 |     await press(page, 'Meta+ArrowUp')
  76 |     await expect(items.nth(0)).toContainText('Autre brin')
  77 |     await expect(items.nth(1)).toContainText('Mon brin')
  78 |     await page.waitForTimeout(500)
  79 |     await page.reload()
  80 |     await pane1(page).locator('#projects-panel').waitFor()
  81 |     await press(page, 'ArrowRight')
  82 |     await pane1(page).locator('#events-panel').waitFor()
  83 |     await press(page, 'b')
  84 |     await pane1(page).locator('#brins-panel').waitFor()
  85 |     await expect(items.nth(0)).toContainText('Autre brin')
  86 |     await expect(items.nth(1)).toContainText('Mon brin')
  87 |   })
  88 | 
  89 | })
  90 | 
```