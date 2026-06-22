# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-keyboard-delete.spec.js >> Delete dans ProjectLister >> l'aide contextuelle mentionne ⌦ dans le ProjectLister avec plusieurs projets
- Location: specs/e2e/_tdd/project-keyboard-delete.spec.js:33:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.contextual-help')
Expected substring: "⌦"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.contextual-help')

```

```yaml
- main: Projet A --- roman Projet B --- roman Projet C --- roman Projet caché --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/keyboard-delete.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | // ─── PROJETS ───────────────────────────────────────────────────────────────
  6  | // many-projects : Projet A (index 0), Projet B (index 1), Projet C (index 2)
  7  | 
  8  | test.describe('Delete dans ProjectLister', () => {
  9  | 
  10 |   test.beforeEach(() => installFixtures('many-projects'))
  11 | 
  12 |   test('Delete supprime le projet sélectionné', async ({ page }) => {
  13 |     await page.goto('/')
  14 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  15 |     const items = pane1(page).locator('.project-item')
  16 |     const initialCount = await items.count()
  17 |     await pane1(page).locator('#main-panel').press('Delete')
  18 |     await expect(items).toHaveCount(initialCount - 1)
  19 |   })
  20 | 
  21 |   test('la suppression du projet est persistante (rechargement)', async ({ page }) => {
  22 |     await page.goto('/')
  23 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  24 |     const items = pane1(page).locator('.project-item')
  25 |     const initialCount = await items.count()
  26 |     await pane1(page).locator('#main-panel').press('Delete')
  27 |     await expect(items).toHaveCount(initialCount - 1)
  28 |     await page.waitForLoadState('networkidle')
  29 |     await page.reload()
  30 |     await expect(items).toHaveCount(initialCount - 1)
  31 |   })
  32 | 
  33 |   test('l\'aide contextuelle mentionne ⌦ dans le ProjectLister avec plusieurs projets', async ({ page }) => {
  34 |     await page.goto('/')
  35 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  36 |     await pane1(page).locator('#main-panel').press('Meta+?')
> 37 |     await expect(pane1(page).locator('.contextual-help')).toContainText('⌦')
     |                                                           ^ Error: expect(locator).toContainText(expected) failed
  38 |     await pane1(page).locator('#main-panel').press('Escape')
  39 |   })
  40 | 
  41 |   test('quand un seul projet reste, le footer ne mentionne plus ⌦', async ({ page }) => {
  42 |     await page.goto('/')
  43 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  44 |     const items = pane1(page).locator('.project-item')
  45 |     const initialCount = await items.count()
  46 |     for (let i = 0; i < initialCount - 1; i++) {
  47 |       await pane1(page).locator('#main-panel').press('Delete')
  48 |       await expect(items).toHaveCount(initialCount - i - 1)
  49 |     }
  50 |     await expect(items).toHaveCount(1)
  51 |     await expect(pane1(page).locator('#shortcuts-footer')).not.toContainText('⌦')
  52 |   })
  53 | 
  54 |   test('quand un seul projet reste, Delete ne le supprime pas et affiche un message', async ({ page }) => {
  55 |     await page.goto('/')
  56 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  57 |     const items = pane1(page).locator('.project-item')
  58 |     const initialCount = await items.count()
  59 |     for (let i = 0; i < initialCount - 1; i++) {
  60 |       await pane1(page).locator('#main-panel').press('Delete')
  61 |       await expect(items).toHaveCount(initialCount - i - 1)
  62 |     }
  63 |     await expect(items).toHaveCount(1)
  64 |     await pane1(page).locator('#main-panel').press('Delete')
  65 |     await expect(items).toHaveCount(1)
  66 |     await expect(pane1(page).locator('#notification')).toBeVisible()
  67 |   })
  68 | 
  69 |   test('Delete sur le dernier projet sélectionne le projet précédent', async ({ page }) => {
  70 |     await page.goto('/')
  71 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  72 |     const items = pane1(page).locator('.project-item')
  73 |     const initialCount = await items.count()
  74 |     // Naviguer jusqu'au dernier item
  75 |     for (let i = 0; i < initialCount - 1; i++) {
  76 |       await pane1(page).locator('#main-panel').press('ArrowDown')
  77 |     }
  78 |     await expect(items.last()).toHaveClass(/selected/)
  79 |     // Supprimer le dernier
  80 |     await pane1(page).locator('#main-panel').press('Delete')
  81 |     await expect(items).toHaveCount(initialCount - 1)
  82 |     // Le nouvel dernier item doit être sélectionné
  83 |     await expect(items.last()).toHaveClass(/selected/)
  84 |   })
  85 | 
  86 | })
```