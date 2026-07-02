# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/event-state-persistence.spec.js >> l'état d'un event est sauvegardé en base et récupéré après rechargement
- Location: specs/e2e/event/event-state-persistence.spec.js:31:1

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
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
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
  16 | async function setEventState(page, stateName) {
  17 |   await press(page, 'Enter')
> 18 |   await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
     |                                                                                 ^ Error: expect(locator).toBeFocused() failed
  19 |   await press(page, 'Tab')
  20 |   await expect(pane1(page).locator('.event-item.selected [data-field-name="state"]')).toBeFocused()
  21 |   await press(page, 'ArrowDown')
  22 |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  23 |   // Filtrer pour trouver l'option rapidement
  24 |   await pane1(page).locator('.popup-select__search').fill(stateName)
  25 |   await expect(pane1(page).locator('.popup-select__option')).toHaveCount(1)
  26 |   await press(page, 'Enter')
  27 |   // Confirmer l'édition
  28 |   await press(page, 'Enter')
  29 | }
  30 | 
  31 | test("l'état d'un event est sauvegardé en base et récupéré après rechargement", async ({ page }) => {
  32 |   await goToListerEvent(page)
  33 | 
  34 |   await setEventState(page, 'ébauche')
  35 | 
  36 |   // Vérification immédiate
  37 |   const stateEl = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  38 |   await expect(stateEl).toHaveText('ébauche')
  39 | 
  40 |   // Attendre que le PATCH soit terminé avant de recharger
  41 |   await page.waitForLoadState('networkidle')
  42 | 
  43 |   // Rechargement de la page
  44 |   await page.reload()
  45 |   await goToListerEvent(page)
  46 | 
  47 |   // L'état doit être préservé
  48 |   const stateElAfterReload = pane1(page).locator('.event-item').nth(0).locator('.event-state')
  49 |   await expect(stateElAfterReload).toHaveText('ébauche')
  50 | })
  51 | 
  52 | test("l'état 'premier jet' persiste après rechargement", async ({ page }) => {
  53 |   await goToListerEvent(page)
  54 | 
  55 |   await setEventState(page, 'premier jet')
  56 | 
  57 |   // Attendre que le PATCH soit terminé avant de recharger
  58 |   await page.waitForLoadState('networkidle')
  59 | 
  60 |   // Rechargement
  61 |   await page.reload()
  62 |   await goToListerEvent(page)
  63 | 
  64 |   await expect(pane1(page).locator('.event-item').nth(0).locator('.event-state')).toHaveText('premier jet')
  65 | })
  66 | 
```