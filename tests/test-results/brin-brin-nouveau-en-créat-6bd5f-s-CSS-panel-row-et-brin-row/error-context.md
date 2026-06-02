# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brin-nouveau.spec.js >> en création, l'éditeur de brin a les classes CSS panel-row et brin-row
- Location: specs/e2e/brin/brin-nouveau.spec.js:40:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('.brin-item.selected')
Expected pattern: /panel-row/
Received string:  "item brin-item editing selected"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('.brin-item.selected')
    14 × locator resolved to <div class="item brin-item editing selected">…</div>
       - unexpected value "item brin-item editing selected"

```

```yaml
- text: ✓
- textbox "Couleur du brin": "#d9c8a9"
- textbox "---"
- textbox "Titre du nouveau brin"
- combobox:
  - option "—" [selected]
  - option "intrigue principale"
  - option "intrigue amoureuse"
  - option "intrigue"
  - option "personnage"
  - option "relation"
  - option "thème"
  - option "accessoire"
  - option "autre"
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
  8  | // fixture with-brins : project-a, events e1/e2, brins b1 (MON) / b2 (AUT, coché)
  9  | 
  10 | async function openBrinPanel(page) {
  11 |   await page.goto('/')
  12 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  13 |   await page.keyboard.press('ArrowRight')
  14 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  15 |   await page.keyboard.press('b')
  16 |   await expect(page.locator('#brin-panel')).toBeVisible()
  17 | }
  18 | 
  19 | test("nouveau brin : il est sélectionné juste après création", async ({ page }) => {
  20 |   await openBrinPanel(page)
  21 |   await page.keyboard.press('n')
  22 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  23 |   await titleInput.fill('Brin créé')
  24 |   await page.keyboard.press('Enter')
  25 |   // Le nouveau brin (inséré en tête) doit être sélectionné
  26 |   await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
  27 | })
  28 | 
  29 | test("nouveau brin : il s'affiche avec les bonnes classes CSS (panel-row brin-row)", async ({ page }) => {
  30 |   await openBrinPanel(page)
  31 |   await page.keyboard.press('n')
  32 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  33 |   await titleInput.fill('Brin CSS')
  34 |   await page.keyboard.press('Enter')
  35 |   const newBrin = page.locator('.brin-item').nth(0)
  36 |   await expect(newBrin).toHaveClass(/panel-row/)
  37 |   await expect(newBrin).toHaveClass(/brin-row/)
  38 | })
  39 | 
  40 | test("en création, l'éditeur de brin a les classes CSS panel-row et brin-row", async ({ page }) => {
  41 |   await openBrinPanel(page)
  42 |   await page.keyboard.press('n')
  43 |   const editor = page.locator('.brin-item.selected')
> 44 |   await expect(editor).toHaveClass(/panel-row/)
     |                        ^ Error: expect(locator).toHaveClass(expected) failed
  45 |   await expect(editor).toHaveClass(/brin-row/)
  46 | })
  47 | 
  48 | test("nouveau brin : sa couleur est différente de celle du brin précédent", async ({ page }) => {
  49 |   await openBrinPanel(page)
  50 |   // Récupérer la couleur du dernier brin existant (b2)
  51 |   const lastBrin = page.locator('.brin-item').last()
  52 |   const lastColor = await lastBrin.locator('input[type="color"]').inputValue()
  53 |   // Créer un nouveau brin
  54 |   await page.keyboard.press('n')
  55 |   await page.locator('.brin-item.selected input[name="title"]').fill('Nouveau brin couleur')
  56 |   await page.keyboard.press('Enter')
  57 |   // La couleur du nouveau brin doit être différente
  58 |   const newBrinColor = await page.locator('.brin-item').nth(0).locator('input[type="color"]').inputValue()
  59 |   expect(newBrinColor).not.toBe(lastColor)
  60 | })
  61 | 
```