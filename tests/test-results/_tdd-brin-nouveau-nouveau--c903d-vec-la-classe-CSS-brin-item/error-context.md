# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-nouveau.spec.js >> nouveau brin : il s'affiche avec la classe CSS brin-item
- Location: specs/e2e/_tdd/brin-nouveau.spec.js:30:1

# Error details

```
Error: locator.fill: Test ended.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item.selected [data-field="title"]')

```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/brin/brin-nouveau.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('with-brins')
  7  | })
  8  | 
  9  | // fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)
  10 | 
  11 | async function openBrinPanel(page) {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  15 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  16 |   await pane1(page).locator('#main-panel').press('b')
  17 |   await expect(pane1(page).locator('#brin-panel')).toBeVisible()
  18 | }
  19 | 
  20 | test("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  21 |   await openBrinPanel(page)
  22 |   await pane1(page).locator('#main-panel').press('n')
  23 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  24 |   await titleInput.fill('Brin créé')
  25 |   await pane1(page).locator('#main-panel').press('Enter')
  26 |   // Le nouveau brin (inséré après le premier) doit être sélectionné
  27 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  28 | })
  29 | 
  30 | test("nouveau brin : il s'affiche avec la classe CSS brin-item", async ({ page }) => {
  31 |   await openBrinPanel(page)
  32 |   await pane1(page).locator('#main-panel').press('n')
  33 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
> 34 |   await titleInput.fill('Brin CSS')
     |                    ^ Error: locator.fill: Test ended.
  35 |   await pane1(page).locator('#main-panel').press('Enter')
  36 |   const newBrin = pane1(page).locator('.brin-item').nth(1)
  37 |   await expect(newBrin).toHaveClass(/brin-item/)
  38 | })
  39 | 
  40 | test("en création, l'éditeur de brin a les classes CSS brin-item et editing", async ({ page }) => {
  41 |   await openBrinPanel(page)
  42 |   await pane1(page).locator('#main-panel').press('n')
  43 |   const editor = pane1(page).locator('.brin-item.selected')
  44 |   await expect(editor).toHaveClass(/brin-item/)
  45 |   await expect(editor).toHaveClass(/editing/)
  46 | })
  47 | 
```