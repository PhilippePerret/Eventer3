# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/link-go-navigate.spec.js >> go vers item depth=2 (e49=Scène 1 Séq 4 Acte III) depuis sous-lister différent
- Location: specs/e2e/_tdd/link-go-navigate.spec.js:60:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').first()
Expected pattern: /selected/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').first()

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
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-links')
  6  | })
  7  | 
  8  | async function gotoEventList(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('.project-item').first()).toHaveClass(/selected/)
  11 |   await press(page, 'ArrowRight')
  12 |   await page.waitForLoadState('networkidle')
> 13 |   await expect(pane1(page).locator('.event-item').first()).toHaveClass(/selected/)
     |                                                            ^ Error: expect(locator).toHaveClass(expected) failed
  14 | }
  15 | 
  16 | async function enterSubLister(page) {
  17 |   const depthAttr = await pane1(page).locator('#events-panel').getAttribute('data-depth')
  18 |   const nextDepth  = String((depthAttr != null ? parseInt(depthAttr) : 0) + 1)
  19 |   await press(page, 'ArrowRight')
  20 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', nextDepth)
  21 | }
  22 | 
  23 | async function openLinkPopupAndGo(page) {
  24 |   await press(page, 'o')
  25 |   await expect(pane1(page).locator('.link-open-popup')).toBeVisible()
  26 |   // "Dans son évènemencier" est la première option (déjà sélectionnée)
  27 |   await press(page, 'Enter')
  28 | }
  29 | 
  30 | // ─── Navigation vers item de niveau 0 ────────────────────────────────────────
  31 | 
  32 | test('go vers item racine (e3=Acte III) depuis sous-lister', async ({ page }) => {
  33 |   await gotoEventList(page)
  34 |   await enterSubLister(page)          // entre dans Acte I
  35 |   await press(page, 'ArrowDown') // → e5 (Séq 2 Acte I, lien vers e3)
  36 |   await press(page, 'Tab')    // active lien "Acte III"
  37 |   await openLinkPopupAndGo(page)
  38 |   await expect(pane1(page).locator('.event-item.selected')).toContainText('Acte III')
  39 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '1')
  40 | })
  41 | 
  42 | // ─── Navigation vers item de niveau 1 ────────────────────────────────────────
  43 | 
  44 | test('go vers item depth=1 (e6=Séq 3 Acte I) depuis sous-lister différent', async ({ page }) => {
  45 |   await gotoEventList(page)
  46 |   await press(page, 'ArrowDown') // → e2 (Acte II)
  47 |   await enterSubLister(page)             // entre dans Acte II
  48 |   await press(page, 'ArrowDown') // → e9 (Séq 2 Acte II)
  49 |   await enterSubLister(page)             // entre dans Séq 2 Acte II
  50 |   await press(page, 'ArrowDown')
  51 |   await press(page, 'ArrowDown') // → e33 (Scène 3, 3 liens)
  52 |   await press(page, 'Tab')       // lien 1 : e6 "Séquence 3 de Acte I"
  53 |   await openLinkPopupAndGo(page)
  54 |   await expect(pane1(page).locator('.event-item.selected')).toContainText('Séquence 3 de Acte I')
  55 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '2')
  56 | })
  57 | 
  58 | // ─── Navigation vers item de niveau 2 ────────────────────────────────────────
  59 | 
  60 | test('go vers item depth=2 (e49=Scène 1 Séq 4 Acte III) depuis sous-lister différent', async ({ page }) => {
  61 |   await gotoEventList(page)
  62 |   await press(page, 'ArrowDown') // → e2 (Acte II)
  63 |   await enterSubLister(page)
  64 |   await press(page, 'ArrowDown') // → e9 (Séq 2 Acte II)
  65 |   await enterSubLister(page)
  66 |   await press(page, 'ArrowDown')
  67 |   await press(page, 'ArrowDown') // → e33
  68 |   await press(page, 'Tab')       // lien 1 : e6
  69 |   await press(page, 'Tab')       // lien 2 : e49 "Scène 1 de Séquence 4 de Acte III"
  70 |   await openLinkPopupAndGo(page)
  71 |   await expect(pane1(page).locator('.event-item.selected')).toContainText('Scène 1 de Séquence 4 de Acte III')
  72 |   await expect(pane1(page).locator('#events-panel')).toHaveAttribute('data-depth', '3')
  73 | })
  74 | 
```