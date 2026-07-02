# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lister/enter-lister.spec.js >> → entre dans le Lister >> la touche → entre dans le Lister de l'item sélectionné
- Location: specs/e2e/lister/enter-lister.spec.js:8:3

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected pattern: not /project-list/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')

```

```yaml
- text: Projet A roman Projet B roman Projet C roman Projet caché roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.describe('→ entre dans le Lister', () => {
  5  | 
  6  |   test.beforeEach(() => installFixtures('many-projects'))
  7  | 
  8  |   test("la touche → entre dans le Lister de l'item sélectionné", async ({ page }) => {
  9  | 
  10 |     await page.goto('/')
  11 | 
  12 | 
  13 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14 | 
  15 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  16 | 
  17 |     await press(page, 'ArrowRight')
  18 | 
> 19 |     await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/project-list/)
     |                                                            ^ Error: expect(locator).not.toHaveClass(expected) failed
  20 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  21 | 
  22 | 
  23 |   })
  24 | 
  25 | })
  26 | 
  27 | test.describe('→ charge les events du projet', () => {
  28 | 
  29 |   test.beforeEach(() => installFixtures('many-events'))
  30 | 
  31 |   test("→ sur un projet charge et affiche ses events", async ({ page }) => {
  32 | 
  33 |     await page.goto('/')
  34 | 
  35 | 
  36 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  37 | 
  38 |     await press(page, 'ArrowRight')
  39 | 
  40 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  41 | 
  42 |     await expect(pane1(page).locator('.event-item')).not.toHaveCount(0)
  43 |     await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Évènement un')
  44 | 
  45 | 
  46 |   })
  47 | 
  48 | })
  49 | 
```