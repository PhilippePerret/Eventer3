# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> la création d'un nouveau projet permet de définir un identifiant personnalisé
- Location: specs/e2e/project/id-automatique.spec.js:32:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.project-item').first().locator('.project-item__id')
Expected: "mon-film"
Received: "mon-filmmon-film"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('.project-item').first().locator('.project-item__id')
    14 × locator resolved to <span class="project-item__id">mon-filmmon-film</span>
       - unexpected value "mon-filmmon-film"

```

```yaml
- text: mon-filmmon-film
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-projects')
  6  | })
  7  | 
  8  | test("la création d'un nouveau projet calcule l'id depuis le titre", async ({ page }) => {
  9  |   await page.goto('/')
  10 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  11 | 
  12 |   await page.keyboard.press('n')
  13 | 
  14 |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  15 |   const idInput    = page.locator('.project-item.selected input[name="id"]')
  16 | 
  17 |   await expect(titleInput).toBeVisible()
  18 |   await expect(idInput).toBeVisible()
  19 | 
  20 |   await titleInput.fill('Mon Nouveau Projet')
  21 | 
  22 |   // l'id se calcule automatiquement à partir du titre (slug)
  23 |   await expect(idInput).toHaveValue('mon-nouveau-projet')
  24 | 
  25 |   await page.keyboard.press('Enter')
  26 |   await page.waitForLoadState('networkidle')
  27 | 
  28 |   const newItem = page.locator('.project-item').nth(0)
  29 |   await expect(newItem.locator('.project-item__id')).toHaveText('mon-nouveau-projet')
  30 | })
  31 | 
  32 | test("la création d'un nouveau projet permet de définir un identifiant personnalisé", async ({ page }) => {
  33 |   await page.goto('/')
  34 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  35 | 
  36 |   await page.keyboard.press('n')
  37 | 
  38 |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  39 |   const idInput    = page.locator('.project-item.selected input[name="id"]')
  40 | 
  41 |   await titleInput.fill('Mon Film')
  42 |   await page.keyboard.press('Tab')
  43 |   await idInput.fill('mon-film')
  44 |   await page.keyboard.press('Enter')
  45 |   await page.waitForLoadState('networkidle')
  46 | 
  47 |   const newItem = page.locator('.project-item').nth(0)
> 48 |   await expect(newItem.locator('.project-item__id')).toHaveText('mon-film')
     |                                                      ^ Error: expect(locator).toHaveText(expected) failed
  49 | })
  50 | 
  51 | test("taper le titre calcule l'id en temps réel (slug)", async ({ page }) => {
  52 |   await page.goto('/')
  53 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  54 |   await page.keyboard.press('n')
  55 |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  56 |   const idInput    = page.locator('.project-item.selected input[name="id"]')
  57 |   await expect(titleInput).toBeVisible()
  58 |   await titleInput.fill('Mon Nouveau Projet')
  59 |   await expect(idInput).toHaveValue('mon-nouveau-projet')
  60 | })
  61 | 
  62 | test("persistance : l'identifiant calculé depuis le titre survit au rechargement", async ({ page }) => {
  63 |   await page.goto('/')
  64 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  65 | 
  66 |   await page.keyboard.press('n')
  67 |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  68 |   await titleInput.fill('Projet Persistant')
  69 |   await page.keyboard.press('Enter')
  70 |   await page.waitForLoadState('networkidle')
  71 | 
  72 |   const idText = await page.locator('.project-item').nth(0).locator('.project-item__id').textContent()
  73 |   expect(idText.trim()).toBe('projet-persistant')
  74 | 
  75 |   await page.reload()
  76 |   await expect(page.locator('.project-item').nth(0).locator('.project-item__id')).toHaveText('projet-persistant')
  77 | })
  78 | 
```