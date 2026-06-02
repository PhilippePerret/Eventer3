# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/event-state-persistence.spec.js >> l'état 'premier jet' persiste après rechargement
- Location: specs/e2e/event/event-state-persistence.spec.js:51:1

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://127.0.0.1:4567/", waiting until "load"

```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | async function goToEventLister(page) {
> 9  |   await page.goto('/')
     |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  10 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  11 |   await page.keyboard.press('ArrowRight')
  12 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  13 | }
  14 | 
  15 | async function setEventState(page, stateName) {
  16 |   await page.keyboard.press('Enter')
  17 |   await expect(page.locator('.event-item.selected input[name="title"]')).toBeFocused()
  18 |   await page.keyboard.press('Tab')
  19 |   await expect(page.locator('.event-item.selected .popup-select-trigger')).toBeFocused()
  20 |   await page.keyboard.press('ArrowDown')
  21 |   await expect(page.locator('.popup-select')).toBeVisible()
  22 |   // Filtrer pour trouver l'option rapidement
  23 |   await page.locator('.popup-select__search').fill(stateName)
  24 |   await expect(page.locator('.popup-select__option')).toHaveCount(1)
  25 |   await page.keyboard.press('Enter')
  26 |   // Confirmer l'édition
  27 |   await page.keyboard.press('Enter')
  28 | }
  29 | 
  30 | test("l'état d'un event est sauvegardé en base et récupéré après rechargement", async ({ page }) => {
  31 |   await goToEventLister(page)
  32 | 
  33 |   await setEventState(page, 'ébauche')
  34 | 
  35 |   // Vérification immédiate
  36 |   const stateEl = page.locator('.event-item').nth(0).locator('.event-state')
  37 |   await expect(stateEl).toHaveText('ébauche')
  38 | 
  39 |   // Attendre que le PATCH soit terminé avant de recharger
  40 |   await page.waitForLoadState('networkidle')
  41 | 
  42 |   // Rechargement de la page
  43 |   await page.reload()
  44 |   await goToEventLister(page)
  45 | 
  46 |   // L'état doit être préservé
  47 |   const stateElAfterReload = page.locator('.event-item').nth(0).locator('.event-state')
  48 |   await expect(stateElAfterReload).toHaveText('ébauche')
  49 | })
  50 | 
  51 | test("l'état 'premier jet' persiste après rechargement", async ({ page }) => {
  52 |   await goToEventLister(page)
  53 | 
  54 |   await setEventState(page, 'premier jet')
  55 | 
  56 |   // Attendre que le PATCH soit terminé avant de recharger
  57 |   await page.waitForLoadState('networkidle')
  58 | 
  59 |   // Rechargement
  60 |   await page.reload()
  61 |   await goToEventLister(page)
  62 | 
  63 |   await expect(page.locator('.event-item').nth(0).locator('.event-state')).toHaveText('premier jet')
  64 | })
  65 | 
```