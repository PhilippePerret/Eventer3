# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-rotate.spec.js >> Alt+R depuis horizontal → bascule en vertical
- Location: specs/e2e/ui/split-rotate.spec.js:34:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select__option').filter({ hasText: 'Horizontal' })

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
  2  | import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'
  3  | 
  4  | async function gotoApp(page) {
  5  |   await page.goto('/')
  6  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  7  | }
  8  | 
  9  | async function openSplit(page, direction = 'Vertical') {
  10 |   await press(page, 'Alt+2')
> 11 |   await pane1(page).locator('.popup-select__option', { hasText: direction }).click()
     |                                                                              ^ Error: locator.click: Test timeout of 15000ms exceeded.
  12 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  13 | }
  14 | 
  15 | // ─── Alt+R sans split ─────────────────────────────────────────────────────────
  16 | 
  17 | test('Alt+R sans split actif → notification 6100', async ({ page }) => {
  18 |   await gotoApp(page)
  19 |   await press(page, 'Alt+r')
  20 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  21 |   await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
  22 | })
  23 | 
  24 | // ─── Alt+R bascule direction ──────────────────────────────────────────────────
  25 | 
  26 | test('Alt+R depuis vertical → bascule en horizontal', async ({ page }) => {
  27 |   await gotoApp(page)
  28 |   await openSplit(page, 'Vertical')
  29 |   await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
  30 |   await press(page, 'Alt+r')
  31 |   await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
  32 | })
  33 | 
  34 | test('Alt+R depuis horizontal → bascule en vertical', async ({ page }) => {
  35 |   await gotoApp(page)
  36 |   await openSplit(page, 'Horizontal')
  37 |   await expect(page.locator('body')).toHaveCSS('flex-direction', 'column')
  38 |   await press(page, 'Alt+r')
  39 |   await expect(page.locator('body')).toHaveCSS('flex-direction', 'row')
  40 | })
  41 | 
```