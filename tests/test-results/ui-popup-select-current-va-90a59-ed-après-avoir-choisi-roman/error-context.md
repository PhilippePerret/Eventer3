# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/popup-select-current-value.spec.js >> popup nature projet : option 'roman' focused après avoir choisi roman
- Location: specs/e2e/ui/popup-select-current-value.spec.js:46:1

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
- text: Événement 1 — AUT Événement 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-styles')
  6  | })
  7  | 
  8  | async function goToListerEvent(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 |   await press(page, 'ArrowRight')
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 | }
  15 | 
  16 | // ─── PopupSelect : currentValue null doit être focused ───────────────────────
  17 | 
  18 | test("popup nature projet : option '—' focused quand currentValue est null", async ({ page }) => {
  19 |   await goToListerEvent(page)
  20 |   await press(page, 't')
  21 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  22 |   // Nature projet null → ouvre popup → '— (aucun)' doit être focused
  23 |   await press(page, 'Enter')
  24 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  25 |   const focused = pane1(page).locator('.popup-select__option.focused')
  26 |   await expect(focused).toContainText('—')
  27 | })
  28 | 
  29 | test("popup nature évènemencier : option 'défaut' focused quand currentValue est null", async ({ page }) => {
  30 |   await goToListerEvent(page)
  31 |   await press(page, 't')
  32 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  33 |   // Sélectionner roman (ArrowUp×2 depuis —)
  34 |   await press(page, 'Enter')
  35 |   await press(page, 'ArrowUp')   // film/BD
  36 |   await press(page, 'ArrowUp')   // roman
  37 |   await press(page, 'Enter')
  38 |   // Descendre sur Nature évènemencier → ouvre popup → 'défaut' doit être focused (null)
  39 |   await press(page, 'ArrowDown')
  40 |   await press(page, 'Enter')
  41 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  42 |   const focused = pane1(page).locator('.popup-select__option.focused')
  43 |   await expect(focused).toContainText('défaut')
  44 | })
  45 | 
  46 | test("popup nature projet : option 'roman' focused après avoir choisi roman", async ({ page }) => {
  47 |   await goToListerEvent(page)
  48 |   await press(page, 't')
  49 |   // Sélectionner roman (ArrowUp×2 depuis —)
  50 |   await press(page, 'Enter')
  51 |   await press(page, 'ArrowUp')   // film/BD
  52 |   await press(page, 'ArrowUp')   // roman
  53 |   await press(page, 'Enter')     // select roman
  54 |   // Rouvrir le popup projet → roman doit être focused
  55 |   await press(page, 'Enter')
> 56 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  57 |   const focused = pane1(page).locator('.popup-select__option.focused')
  58 |   await expect(focused).toContainText('roman')
  59 | })
  60 | 
```