# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/split-pane.spec.js >> Alt+2 + Vertical → l'iframe pane-2 charge la liste des projets
- Location: specs/e2e/ui/split-pane.spec.js:35:1

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
  3  | import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('with-links')
  7  | })
  8  | 
  9  | async function gotoApp(page) {
  10 |   await page.goto('/')
  11 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  12 | }
  13 | 
  14 | // ─── État initial ─────────────────────────────────────────────────────────────
  15 | 
  16 | test('pas de second panneau au démarrage', async ({ page }) => {
  17 |   await gotoApp(page)
  18 |   await expect(page.locator('#pane-2')).not.toBeVisible()
  19 | })
  20 | 
  21 | async function openSplit(page) {
  22 |   await press(page, 'Alt+2')
> 23 |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
     |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  24 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  25 | }
  26 | 
  27 | // ─── Alt+2 ouvre le split ─────────────────────────────────────────────────────
  28 | 
  29 | test('Alt+2 + Vertical → second panneau visible', async ({ page }) => {
  30 |   await gotoApp(page)
  31 |   await openSplit(page)
  32 |   await expect(page.locator('#pane-2')).toBeVisible()
  33 | })
  34 | 
  35 | test("Alt+2 + Vertical → l'iframe pane-2 charge la liste des projets", async ({ page }) => {
  36 |   await gotoApp(page)
  37 |   await openSplit(page)
  38 |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  39 | })
  40 | 
  41 | test('Alt+2 une deuxième fois → idempotent (pane-2 reste unique)', async ({ page }) => {
  42 |   await gotoApp(page)
  43 |   await openSplit(page)
  44 |   await press(page, 'Alt+1')
  45 |   await press(page, 'Alt+2')
  46 |   // split déjà actif → focus pane-2 seulement, pas de popup ni nouveau pane
  47 |   await expect(page.locator('#pane-2')).toHaveCount(1)
  48 | })
  49 | 
  50 | // ─── Alt+0 ferme le split ─────────────────────────────────────────────────────
  51 | 
  52 | test('Alt+0 après Alt+2 → second panneau masqué', async ({ page }) => {
  53 |   await gotoApp(page)
  54 |   await openSplit(page)
  55 |   await press(page, 'Alt+0')
  56 |   await expect(page.locator('#pane-2')).not.toBeVisible()
  57 | })
  58 | 
  59 | test('Alt+0 sans split actif → notification erreur 6100', async ({ page }) => {
  60 |   await gotoApp(page)
  61 |   await press(page, 'Alt+0')
  62 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  63 |   await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
  64 | })
  65 | 
  66 | // ─── Maj+Tab bascule entre les panneaux ──────────────────────────────────────
  67 | 
  68 | test('Maj+Tab depuis pane 1 → focus passe dans pane 2', async ({ page }) => {
  69 |   await gotoApp(page)
  70 |   await openSplit(page)
  71 |   await press(page, 'Alt+1')
  72 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  73 |   await press(page, 'Shift+Tab')
  74 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  75 | })
  76 | 
  77 | test('Maj+Tab depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  78 |   await gotoApp(page)
  79 |   await openSplit(page)
  80 |   await press(page, 'Alt+1')
  81 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  82 |   await press(page, 'Shift+Tab') // → pane 2
  83 |   await press(page, 'Shift+Tab') // → pane 1
  84 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  85 | })
  86 | 
  87 | // ─── Alt+1 active le pane 1 ──────────────────────────────────────────────────
  88 | 
  89 | test('Alt+1 depuis pane 2 → focus revient dans pane 1', async ({ page }) => {
  90 |   await gotoApp(page)
  91 |   await openSplit(page)
  92 |   await page.frameLocator('#pane-2').locator('body').click()
  93 |   await press(page, 'Alt+1')
  94 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  95 | })
  96 | 
```