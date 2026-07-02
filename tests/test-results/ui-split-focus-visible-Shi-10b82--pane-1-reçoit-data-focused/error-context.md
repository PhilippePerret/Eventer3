# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-focus-visible.spec.js >> Shift+Tab depuis pane-2 → pane-1 reçoit data-focused
- Location: specs/e2e/ui/split-focus-visible.spec.js:38:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select__option').filter({ hasText: 'Vertical' })

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e7]:
      - generic [ref=f1e8]: Projet A
      - generic [ref=f1e10]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e11]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-links')
  6  | })
  7  | 
  8  | async function gotoApp(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  11 | }
  12 | 
  13 | async function openSplit(page) {
  14 |   await press(page, 'Alt+2')
> 15 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
     |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  16 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  17 | }
  18 | 
  19 | // ─── data-focused ─────────────────────────────────────────────────────────────
  20 | 
  21 | test('au démarrage, pane-1 a data-focused', async ({ page }) => {
  22 |   await gotoApp(page)
  23 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  24 | })
  25 | 
  26 | test('pane-2 na pas data-focused au démarrage (pas de split)', async ({ page }) => {
  27 |   await gotoApp(page)
  28 |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  29 | })
  30 | 
  31 | test('Cmd+2 → pane-2 reçoit data-focused (auto-focus au chargement)', async ({ page }) => {
  32 |   await gotoApp(page)
  33 |   await openSplit(page)
  34 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  35 |   await expect(page.locator('#pane-1')).not.toHaveAttribute('data-focused', '')
  36 | })
  37 | 
  38 | test('Shift+Tab depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  39 |   await gotoApp(page)
  40 |   await openSplit(page)
  41 |   await press(page, 'Shift+Tab')
  42 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  43 |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  44 | })
  45 | 
  46 | test('Cmd+1 depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  47 |   await gotoApp(page)
  48 |   await openSplit(page)
  49 |   await press(page, 'Alt+1')
  50 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  51 |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  52 | })
  53 | 
  54 | test('Cmd+0 ferme split → pane-1 reçoit data-focused', async ({ page }) => {
  55 |   await gotoApp(page)
  56 |   await openSplit(page)
  57 |   await press(page, 'Alt+0')
  58 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  59 |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  60 | })
  61 | 
```