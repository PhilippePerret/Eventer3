# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-edition-form.spec.js >> en édition, le brin conserve ses classes panel-row et brin-row
- Location: specs/e2e/_tdd/brin-edition-form.spec.js:18:1

# Error details

```
Error: locator.press: Test ended.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.project-item.selected')

```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/brin/brin-edition-form.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('with-brins')
  7  | })
  8  | 
  9  | async function openBrinPanel(page) {
  10 |   await page.goto('/')
  11 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
> 12 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
     |                                                       ^ Error: locator.press: Test ended.
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  14 |   await pane1(page).locator('#main-panel').press('b')
  15 |   await expect(pane1(page).locator('#brin-panel')).toBeVisible()
  16 | }
  17 | 
  18 | test("en édition, le brin conserve ses classes panel-row et brin-row", async ({ page }) => {
  19 |   await openBrinPanel(page)
  20 |   await pane1(page).locator('#main-panel').press('Enter')
  21 |   const editingBrin = pane1(page).locator('.brin-item.selected')
  22 |   await expect(editingBrin).toHaveClass(/panel-row/)
  23 |   await expect(editingBrin).toHaveClass(/brin-row/)
  24 | })
  25 | 
  26 | test("en édition, le badge reste visible et dans son conteneur d'origine", async ({ page }) => {
  27 |   await openBrinPanel(page)
  28 |   await pane1(page).locator('#main-panel').press('Enter')
  29 |   const badgeInput = pane1(page).locator('.brin-item.selected [data-field="badge"]')
  30 |   await expect(badgeInput).toBeVisible()
  31 |   await expect(badgeInput).toHaveValue('MON')
  32 | })
  33 | 
  34 | test("en édition, le titre reste dans le flux visuel du brin (pas de saut de ligne)", async ({ page }) => {
  35 |   await openBrinPanel(page)
  36 |   await pane1(page).locator('#main-panel').press('Enter')
  37 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  38 |   await expect(titleInput).toBeVisible()
  39 |   // L'input titre doit être dans le même brin-item que les autres champs
  40 |   await expect(pane1(page).locator('.brin-item.selected [data-field="badge"]')).toBeVisible()
  41 |   await expect(pane1(page).locator('.brin-item.selected [data-field="type"]')).toBeVisible()
  42 | })
  43 | 
```