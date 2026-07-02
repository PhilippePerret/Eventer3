# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: item/edition-tab-nav.spec.js >> Tab navigation en mode édition >> Tab après sélection popup-select va au champ suivant, pas au title
- Location: specs/e2e/item/edition-tab-nav.spec.js:11:3

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator: locator('#pane-1').contentFrame().locator('.event-item.editing .event-text')
Expected: focused
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeFocused" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item.editing .event-text')

```

```yaml
- text: Évènement un — Évènement deux — Évènement trois — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | // Après sélection dans un popup-select (state, meteo…),
  5  | // Tab doit aller au champ SUIVANT, pas revenir au title.
  6  | 
  7  | test.describe('Tab navigation en mode édition', () => {
  8  | 
  9  |   test.beforeEach(() => installFixtures('deep-events'))
  10 | 
  11 |   test('Tab après sélection popup-select va au champ suivant, pas au title', async ({ page }) => {
  12 |     await page.goto('/')
  13 |     await press(page, 'ArrowRight')
  14 |     await expect(pane1(page).locator('.event-item').first()).toBeVisible()
  15 | 
  16 |     // Entrer en édition
  17 |     await press(page, 'Enter')
> 18 |     await expect(pane1(page).locator('.event-item.editing .event-text')).toBeFocused()
     |                                                                          ^ Error: expect(locator).toBeFocused() failed
  19 | 
  20 |     // Tab → state button
  21 |     await press(page, 'Tab')
  22 |     await expect(pane1(page).locator('.popup-select-trigger[data-field-name="state"]')).toBeFocused()
  23 | 
  24 |     // Ouvrir popup state + sélectionner première option
  25 |     await press(page, 'ArrowDown')
  26 |     await expect(pane1(page).locator('.popup-select')).toBeVisible()
  27 |     await press(page, 'Enter')
  28 | 
  29 |     // state button doit rester focused (pas le title)
  30 |     await expect(pane1(page).locator('.popup-select-trigger[data-field-name="state"]')).toBeFocused()
  31 | 
  32 |     // Tab → meteo button (pas state de nouveau)
  33 |     await press(page, 'Tab')
  34 |     await expect(pane1(page).locator('.popup-select-trigger[data-field-name="meteo"]')).toBeFocused()
  35 |   })
  36 | 
  37 | })
  38 | 
```