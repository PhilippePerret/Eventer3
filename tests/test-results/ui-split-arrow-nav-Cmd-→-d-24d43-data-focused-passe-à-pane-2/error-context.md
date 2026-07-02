# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-arrow-nav.spec.js >> Cmd+→ depuis pane-1 → data-focused passe à pane-2
- Location: specs/e2e/ui/split-arrow-nav.spec.js:20:1

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
  4  | test.beforeEach(() => installFixtures('with-links'))
  5  | 
  6  | async function gotoApp(page) {
  7  |   await page.goto('/')
  8  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  9  | }
  10 | 
  11 | async function openSplit(page) {
  12 |   await press(page, 'Alt+2')
> 13 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
     |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  14 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  15 |   // après openSplit : data-focused = pane-2, Playwright keyboard focus = pane-1
  16 | }
  17 | 
  18 | // ─── Cmd+→ cycle ──────────────────────────────────────────────────────────────
  19 | 
  20 | test('Cmd+→ depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  21 |   await gotoApp(page)
  22 |   await openSplit(page)
  23 |   // pane-2 a déjà data-focused après openSplit — on force pane-1 d'abord
  24 |   await press(page, 'Alt+1')
  25 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  26 |   // Cmd+→ depuis pane-1 (Playwright keyboard focus = pane-1)
  27 |   await press(page, 'Meta+ArrowRight')
  28 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  29 | })
  30 | 
  31 | test('Cmd+→ depuis pane-2 → data-focused passe à pane-1 (cycle)', async ({ page }) => {
  32 |   await gotoApp(page)
  33 |   await openSplit(page)
  34 |   // pane-2 a data-focused — on bascule Playwright keyboard focus sur pane-2 via click
  35 |   await page.frameLocator('#pane-2').locator('body').click()
  36 |   await press(page, 'Meta+ArrowRight')
  37 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  38 | })
  39 | 
  40 | // ─── Cmd+← cycle ──────────────────────────────────────────────────────────────
  41 | 
  42 | test('Cmd+← depuis pane-2 → data-focused passe à pane-1', async ({ page }) => {
  43 |   await gotoApp(page)
  44 |   await openSplit(page)
  45 |   await page.frameLocator('#pane-2').locator('body').click()
  46 |   await press(page, 'Meta+ArrowLeft')
  47 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  48 | })
  49 | 
  50 | test('Cmd+← depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  51 |   await gotoApp(page)
  52 |   await openSplit(page)
  53 |   await press(page, 'Alt+1')
  54 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  55 |   await press(page, 'Meta+ArrowLeft')
  56 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  57 | })
  58 | 
  59 | // ─── Sans split, Cmd+←/→ ne fait rien ────────────────────────────────────────
  60 | 
  61 | test('Cmd+→ sans split → aucun changement (pane-1 reste actif)', async ({ page }) => {
  62 |   await gotoApp(page)
  63 |   await press(page, 'Meta+ArrowRight')
  64 |   const focused = await page.evaluate(() => document.activeElement?.id)
  65 |   expect(focused).toBe('pane-1')
  66 | })
  67 | 
```