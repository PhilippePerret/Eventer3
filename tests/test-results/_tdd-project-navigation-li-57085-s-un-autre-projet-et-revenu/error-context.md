# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-navigation-lister.spec.js >> les events persistent après avoir navigué vers un autre projet et revenu
- Location: specs/e2e/_tdd/project-navigation-lister.spec.js:32:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item')
Expected: 4
Received: 5
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item')
    14 × locator resolved to 5 elements
       - unexpected value "5"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - main [ref=f1e2]:
      - generic [ref=f1e5]:
        - generic [ref=f1e6]: Évènement un
        - generic [ref=f1e7]:
          - generic [ref=f1e8]: —
          - generic [ref=f1e9]: "---"
          - generic [ref=f1e10]: "---"
      - generic [ref=f1e13]:
        - generic [ref=f1e14]: Évènement deux
        - generic [ref=f1e15]:
          - generic [ref=f1e16]: —
          - generic [ref=f1e17]: "---"
          - generic [ref=f1e18]: "---"
      - generic [ref=f1e21]:
        - generic [ref=f1e22]: Évènement trois
        - generic [ref=f1e23]:
          - generic [ref=f1e24]: —
          - generic [ref=f1e25]: "---"
          - generic [ref=f1e26]: "---"
      - generic [ref=f1e29]:
        - generic [ref=f1e30]: ouvel évéemet
        - generic [ref=f1e31]:
          - generic [ref=f1e32]: —
          - generic [ref=f1e33]: "---"
          - generic [ref=f1e34]: "---"
      - generic [ref=f1e39]:
        - generic [ref=f1e40]: —
        - generic [ref=f1e41]: "---"
        - generic [ref=f1e42]: "---"
    - contentinfo "Raccourcis clavier" [ref=f1e43]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/project-navigation-lister.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | // Fixture two-projects-events : Projet A (3 events), Projet B (2 events)
  6  | 
  7  | test.beforeEach(() => {
  8  |   installFixtures('two-projects-events')
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
  36 |   // Entrer dans Projet A
  37 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  38 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  39 | 
  40 |   // Naviguer entre les events existants
  41 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  42 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  43 | 
  44 |   // Créer un nouvel event
  45 |   await pane1(page).locator('.event-item.selected').press('n')
  46 |   await expect(pane1(page).locator('.event-item.selected [data-field="title"]')).toBeFocused()
  47 |   await page.keyboard.type('Nouvel événement')
  48 |   await pane1(page).locator('.event-item.selected').press('Enter')
  49 |   await page.waitForLoadState('networkidle')
> 50 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
     |                                                    ^ Error: expect(locator).toHaveCount(expected) failed
  51 | 
  52 |   // Revenir à la liste des projets
  53 |   await pane1(page).locator('#main-panel').press('ArrowLeft')
  54 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  55 | 
  56 |   // Entrer dans Projet B
  57 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  58 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  59 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  60 | 
  61 |   // Revenir à la liste des projets
  62 |   await pane1(page).locator('#main-panel').press('ArrowLeft')
  63 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  64 | 
  65 |   // Revenir au Projet A
  66 |   await pane1(page).locator('#main-panel').press('ArrowUp')
  67 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  68 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  69 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  70 | 
  71 |   // Tous les events doivent être là (dont le nouveau)
  72 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  73 |   await expect(pane1(page).locator('.event-item').filter({ hasText: 'Nouvel événement' })).toHaveCount(1)
  74 | })
  75 | 
```