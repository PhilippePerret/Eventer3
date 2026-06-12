# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-navigation-lister.spec.js >> les events persistent après avoir navigué vers un autre projet et revenu
- Location: specs/e2e/project/project-navigation-lister.spec.js:10:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  "event-list"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main data-depth="1" id="main-panel" class="event-list">…</main>
       - unexpected value "event-list"

```

```yaml
- main:
  - navigation
  - text: Mon événement test —
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | // Fixture many-projects : 4 projets, aucun n'a de lister_id (pas d'events créés)
  5  | 
  6  | test.beforeEach(() => {
  7  |   installFixtures('many-projects')
  8  | })
  9  | 
  10 | test('les events persistent après avoir navigué vers un autre projet et revenu', async ({ page }) => {
  11 |   await page.goto('/')
  12 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  13 | 
  14 |   // Entrer dans le premier projet → lister virtuel
  15 |   await page.keyboard.press('ArrowRight')
  16 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  17 | 
  18 |   // Créer un événement
  19 |   await page.keyboard.press('n')
  20 |   await expect(page.locator('.event-item.selected input[name="title"]')).toBeFocused()
  21 |   await page.keyboard.type('Mon événement test')
  22 |   await page.keyboard.press('Enter')
  23 |   // Attendre fin des appels réseau (createLister + createItem + save)
  24 |   await page.waitForLoadState('networkidle')
  25 | 
  26 |   // L'event est visible
  27 |   await expect(page.locator('.event-item').nth(0)).toContainText('Mon événement test')
  28 | 
  29 |   // Revenir à la liste des projets
  30 |   await page.keyboard.press('ArrowLeft')
> 31 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  32 | 
  33 |   // Entrer dans un autre projet (le second)
  34 |   await page.keyboard.press('ArrowDown')
  35 |   await page.keyboard.press('ArrowRight')
  36 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  37 | 
  38 |   // Revenir à la liste des projets
  39 |   await page.keyboard.press('ArrowLeft')
  40 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  41 | 
  42 |   // Revenir au premier projet
  43 |   await page.keyboard.press('ArrowUp')
  44 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  45 |   await page.keyboard.press('ArrowRight')
  46 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  47 | 
  48 |   // L'event doit toujours être là
  49 |   await expect(page.locator('.event-item')).toHaveCount(1)
  50 |   await expect(page.locator('.event-item').nth(0)).toContainText('Mon événement test')
  51 | })
  52 | 
```