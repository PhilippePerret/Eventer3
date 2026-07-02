# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/event-state-display.spec.js >> un event avec état affiche sa pastille
- Location: specs/e2e/event/event-state-display.spec.js:22:1

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
  8  | async function goToListerEvent(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 |   await press(page, 'ArrowRight')
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 | }
  15 | 
  16 | test("un event sans état affiche '—' (valeur neutre)", async ({ page }) => {
  17 |   await goToListerEvent(page)
  18 |   const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  19 |   await expect(stateEl).toHaveText('—')
  20 | })
  21 | 
  22 | test("un event avec état affiche sa pastille", async ({ page }) => {
  23 |   await goToListerEvent(page)
  24 |   // On met le premier event en état "ébauche" via Tab+Enter en édition
  25 |   await press(page, 'Enter')
> 26 |   await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
     |                                                                                 ^ Error: expect(locator).toBeFocused() failed
  27 |   await press(page, 'Tab')
  28 |   const trigger = pane1(page).locator('.event-item.selected [data-field-name="state"]')
  29 |   await expect(trigger).toBeFocused()
  30 |   await press(page, 'ArrowDown')
  31 |   // L'option "ébauche" est la 2e (index 1), ↓ pour la sélectionner
  32 |   await press(page, 'ArrowDown')
  33 |   await press(page, 'Enter')
  34 |   // Confirmer l'édition
  35 |   await press(page, 'Enter')
  36 |   const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  37 |   await expect(stateEl).toBeVisible()
  38 |   await expect(stateEl).toHaveText('ébauche')
  39 | })
  40 | 
```