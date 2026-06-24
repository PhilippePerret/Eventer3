# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-nouveau.spec.js >> nouveau brin : il s'affiche avec les bonnes classes CSS (panel-row brin-row)
- Location: specs/e2e/_tdd/brin-nouveau.spec.js:30:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item').nth(1)
Expected pattern: /panel-row/
Received string:  "brin-item selected checked"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item').nth(1)
    14 × locator resolved to <div data-id="b2" tabindex="-1" class="brin-item selected checked">…</div>
       - unexpected value "brin-item selected checked"

```

```yaml
- text: "✓ Brin CSS #888888 AUT brin"
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
  30 | test("nouveau brin : il s'affiche avec les bonnes classes CSS (panel-row brin-row)", async ({ page }) => {
  31 |   await openBrinPanel(page)
  32 |   await pane1(page).locator('#main-panel').press('n')
  33 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  34 |   await titleInput.fill('Brin CSS')
  35 |   await pane1(page).locator('#main-panel').press('Enter')
  36 |   const newBrin = pane1(page).locator('.brin-item').nth(1)
> 37 |   await expect(newBrin).toHaveClass(/panel-row/)
     |                         ^ Error: expect(locator).toHaveClass(expected) failed
  38 |   await expect(newBrin).toHaveClass(/brin-row/)
  39 | })
  40 | 
  41 | test("en création, l'éditeur de brin a les classes CSS panel-row et brin-row", async ({ page }) => {
  42 |   await openBrinPanel(page)
  43 |   await pane1(page).locator('#main-panel').press('n')
  44 |   const editor = pane1(page).locator('.brin-item.selected')
  45 |   await expect(editor).toHaveClass(/panel-row/)
  46 |   await expect(editor).toHaveClass(/brin-row/)
  47 | })
  48 | 
  49 | test("nouveau brin : sa couleur est différente de celle du brin précédent", async ({ page }) => {
  50 |   await openBrinPanel(page)
  51 |   // Récupérer la couleur du dernier brin existant (b2)
  52 |   const lastBrin = pane1(page).locator('.brin-item').last()
  53 |   const lastColor = await lastBrin.locator('input[type="color"]').inputValue()
  54 |   // Créer un nouveau brin
  55 |   await pane1(page).locator('#main-panel').press('n')
  56 |   await pane1(page).locator('.brin-item.selected [data-field="title"]').fill('Nouveau brin couleur')
  57 |   await pane1(page).locator('#main-panel').press('Enter')
  58 |   // La couleur du nouveau brin doit être différente
  59 |   const newBrinColor = await pane1(page).locator('.brin-item').nth(1).locator('input[type="color"]').inputValue()
  60 |   expect(newBrinColor).not.toBe(lastColor)
  61 | })
  62 | 
```