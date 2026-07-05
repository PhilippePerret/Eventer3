# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/split-pane.spec.js >> Alt+2 + Vertical → second panneau visible
- Location: specs/e2e/_tdd/split-pane.spec.js:48:1

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
      - generic [ref=f1e11]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e12]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | //Origine: tests/specs/e2e/ui/split-pane.spec.js
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | import { ERRORS } from '../../../../public/locale/fr/ERRORS.js'
  5   | 
  6   | test.beforeEach(() => installFixtures('with-links'))
  7   | 
  8   | async function gotoApp(page) {
  9   |   await page.goto('/')
  10  |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  11  | }
  12  | 
  13  | async function openSplit(page, direction = 'Vertical') {
  14  |   await press(page, 'Alt+2')
> 15  |   await pane1(page).locator('.popup-select__option', { hasText: direction }).click()
      |                                                                              ^ Error: locator.click: Test timeout of 15000ms exceeded.
  16  |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  17  | }
  18  | 
  19  | // ─── État initial ─────────────────────────────────────────────────────────────
  20  | 
  21  | test('pas de second panneau au démarrage', async ({ page }) => {
  22  |   await gotoApp(page)
  23  |   await expect(page.locator('#pane-2')).not.toBeVisible()
  24  | })
  25  | 
  26  | // ─── Alt+2 ouvre le split ─────────────────────────────────────────────────────
  27  | 
  28  | test('Alt+2 affiche un popup vertical/horizontal', async ({ page }) => {
  29  |   await gotoApp(page)
  30  |   await press(page, 'Alt+2')
  31  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  32  | })
  33  | 
  34  | test('Alt+2 pavé numérique affiche aussi le popup', async ({ page }) => {
  35  |   await gotoApp(page)
  36  |   await press(page, 'Alt+Numpad2')
  37  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  38  | })
  39  | 
  40  | test('popup contient les options Vertical et Horizontal', async ({ page }) => {
  41  |   await gotoApp(page)
  42  |   await press(page, 'Alt+2')
  43  |   const popup = pane1(page).locator('.popup-select')
  44  |   await expect(popup.locator('.popup-select__option', { hasText: 'Vertical' })).toBeVisible()
  45  |   await expect(popup.locator('.popup-select__option', { hasText: 'Horizontal' })).toBeVisible()
  46  | })
  47  | 
  48  | test('Alt+2 + Vertical → second panneau visible', async ({ page }) => {
  49  |   await gotoApp(page)
  50  |   await openSplit(page)
  51  |   await expect(page.locator('#pane-2')).toBeVisible()
  52  | })
  53  | 
  54  | test("Alt+2 + Vertical → l'iframe pane-2 charge la liste des projets", async ({ page }) => {
  55  |   await gotoApp(page)
  56  |   await openSplit(page)
  57  |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  58  | })
  59  | 
  60  | test('split Vertical → body flex-direction = row', async ({ page }) => {
  61  |   await gotoApp(page)
  62  |   await press(page, 'Alt+2')
  63  |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
  64  |   const dir = await page.evaluate(() => document.body.style.flexDirection || getComputedStyle(document.body).flexDirection)
  65  |   expect(dir).toBe('row')
  66  | })
  67  | 
  68  | test('choisir Horizontal → pane-2 visible', async ({ page }) => {
  69  |   await gotoApp(page)
  70  |   await press(page, 'Alt+2')
  71  |   await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  72  |   await expect(page.locator('#pane-2')).toBeVisible()
  73  | })
  74  | 
  75  | test('split Horizontal → body flex-direction = column', async ({ page }) => {
  76  |   await gotoApp(page)
  77  |   await press(page, 'Alt+2')
  78  |   await pane1(page).locator('.popup-select__option', { hasText: 'Horizontal' }).click()
  79  |   await expect(page.locator('#pane-2')).toBeVisible()
  80  |   await page.waitForFunction(() => document.body.style.flexDirection === 'column')
  81  |   const dir = await page.evaluate(() => document.body.style.flexDirection)
  82  |   expect(dir).toBe('column')
  83  | })
  84  | 
  85  | test('Alt+2 une deuxième fois → idempotent (pane-2 reste unique)', async ({ page }) => {
  86  |   await gotoApp(page)
  87  |   await openSplit(page)
  88  |   await press(page, 'Alt+1')
  89  |   await press(page, 'Alt+2')
  90  |   await expect(page.locator('#pane-2')).toHaveCount(1)
  91  | })
  92  | 
  93  | // ─── Alt+0 ferme le split ─────────────────────────────────────────────────────
  94  | 
  95  | test('Alt+0 après Alt+2 → second panneau masqué', async ({ page }) => {
  96  |   await gotoApp(page)
  97  |   await openSplit(page)
  98  |   await press(page, 'Alt+0')
  99  |   await expect(page.locator('#pane-2')).not.toBeVisible()
  100 | })
  101 | 
  102 | test('Alt+0 sans split actif → notification erreur 6100', async ({ page }) => {
  103 |   await gotoApp(page)
  104 |   await press(page, 'Alt+0')
  105 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  106 |   await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
  107 | })
  108 | 
  109 | // ─── Alt+R rotation ───────────────────────────────────────────────────────────
  110 | 
  111 | test('Alt+R sans split actif → notification 6100', async ({ page }) => {
  112 |   await gotoApp(page)
  113 |   await press(page, 'Alt+r')
  114 |   await expect(pane1(page).locator('.notification')).toBeVisible()
  115 |   await expect(pane1(page).locator('.notification')).toContainText(ERRORS[6100])
```