# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/style-reorder.spec.js >> ⌘+↑/↓ déplacement styles >> ⌘+↓ déplace le style vers le bas
- Location: specs/e2e/_tdd/style-reorder.spec.js:18:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('#style-panel') to be visible
    33 × locator resolved to hidden <div class="hidden" id="style-panel"></div>

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e8]:
        - generic [ref=f1e9]: Événement 1
        - generic [ref=f1e10]:
          - generic [ref=f1e11]: —
          - generic [ref=f1e12]: "---"
          - generic [ref=f1e13]: "---"
        - generic [ref=f1e17]: AUT
      - generic [ref=f1e20]:
        - generic [ref=f1e21]: Événement 2
        - generic [ref=f1e22]:
          - generic [ref=f1e23]: —
          - generic [ref=f1e24]: "---"
          - generic [ref=f1e25]: "---"
    - contentinfo "Raccourcis clavier" [ref=f1e26]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/apparence/style-panel.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1, press } from '../__setup__.js'
  4  | 
  5  | test.describe('⌘+↑/↓ déplacement styles', () => {
  6  | 
  7  |   test.beforeEach(() => installFixtures('with-styles'))
  8  | 
  9  |   async function openStylePanel(page) {
  10 |     await page.goto('/')
  11 |     await pane1(page).locator('#projects-panel').waitFor()
  12 |     await press(page, 'ArrowRight')
  13 |     await pane1(page).locator('#events-panel').waitFor()
  14 |     await press(page, 's')
> 15 |     await pane1(page).locator('#style-panel').waitFor()
     |                                               ^ Error: locator.waitFor: Test timeout of 15000ms exceeded.
  16 |   }
  17 | 
  18 |   test('⌘+↓ déplace le style vers le bas', async ({ page }) => {
  19 |     await openStylePanel(page)
  20 |     const items = pane1(page).locator('.style-item')
  21 |     const name0 = await items.nth(0).getAttribute('data-name')
  22 |     const name1 = await items.nth(1).getAttribute('data-name')
  23 |     await press(page, 'Meta+ArrowDown')
  24 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  25 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  26 |   })
  27 | 
  28 |   test('⌘+↑ déplace le style vers le haut', async ({ page }) => {
  29 |     await openStylePanel(page)
  30 |     const items = pane1(page).locator('.style-item')
  31 |     const name0 = await items.nth(0).getAttribute('data-name')
  32 |     const name1 = await items.nth(1).getAttribute('data-name')
  33 |     await press(page, 'ArrowDown')
  34 |     await press(page, 'Meta+ArrowUp')
  35 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  36 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  37 |   })
  38 | 
  39 |   test("l'ordre après ⌘+↓ est persisté", async ({ page }) => {
  40 |     await openStylePanel(page)
  41 |     const items = pane1(page).locator('.style-item')
  42 |     const name0 = await items.nth(0).getAttribute('data-name')
  43 |     const name1 = await items.nth(1).getAttribute('data-name')
  44 |     await press(page, 'Meta+ArrowDown')
  45 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  46 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  47 |     await page.waitForTimeout(500)
  48 |     await page.reload()
  49 |     await openStylePanel(page)
  50 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  51 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  52 |   })
  53 | 
  54 |   test("l'ordre après ⌘+↑ est persisté", async ({ page }) => {
  55 |     await openStylePanel(page)
  56 |     const items = pane1(page).locator('.style-item')
  57 |     const name0 = await items.nth(0).getAttribute('data-name')
  58 |     const name1 = await items.nth(1).getAttribute('data-name')
  59 |     await press(page, 'ArrowDown')
  60 |     await press(page, 'Meta+ArrowUp')
  61 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  62 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  63 |     await page.waitForTimeout(500)
  64 |     await page.reload()
  65 |     await openStylePanel(page)
  66 |     await expect(items.nth(0)).toHaveAttribute('data-name', name1)
  67 |     await expect(items.nth(1)).toHaveAttribute('data-name', name0)
  68 |   })
  69 | 
  70 | })
  71 | 
```