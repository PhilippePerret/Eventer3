# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-reorder.spec.js >> ⌘+↑/↓ déplacement projets >> ⌘+↑ déplace un projet vers le haut
- Location: specs/e2e/_tdd/project-reorder.spec.js:21:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.project-item').first()
Expected substring: "Projet B"
Received string:    "Projet A---roman"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').first()
    14 × locator resolved to <div tabindex="-1" class="project-item" data-id="00000000-0000-0000-0000-000000000001">…</div>
       - unexpected value "Projet A---roman"

```

```yaml
- text: Projet A --- roman
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/keyboard/keyboard-reorder-items.spec.js
  2  | //           tests/specs/e2e/project/project-reorder-persistence.spec.js
  3  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4  | import { test, expect, pane1, press } from '../__setup__.js'
  5  | 
  6  | test.describe('⌘+↑/↓ déplacement projets', () => {
  7  | 
  8  |   test.beforeEach(() => installFixtures('many-projects'))
  9  | 
  10 |   test('⌘+↓ déplace un projet vers le bas', async ({ page }) => {
  11 |     await page.goto('/')
  12 |     await pane1(page).locator('#projects-panel').waitFor()
  13 |     const items = pane1(page).locator('.project-item')
  14 |     await expect(items.nth(0)).toContainText('Projet A')
  15 |     await expect(items.nth(1)).toContainText('Projet B')
  16 |     await press(page, 'Meta+ArrowDown')
  17 |     await expect(items.nth(0)).toContainText('Projet B')
  18 |     await expect(items.nth(1)).toContainText('Projet A')
  19 |   })
  20 | 
  21 |   test('⌘+↑ déplace un projet vers le haut', async ({ page }) => {
  22 |     await page.goto('/')
  23 |     await pane1(page).locator('#projects-panel').waitFor()
  24 |     const items = pane1(page).locator('.project-item')
  25 |     await expect(items.nth(0)).toContainText('Projet A')
  26 |     await expect(items.nth(1)).toContainText('Projet B')
  27 |     await press(page, 'ArrowDown')
  28 |     await press(page, 'Meta+ArrowUp')
> 29 |     await expect(items.nth(0)).toContainText('Projet B')
     |                                ^ Error: expect(locator).toContainText(expected) failed
  30 |     await expect(items.nth(1)).toContainText('Projet A')
  31 |   })
  32 | 
  33 |   test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
  34 |     await page.goto('/')
  35 |     await pane1(page).locator('#projects-panel').waitFor()
  36 |     const items = pane1(page).locator('.project-item')
  37 |     await expect(items.nth(0)).toContainText('Projet A')
  38 |     await expect(items.nth(1)).toContainText('Projet B')
  39 |     await press(page, 'Meta+ArrowDown')
  40 |     await expect(items.nth(0)).toContainText('Projet B')
  41 |     await expect(items.nth(1)).toContainText('Projet A')
  42 |     await page.waitForTimeout(500)
  43 |     await page.reload()
  44 |     await pane1(page).locator('#projects-panel').waitFor()
  45 |     await expect(items.nth(0)).toContainText('Projet B')
  46 |     await expect(items.nth(1)).toContainText('Projet A')
  47 |   })
  48 | 
  49 |   test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
  50 |     await page.goto('/')
  51 |     await pane1(page).locator('#projects-panel').waitFor()
  52 |     const items = pane1(page).locator('.project-item')
  53 |     await expect(items.nth(0)).toContainText('Projet A')
  54 |     await expect(items.nth(1)).toContainText('Projet B')
  55 |     await press(page, 'ArrowDown')
  56 |     await press(page, 'Meta+ArrowUp')
  57 |     await expect(items.nth(0)).toContainText('Projet B')
  58 |     await expect(items.nth(1)).toContainText('Projet A')
  59 |     await page.waitForTimeout(500)
  60 |     await page.reload()
  61 |     await pane1(page).locator('#projects-panel').waitFor()
  62 |     await expect(items.nth(0)).toContainText('Projet B')
  63 |     await expect(items.nth(1)).toContainText('Projet A')
  64 |   })
  65 | 
  66 |   test('plusieurs déplacements sont persistés', async ({ page }) => {
  67 |     await page.goto('/')
  68 |     await pane1(page).locator('#projects-panel').waitFor()
  69 |     const items = pane1(page).locator('.project-item')
  70 |     await expect(items.nth(0)).toContainText('Projet A')
  71 |     await expect(items.nth(1)).toContainText('Projet B')
  72 |     await expect(items.nth(2)).toContainText('Projet C')
  73 |     await press(page, 'Meta+ArrowDown')
  74 |     await press(page, 'Meta+ArrowDown')
  75 |     await expect(items.nth(0)).toContainText('Projet B')
  76 |     await expect(items.nth(1)).toContainText('Projet C')
  77 |     await expect(items.nth(2)).toContainText('Projet A')
  78 |     await page.waitForTimeout(500)
  79 |     await page.reload()
  80 |     await pane1(page).locator('#projects-panel').waitFor()
  81 |     await expect(items.nth(0)).toContainText('Projet B')
  82 |     await expect(items.nth(1)).toContainText('Projet C')
  83 |     await expect(items.nth(2)).toContainText('Projet A')
  84 |   })
  85 | 
  86 | })
  87 | 
```