# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-navigation-lister.spec.js >> les events persistent après avoir navigué vers un autre projet et revenu
- Location: specs/e2e/_tdd/project-navigation-lister.spec.js:32:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#main-panel')
Expected pattern: /event-list/
Received string:  "project-list"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#main-panel')
    14 × locator resolved to <main id="main-panel" class="project-list">…</main>
       - unexpected value "project-list"

```

```yaml
- main: Projet A --- roman Projet B --- roman Projet C --- roman Projet caché --- roman
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/project-navigation-lister.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | // Fixture many-projects : 4 projets, aucun n'a de lister_id (pas d'events créés)
  6  | 
  7  | test.beforeEach(() => {
  8  |   installFixtures('many-projects')
  9  | })
  10 | 
  11 | test('ArrowUp sur le premier projet sélectionne le dernier', async ({ page }) => {
  12 |   await page.goto('/')
  13 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  14 |   await pane1(page).locator('#main-panel').press('ArrowUp')
  15 |   const items = pane1(page).locator('.project-item')
  16 |   const last  = items.nth(await items.count() - 1)
  17 |   await expect(last).toHaveClass(/selected/)
  18 | })
  19 | 
  20 | test('ArrowDown sur le dernier projet sélectionne le premier', async ({ page }) => {
  21 |   await page.goto('/')
  22 |   const items = pane1(page).locator('.project-item')
  23 |   const count = await items.count()
  24 |   for (let i = 0; i < count - 1; i++) {
  25 |     await pane1(page).locator('#main-panel').press('ArrowDown')
  26 |   }
  27 |   await expect(items.nth(count - 1)).toHaveClass(/selected/)
  28 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  29 |   await expect(items.nth(0)).toHaveClass(/selected/)
  30 | })
  31 | 
  32 | test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  33 |   await page.goto('/')
  34 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  35 | 
  36 |   // Entrer dans le premier projet → lister virtuel
  37 |   await pane1(page).locator('#main-panel').press('ArrowRight')
> 38 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
     |                                                    ^ Error: expect(locator).toHaveClass(expected) failed
  39 | 
  40 |   // Créer un événement
  41 |   await pane1(page).locator('#main-panel').press('n')
  42 |   await expect(pane1(page).locator('.event-item.selected input[name="title"]')).toBeFocused()
  43 |   await page.keyboard.type('Mon événement test')
  44 |   await pane1(page).locator('#main-panel').press('Enter')
  45 |   // Attendre fin des appels réseau (createLister + createItem + save)
  46 |   await page.waitForLoadState('networkidle')
  47 | 
  48 |   // L'event est visible
  49 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon événement test')
  50 | 
  51 |   // Revenir à la liste des projets
  52 |   await pane1(page).locator('#main-panel').press('ArrowLeft')
  53 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  54 | 
  55 |   // Entrer dans un autre projet (le second)
  56 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  57 |   await pane1(page).locator('#main-panel').press('ArrowRight')
  58 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  59 | 
  60 |   // Revenir à la liste des projets
  61 |   await pane1(page).locator('#main-panel').press('ArrowLeft')
  62 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  63 | 
  64 |   // Revenir au premier projet
  65 |   await pane1(page).locator('#main-panel').press('ArrowUp')
  66 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  67 |   await pane1(page).locator('#main-panel').press('ArrowRight')
  68 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  69 | 
  70 |   // L'event doit toujours être là
  71 |   await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  72 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon événement test')
  73 | })
  74 | 
```