# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-sans-title-cancel-create.spec.js >> la touche Entrée sans titre : l'éditeur reste visible
- Location: specs/e2e/project/new-sans-title-cancel-create.spec.js:23:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.project-item input[name="title"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item input[name="title"]')

```

```yaml
- text: Projet A roman Projet B roman Projet C roman Projet caché roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ? Choisir un dossier philippeperret Choisir __Current_Work__ Applications Desktop Documents Downloads ICARE_EDITIONS Library Movies Music Paperasse pCloud Drive Pictures Programmes Public Sites ⇥ Annuler
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-projects')
  6  | })
  7  | 
  8  | test('Escape dans le FilePicker ne crée pas de projet', async ({ page }) => {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 | 
  12 |   const items = pane1(page).locator('.project-item')
  13 |   const countBefore = await items.count()
  14 | 
  15 |   await press(page, 'n')
  16 |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  17 |   await press(page, 'Escape')
  18 |   await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
  19 | 
  20 |   await expect(items).toHaveCount(countBefore)
  21 | })
  22 | 
  23 | test('la touche Entrée sans titre : l\'éditeur reste visible', async ({ page }) => {
  24 |   await page.goto('/')
  25 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  26 | 
  27 |   await press(page, 'n')
  28 |   await press(page, 'Enter')
  29 | 
> 30 |   await expect(pane1(page).locator('.project-item input[name="title"]')).toBeVisible()
     |                                                                          ^ Error: expect(locator).toBeVisible() failed
  31 | })
  32 | 
  33 | test('la touche Entrée sans titre : aucun projet créé', async ({ page }) => {
  34 |   await page.goto('/')
  35 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  36 | 
  37 |   const items = pane1(page).locator('.project-item')
  38 |   const countBefore = await items.count()
  39 | 
  40 |   await press(page, 'n')
  41 |   await press(page, 'Enter')
  42 |   await press(page, 'Escape')
  43 | 
  44 |   await expect(items).toHaveCount(countBefore)
  45 | })
  46 | 
```