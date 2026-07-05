# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/split-focus.spec.js >> Cmd+← depuis pane-2 → data-focused passe à pane-1
- Location: specs/e2e/_tdd/split-focus.spec.js:124:1

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
  1   | //Origine: tests/specs/e2e/ui/split-focus.spec.js
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | 
  5   | test.beforeEach(() => installFixtures('with-links'))
  6   | 
  7   | async function gotoApp(page) {
  8   |   await page.goto('/')
  9   |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  10  | }
  11  | 
  12  | async function openSplit(page) {
  13  |   await press(page, 'Alt+2')
> 14  |   await pane1(page).locator('.popup-select__option', { hasText: 'Vertical' }).click()
      |                                                                               ^ Error: locator.click: Test timeout of 15000ms exceeded.
  15  |   await expect(page.frameLocator('#pane-2').locator('.project-item').first()).toBeVisible()
  16  | }
  17  | 
  18  | // ─── data-focused ─────────────────────────────────────────────────────────────
  19  | 
  20  | test('au démarrage, pane-1 a data-focused', async ({ page }) => {
  21  |   await gotoApp(page)
  22  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  23  | })
  24  | 
  25  | test('pane-2 na pas data-focused au démarrage (pas de split)', async ({ page }) => {
  26  |   await gotoApp(page)
  27  |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  28  | })
  29  | 
  30  | test('Alt+2 → pane-2 reçoit data-focused (auto-focus au chargement)', async ({ page }) => {
  31  |   await gotoApp(page)
  32  |   await openSplit(page)
  33  |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  34  |   await expect(page.locator('#pane-1')).not.toHaveAttribute('data-focused', '')
  35  | })
  36  | 
  37  | // ─── Shift+Tab bascule entre panneaux ────────────────────────────────────────
  38  | 
  39  | test('Shift+Tab depuis pane-1 → focus passe dans pane-2', async ({ page }) => {
  40  |   await gotoApp(page)
  41  |   await openSplit(page)
  42  |   await press(page, 'Alt+1')
  43  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  44  |   await press(page, 'Shift+Tab')
  45  |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  46  | })
  47  | 
  48  | test('Shift+Tab depuis pane-2 → focus revient dans pane-1', async ({ page }) => {
  49  |   await gotoApp(page)
  50  |   await openSplit(page)
  51  |   await press(page, 'Alt+1')
  52  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  53  |   await press(page, 'Shift+Tab') // → pane-2
  54  |   await press(page, 'Shift+Tab') // → pane-1
  55  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  56  | })
  57  | 
  58  | test('Shift+Tab depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  59  |   await gotoApp(page)
  60  |   await openSplit(page)
  61  |   await press(page, 'Shift+Tab')
  62  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  63  |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  64  | })
  65  | 
  66  | // ─── Alt+1 active pane-1 ─────────────────────────────────────────────────────
  67  | 
  68  | test('Alt+1 depuis pane-2 → focus revient dans pane-1', async ({ page }) => {
  69  |   await gotoApp(page)
  70  |   await openSplit(page)
  71  |   await page.frameLocator('#pane-2').locator('body').click()
  72  |   await press(page, 'Alt+1')
  73  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  74  | })
  75  | 
  76  | test('Alt+1 depuis pane-2 → pane-1 reçoit data-focused', async ({ page }) => {
  77  |   await gotoApp(page)
  78  |   await openSplit(page)
  79  |   await press(page, 'Alt+1')
  80  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  81  |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  82  | })
  83  | 
  84  | // ─── Alt+2 split actif → focus pane-2 ────────────────────────────────────────
  85  | 
  86  | test('Alt+2 split actif → focus sur pane-2', async ({ page }) => {
  87  |   await gotoApp(page)
  88  |   await openSplit(page)
  89  |   await press(page, 'Alt+1')
  90  |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  91  |   await press(page, 'Alt+2')
  92  |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  93  | })
  94  | 
  95  | // ─── Alt+0 ferme → focus sur pane-1 ─────────────────────────────────────────
  96  | 
  97  | test('Alt+0 ferme split → pane-1 reçoit data-focused', async ({ page }) => {
  98  |   await gotoApp(page)
  99  |   await openSplit(page)
  100 |   await press(page, 'Alt+0')
  101 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  102 |   await expect(page.locator('#pane-2')).not.toHaveAttribute('data-focused', '')
  103 | })
  104 | 
  105 | // ─── Cmd+→/← cycle entre panneaux ────────────────────────────────────────────
  106 | 
  107 | test('Cmd+→ depuis pane-1 → data-focused passe à pane-2', async ({ page }) => {
  108 |   await gotoApp(page)
  109 |   await openSplit(page)
  110 |   await press(page, 'Alt+1')
  111 |   await expect(page.locator('#pane-1')).toHaveAttribute('data-focused', '')
  112 |   await press(page, 'Meta+ArrowRight')
  113 |   await expect(page.locator('#pane-2')).toHaveAttribute('data-focused', '')
  114 | })
```