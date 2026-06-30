# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/event-reorder.spec.js >> ⌘+↑/↓ déplacement events >> l'ordre après ⌘+↓ est persisté
- Location: specs/e2e/_tdd/event-reorder.spec.js:36:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').first()
Expected substring: "Évènement deux"
Received string:    "Évènement un—------"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').first()
    14 × locator resolved to <div data-id="e1" tabindex="-1" class="event-item selected">…</div>
       - unexpected value "Évènement un—------"

```

```yaml
- text: Évènement un — --- ---
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/event-reorder.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1, press } from '../__setup__.js'
  4  | 
  5  | test.describe('⌘+↑/↓ déplacement events', () => {
  6  | 
  7  |   test.beforeEach(() => installFixtures('many-events'))
  8  | 
  9  |   test('⌘+↓ déplace un event vers le bas', async ({ page }) => {
  10 |     await page.goto('/')
  11 |     await pane1(page).locator('#projects-panel').waitFor()
  12 |     await press(page, 'ArrowRight')
  13 |     await pane1(page).locator('#events-panel').waitFor()
  14 |     const items = pane1(page).locator('.event-item')
  15 |     await expect(items.nth(0)).toContainText('Évènement un')
  16 |     await expect(items.nth(1)).toContainText('Évènement deux')
  17 |     await press(page, 'Meta+ArrowDown')
  18 |     await expect(items.nth(0)).toContainText('Évènement deux')
  19 |     await expect(items.nth(1)).toContainText('Évènement un')
  20 |   })
  21 | 
  22 |   test('⌘+↑ déplace un event vers le haut', async ({ page }) => {
  23 |     await page.goto('/')
  24 |     await pane1(page).locator('#projects-panel').waitFor()
  25 |     await press(page, 'ArrowRight')
  26 |     await pane1(page).locator('#events-panel').waitFor()
  27 |     const items = pane1(page).locator('.event-item')
  28 |     await expect(items.nth(0)).toContainText('Évènement un')
  29 |     await expect(items.nth(1)).toContainText('Évènement deux')
  30 |     await press(page, 'ArrowDown')
  31 |     await press(page, 'Meta+ArrowUp')
  32 |     await expect(items.nth(0)).toContainText('Évènement deux')
  33 |     await expect(items.nth(1)).toContainText('Évènement un')
  34 |   })
  35 | 
  36 |   test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
  37 |     await page.goto('/')
  38 |     await pane1(page).locator('#projects-panel').waitFor()
  39 |     await press(page, 'ArrowRight')
  40 |     await pane1(page).locator('#events-panel').waitFor()
  41 |     const items = pane1(page).locator('.event-item')
  42 |     await expect(items.nth(0)).toContainText('Évènement un')
  43 |     await expect(items.nth(1)).toContainText('Évènement deux')
  44 |     await press(page, 'Meta+ArrowDown')
> 45 |     await expect(items.nth(0)).toContainText('Évènement deux')
     |                                ^ Error: expect(locator).toContainText(expected) failed
  46 |     await expect(items.nth(1)).toContainText('Évènement un')
  47 |     await page.waitForTimeout(500)
  48 |     await page.reload()
  49 |     await pane1(page).locator('#projects-panel').waitFor()
  50 |     await press(page, 'ArrowRight')
  51 |     await pane1(page).locator('#events-panel').waitFor()
  52 |     await expect(items.nth(0)).toContainText('Évènement deux')
  53 |     await expect(items.nth(1)).toContainText('Évènement un')
  54 |   })
  55 | 
  56 |   test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
  57 |     await page.goto('/')
  58 |     await pane1(page).locator('#projects-panel').waitFor()
  59 |     await press(page, 'ArrowRight')
  60 |     await pane1(page).locator('#events-panel').waitFor()
  61 |     const items = pane1(page).locator('.event-item')
  62 |     await expect(items.nth(0)).toContainText('Évènement un')
  63 |     await expect(items.nth(1)).toContainText('Évènement deux')
  64 |     await press(page, 'ArrowDown')
  65 |     await press(page, 'Meta+ArrowUp')
  66 |     await expect(items.nth(0)).toContainText('Évènement deux')
  67 |     await expect(items.nth(1)).toContainText('Évènement un')
  68 |     await page.waitForTimeout(500)
  69 |     await page.reload()
  70 |     await pane1(page).locator('#projects-panel').waitFor()
  71 |     await press(page, 'ArrowRight')
  72 |     await pane1(page).locator('#events-panel').waitFor()
  73 |     await expect(items.nth(0)).toContainText('Évènement deux')
  74 |     await expect(items.nth(1)).toContainText('Évènement un')
  75 |   })
  76 | 
  77 | })
  78 | 
```