# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-direction.spec.js >> Alt+2 affiche un popup vertical/horizontal
- Location: specs/e2e/ui/split-direction.spec.js:19:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.popup-select')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.popup-select')

```

```yaml
- text: Projet A roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
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
  13 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  14 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  15 | }
  16 | 
  17 | // ─── Alt+2 (clavier principal et pavé numérique) ──────────────────────────────
  18 | 
  19 | test('Alt+2 affiche un popup vertical/horizontal', async ({ page }) => {
  20 |   await gotoApp(page)
  21 |   await press(page, 'Alt+2')
> 22 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  23 | })
  24 | 
  25 | test('Alt+2 pavé numérique affiche aussi le popup', async ({ page }) => {
  26 |   await gotoApp(page)
  27 |   await press(page, 'Alt+Numpad2')
  28 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  29 | })
  30 | 
  31 | test('popup contient les options Vertical et Horizontal', async ({ page }) => {
  32 |   await gotoApp(page)
  33 |   await press(page, 'Alt+2')
  34 |   const popup = pane1(page).locator('.popup-select')
  35 |   await expect(popup.locator('.popup-select__option', { hasText: 'Vertical' })).toBeVisible()
  36 |   await expect(popup.locator('.popup-select__option', { hasText: 'Horizontal' })).toBeVisible()
  37 | })
  38 | 
  39 | // ─── Choix Vertical ───────────────────────────────────────────────────────────
  40 | 
  41 | test('choisir Vertical → pane-2 visible', async ({ page }) => {
  42 |   await gotoApp(page)
  43 |   await press(page, 'Alt+2')
  44 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  45 |   await expect(page.locator('#pane-2')).toBeVisible()
  46 | })
  47 | 
  48 | test('split Vertical → body#shell flex-direction = row', async ({ page }) => {
  49 |   await gotoApp(page)
  50 |   await press(page, 'Alt+2')
  51 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  52 |   const dir = await page.evaluate(() => document.body.style.flexDirection || getComputedStyle(document.body).flexDirection)
  53 |   expect(dir).toBe('row')
  54 | })
  55 | 
  56 | // ─── Choix Horizontal ─────────────────────────────────────────────────────────
  57 | 
  58 | test('choisir Horizontal → pane-2 visible', async ({ page }) => {
  59 |   await gotoApp(page)
  60 |   await press(page, 'Alt+2')
  61 |   await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  62 |   await expect(page.locator('#pane-2')).toBeVisible()
  63 | })
  64 | 
  65 | test('split Horizontal → body#shell flex-direction = column', async ({ page }) => {
  66 |   await gotoApp(page)
  67 |   await press(page, 'Alt+2')
  68 |   await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  69 |   await expect(page.locator('#pane-2')).toBeVisible()
  70 |   await page.waitForFunction(() => document.body.style.flexDirection === 'column')
  71 |   const dir = await page.evaluate(() => document.body.style.flexDirection)
  72 |   expect(dir).toBe('column')
  73 | })
  74 | 
  75 | // ─── Alt+2 split déjà actif → focus pane-2 ───────────────────────────────────
  76 | 
  77 | test('Alt+2 split actif → focus sur pane-2', async ({ page }) => {
  78 |   await gotoApp(page)
  79 |   await openSplit(page)
  80 |   await press(page, 'Alt+1')
  81 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  82 |   await press(page, 'Alt+2')
  83 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  84 | })
  85 | 
```