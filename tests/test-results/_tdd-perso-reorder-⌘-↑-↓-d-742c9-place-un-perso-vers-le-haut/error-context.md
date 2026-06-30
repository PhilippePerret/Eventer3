# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-reorder.spec.js >> ⌘+↑/↓ déplacement persos >> ⌘+↑ déplace un perso vers le haut
- Location: specs/e2e/_tdd/perso-reorder.spec.js:24:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item').first()
Expected substring: "Roxane"
Received string:    "Cyranode Bergerac🫥CY---"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item').first()
    14 × locator resolved to <div data-id="c1" tabindex="-1" class="perso-item checked">…</div>
       - unexpected value "Cyranode Bergerac🫥CY---"

```

```yaml
- text: ✓ Cyrano de Bergerac 🫥 CY ---
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/perso/perso-reorder.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1, press } from '../__setup__.js'
  4  | 
  5  | test.describe('⌘+↑/↓ déplacement persos', () => {
  6  | 
  7  |   test.beforeEach(() => installFixtures('with-persos'))
  8  | 
  9  |   test('⌘+↓ déplace un perso vers le bas', async ({ page }) => {
  10 |     await page.goto('/')
  11 |     await pane1(page).locator('#projects-panel').waitFor()
  12 |     await press(page, 'ArrowRight')
  13 |     await pane1(page).locator('#events-panel').waitFor()
  14 |     await press(page, 'p')
  15 |     await pane1(page).locator('#persos-panel').waitFor()
  16 |     const items = pane1(page).locator('.perso-item')
  17 |     await expect(items.nth(0)).toContainText('Cyrano')
  18 |     await expect(items.nth(1)).toContainText('Roxane')
  19 |     await press(page, 'Meta+ArrowDown')
  20 |     await expect(items.nth(0)).toContainText('Roxane')
  21 |     await expect(items.nth(1)).toContainText('Cyrano')
  22 |   })
  23 | 
  24 |   test('⌘+↑ déplace un perso vers le haut', async ({ page }) => {
  25 |     await page.goto('/')
  26 |     await pane1(page).locator('#projects-panel').waitFor()
  27 |     await press(page, 'ArrowRight')
  28 |     await pane1(page).locator('#events-panel').waitFor()
  29 |     await press(page, 'p')
  30 |     await pane1(page).locator('#persos-panel').waitFor()
  31 |     const items = pane1(page).locator('.perso-item')
  32 |     await expect(items.nth(0)).toContainText('Cyrano')
  33 |     await expect(items.nth(1)).toContainText('Roxane')
  34 |     await press(page, 'ArrowDown')
  35 |     await press(page, 'Meta+ArrowUp')
> 36 |     await expect(items.nth(0)).toContainText('Roxane')
     |                                ^ Error: expect(locator).toContainText(expected) failed
  37 |     await expect(items.nth(1)).toContainText('Cyrano')
  38 |   })
  39 | 
  40 |   test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
  41 |     await page.goto('/')
  42 |     await pane1(page).locator('#projects-panel').waitFor()
  43 |     await press(page, 'ArrowRight')
  44 |     await pane1(page).locator('#events-panel').waitFor()
  45 |     await press(page, 'p')
  46 |     await pane1(page).locator('#persos-panel').waitFor()
  47 |     const items = pane1(page).locator('.perso-item')
  48 |     await expect(items.nth(0)).toContainText('Cyrano')
  49 |     await expect(items.nth(1)).toContainText('Roxane')
  50 |     await press(page, 'Meta+ArrowDown')
  51 |     await expect(items.nth(0)).toContainText('Roxane')
  52 |     await expect(items.nth(1)).toContainText('Cyrano')
  53 |     await page.waitForTimeout(500)
  54 |     await page.reload()
  55 |     await pane1(page).locator('#projects-panel').waitFor()
  56 |     await press(page, 'ArrowRight')
  57 |     await pane1(page).locator('#events-panel').waitFor()
  58 |     await press(page, 'p')
  59 |     await pane1(page).locator('#persos-panel').waitFor()
  60 |     await expect(items.nth(0)).toContainText('Roxane')
  61 |     await expect(items.nth(1)).toContainText('Cyrano')
  62 |   })
  63 | 
  64 |   test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
  65 |     await page.goto('/')
  66 |     await pane1(page).locator('#projects-panel').waitFor()
  67 |     await press(page, 'ArrowRight')
  68 |     await pane1(page).locator('#events-panel').waitFor()
  69 |     await press(page, 'p')
  70 |     await pane1(page).locator('#persos-panel').waitFor()
  71 |     const items = pane1(page).locator('.perso-item')
  72 |     await expect(items.nth(0)).toContainText('Cyrano')
  73 |     await expect(items.nth(1)).toContainText('Roxane')
  74 |     await press(page, 'ArrowDown')
  75 |     await press(page, 'Meta+ArrowUp')
  76 |     await expect(items.nth(0)).toContainText('Roxane')
  77 |     await expect(items.nth(1)).toContainText('Cyrano')
  78 |     await page.waitForTimeout(500)
  79 |     await page.reload()
  80 |     await pane1(page).locator('#projects-panel').waitFor()
  81 |     await press(page, 'ArrowRight')
  82 |     await pane1(page).locator('#events-panel').waitFor()
  83 |     await press(page, 'p')
  84 |     await pane1(page).locator('#persos-panel').waitFor()
  85 |     await expect(items.nth(0)).toContainText('Roxane')
  86 |     await expect(items.nth(1)).toContainText('Cyrano')
  87 |   })
  88 | 
  89 | })
  90 | 
```