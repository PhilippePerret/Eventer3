# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/event-state-popup-visible.spec.js >> le popup d'état affiche toutes les options de statut
- Location: specs/e2e/event/event-state-popup-visible.spec.js:27:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.selected input[name="title"]')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.selected input[name="title"]')

```

```yaml
- text: Évènement un — Évènement deux — Évènement trois — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | async function openStatePopup(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 |   await press(page, 'ArrowRight')
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 |   await press(page, 'Enter')
> 15 |   await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
     |                                                                                 ^ Error: expect(locator).toBeFocused() failed
  16 |   await press(page, 'Tab')
  17 |   await expect(pane1(page).locator('.event-item.selected [data-field-name="state"]')).toBeFocused()
  18 |   await press(page, 'ArrowDown')
  19 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  20 | }
  21 | 
  22 | test("le popup d'état affiche des options visibles (pas un popup vide)", async ({ page }) => {
  23 |   await openStatePopup(page)
  24 |   await expect(pane1(page).locator('.popup-select__option').first()).toBeVisible()
  25 | })
  26 | 
  27 | test("le popup d'état affiche toutes les options de statut", async ({ page }) => {
  28 |   await openStatePopup(page)
  29 |   // 10 options : —, ébauche, développement, premier jet, réécriture, achèvement, à corriger, correction, à relire, achevé
  30 |   await expect(pane1(page).locator('.popup-select__option')).toHaveCount(10)
  31 | })
  32 | 
  33 | test("la liste des options du popup a une hauteur visible (non nulle)", async ({ page }) => {
  34 |   await openStatePopup(page)
  35 |   const list = pane1(page).locator('.popup-select__list')
  36 |   await expect(list).toBeVisible()
  37 |   const box = await list.boundingBox()
  38 |   expect(box.height).toBeGreaterThan(0)
  39 | })
  40 | 
```