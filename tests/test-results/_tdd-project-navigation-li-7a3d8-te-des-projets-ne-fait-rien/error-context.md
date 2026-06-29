# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-navigation-lister.spec.js >> ← sur la liste des projets ne fait rien
- Location: specs/e2e/_tdd/project-navigation-lister.spec.js:11:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.project-item').first()
Expected pattern: /selected/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').first()

```

```yaml
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/project-navigation-lister.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1, press } from '../__setup__.js'
  4  | 
  5  | // Fixture two-projects-events : Projet A (3 events), Projet B (2 events)
  6  | 
  7  | test.beforeEach(() => {
  8  |   installFixtures('two-projects-events')
  9  | })
  10 | 
  11 | test('← sur la liste des projets ne fait rien', async ({ page }) => {
  12 |   await page.goto('/')
> 13 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
     |                                                             ^ Error: expect(locator).toHaveClass(expected) failed
  14 |   const projectCount = await pane1(page).locator('.project-item').count()
  15 |   await press(page, 'ArrowLeft')
  16 |   await expect(pane1(page).locator('.project-item')).toHaveCount(projectCount)
  17 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  18 | })
  19 | 
  20 | test('ArrowUp sur le premier projet sélectionne le dernier', async ({ page }) => {
  21 |   await page.goto('/')
  22 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  23 |   await press(page, 'ArrowUp')
  24 |   const items = pane1(page).locator('.project-item')
  25 |   const last  = items.nth(await items.count() - 1)
  26 |   await expect(last).toHaveClass(/selected/)
  27 | })
  28 | 
  29 | test('ArrowDown sur le dernier projet sélectionne le premier', async ({ page }) => {
  30 |   await page.goto('/')
  31 |   const items = pane1(page).locator('.project-item')
  32 |   const count = await items.count()
  33 |   for (let i = 0; i < count - 1; i++) {
  34 |     await press(page, 'ArrowDown')
  35 |   }
  36 |   await expect(items.nth(count - 1)).toHaveClass(/selected/)
  37 |   await press(page, 'ArrowDown')
  38 |   await expect(items.nth(0)).toHaveClass(/selected/)
  39 | })
  40 | 
  41 | test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  42 |   await page.goto('/')
  43 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  44 | 
  45 |   // Entrer dans Projet A
  46 |   await press(page, 'ArrowRight')
  47 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  48 | 
  49 |   // Naviguer entre les events existants
  50 |   await press(page, 'ArrowDown')
  51 |   await press(page, 'ArrowDown')
  52 | 
  53 |   // Créer un nouvel event
  54 |   await press(page, 'n')
  55 |   const titleField = pane1(page).locator('.event-item.selected [data-field="title"]')
  56 |   await expect(titleField).toBeFocused()
  57 |   await titleField.fill('Nouvel événement')
  58 |   await press(page, 'Enter')
  59 |   await page.waitForLoadState('networkidle')
  60 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  61 | 
  62 |   // Revenir à la liste des projets
  63 |   await press(page, 'ArrowLeft')
  64 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  65 | 
  66 |   // Entrer dans Projet B
  67 |   await press(page, 'ArrowDown')
  68 |   await press(page, 'ArrowRight')
  69 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  70 | 
  71 |   // Revenir à la liste des projets
  72 |   await press(page, 'ArrowLeft')
  73 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  74 | 
  75 |   // Revenir au Projet A
  76 |   await press(page, 'ArrowUp')
  77 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  78 |   await press(page, 'ArrowRight')
  79 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  80 | 
  81 |   // Tous les events doivent être là (dont le nouveau)
  82 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  83 |   await expect(pane1(page).locator('.event-item').filter({ hasText: 'Nouvel événement' })).toHaveCount(1)
  84 | })
  85 | 
```