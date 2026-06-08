# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brin-edition-form.spec.js >> en édition, le brin conserve ses classes panel-row et brin-row
- Location: specs/e2e/brin/brin-edition-form.spec.js:17:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main id="main-panel"></main>
       - unexpected value ""

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('with-brins')
  6  | })
  7  | 
  8  | async function openBrinPanel(page) {
  9  |   await page.goto('/')
> 10 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  11 |   await page.keyboard.press('ArrowRight')
  12 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  13 |   await page.keyboard.press('b')
  14 |   await expect(page.locator('#brin-panel')).toBeVisible()
  15 | }
  16 | 
  17 | test("en édition, le brin conserve ses classes panel-row et brin-row", async ({ page }) => {
  18 |   await openBrinPanel(page)
  19 |   await page.keyboard.press('Enter')
  20 |   const editingBrin = page.locator('.brin-item.selected')
  21 |   await expect(editingBrin).toHaveClass(/panel-row/)
  22 |   await expect(editingBrin).toHaveClass(/brin-row/)
  23 | })
  24 | 
  25 | test("en édition, le badge reste visible et dans son conteneur d'origine", async ({ page }) => {
  26 |   await openBrinPanel(page)
  27 |   await page.keyboard.press('Enter')
  28 |   const badgeInput = page.locator('.brin-item.selected input[name="badge"]')
  29 |   await expect(badgeInput).toBeVisible()
  30 |   await expect(badgeInput).toHaveValue('MON')
  31 | })
  32 | 
  33 | test("en édition, le titre reste dans le flux visuel du brin (pas de saut de ligne)", async ({ page }) => {
  34 |   await openBrinPanel(page)
  35 |   await page.keyboard.press('Enter')
  36 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  37 |   await expect(titleInput).toBeVisible()
  38 |   // L'input titre doit être dans le même brin-item que les autres champs
  39 |   await expect(page.locator('.brin-item.selected input[name="badge"]')).toBeVisible()
  40 |   await expect(page.locator('.brin-item.selected select[data-property="type"]')).toBeVisible()
  41 | })
  42 | 
```