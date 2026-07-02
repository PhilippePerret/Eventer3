# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lister/cancel-accidental-enter.spec.js >> Annulation entrée accidentelle dans un lister vide >> Escape après → accidentel sur event sans sous-lister retourne au lister parent
- Location: specs/e2e/lister/cancel-accidental-enter.spec.js:35:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel input.event-text')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel input.event-text')

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
  4  | test.describe('← annule la création d\'un event dans un lister non-virtuel', () => {
  5  | 
  6  |   test.beforeEach(() => installFixtures('many-events'))
  7  | 
  8  |   test("← pendant la création d'un event retourne à la liste des projets", async ({ page }) => {
  9  | 
  10 |     await page.goto('/')
  11 | 
  12 | 
  13 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14 |     await press(page, 'ArrowRight')
  15 |     await press(page, 'ArrowRight')
  16 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  17 | 
  18 |     const eventCount = await pane1(page).locator('.event-item').count()
  19 |     await press(page, 'n')
  20 |     await expect(pane1(page).locator('.event-item input[name="title"]')).toBeVisible()
  21 | 
  22 |     await press(page, 'ArrowLeft')
  23 | 
  24 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  25 | 
  26 | 
  27 |   })
  28 | 
  29 | })
  30 | 
  31 | test.describe('Annulation entrée accidentelle dans un lister vide', () => {
  32 | 
  33 |   test.beforeEach(() => installFixtures('many-events'))
  34 | 
  35 |   test("Escape après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {
  36 | 
  37 |     await page.goto('/')
  38 | 
  39 | 
  40 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  41 | 
  42 |     await press(page, 'ArrowRight')
  43 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  44 | 
  45 |     const eventCount = await pane1(page).locator('.event-item').count()
  46 |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  47 | 
  48 |     await press(page, 'ArrowRight')
> 49 |     await expect(pane1(page).locator('#events-panel input.event-text')).toBeVisible()
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  50 | 
  51 |     await press(page, 'Escape')
  52 | 
  53 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  54 |     await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)
  55 | 
  56 |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  57 | 
  58 | 
  59 |   })
  60 | 
  61 |   test("← après → accidentel sur event sans sous-lister retourne au lister parent", async ({ page }) => {
  62 | 
  63 |     await page.goto('/')
  64 | 
  65 | 
  66 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  67 |     await press(page, 'ArrowRight')
  68 |     await press(page, 'ArrowRight')
  69 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  70 | 
  71 |     const eventCount = await pane1(page).locator('.event-item').count()
  72 |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  73 | 
  74 |     await press(page, 'ArrowRight')
  75 |     await expect(pane1(page).locator('#events-panel input.event-text')).toBeVisible()
  76 | 
  77 |     await press(page, 'ArrowLeft')
  78 | 
  79 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  80 |     await expect(pane1(page).locator('.event-item')).toHaveCount(eventCount)
  81 |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  82 | 
  83 | 
  84 |   })
  85 | 
  86 | })
  87 | 
```