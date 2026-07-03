# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/filter-ux.spec.js >> badge FILTRE dans la barre d'état — couleur selon état >> badge FILTRE reste vert si aucun item masqué
- Location: specs/e2e/_tdd/filter-ux.spec.js:23:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('#filter-input')
    - locator resolved to <input type="text" class="hidden" id="filter-input" autocomplete="off" placeholder="Filtrer par titre…"/>
    - fill("a")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e4]:
      - generic [ref=f1e6]: Projet A
      - generic [ref=f1e7]:
        - generic [ref=f1e10]:
          - generic [ref=f1e11]: Scène du bal
          - generic [ref=f1e13]: —
          - generic [ref=f1e20]: AMO
        - generic [ref=f1e23]:
          - generic [ref=f1e24]: Arrivée à Paris
          - generic [ref=f1e26]: —
          - generic [ref=f1e33]: INT
        - generic [ref=f1e36]:
          - generic [ref=f1e37]: La trahison
          - generic [ref=f1e39]: —
          - generic [ref=f1e45]:
            - generic [ref=f1e46]: AMO
            - generic [ref=f1e47]: INT
        - generic [ref=f1e50]:
          - generic [ref=f1e51]: Retour au bal
          - generic [ref=f1e53]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e57]
    - generic: AIDE ⇧⌘ ?
    - generic [active] [ref=f1e58]:
      - generic [ref=f1e59]: Type de « l'évènemencier » (niv. 1)
      - generic [ref=f1e60]:
        - generic [ref=f1e61]:
          - generic [ref=f1e62]: Nature projet
          - generic [ref=f1e63]: —
        - generic [ref=f1e64]:
          - generic [ref=f1e65]: Nature évènemencier
          - generic [ref=f1e66]: évènemencier
      - generic [ref=f1e67]:
        - generic [ref=f1e68]: ⇥ Appliquer
        - generic [ref=f1e69]: ⇥ Annuler
```

# Test source

```ts
  1   | // Origine : specs/e2e/filter/filter-ux.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  4   | 
  5   | // ── Badge FILTRE : couleur selon état ─────────────────────────────
  6   | 
  7   | test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  8   |   test.beforeEach(() => { installFixtures('filter-events') })
  9   | 
  10  |   async function enterListerEvent(page) {
  11  |     await page.goto('/')
  12  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  13  |     await press(page, 'ArrowRight')
  14  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  15  |   }
  16  | 
  17  |   test('badge FILTRE vert dès Cmd+: (mode filtre activé)', async ({ page }) => {
  18  |     await enterListerEvent(page)
  19  |     await press(page, 'Meta+:')
  20  |     await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  21  |   })
  22  | 
  23  |   test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
  24  |     await enterListerEvent(page)
  25  |     await press(page, 'Meta+:')
  26  |     await press(page, 't')
  27  |     // "bal" → 2 visibles, 2 masqués — mais d'abord tester avec terme qui masque rien
  28  |     // "a" → tous contiennent "a" (Scène du bAl, Arrivée à Paris, lA trAhison, Retour Au bAl)
> 29  |     await pane1(page).locator('#filter-input').fill('a')
      |                                                ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  30  |     await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  31  |     await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  32  |   })
  33  | 
  34  |   test('badge FILTRE rouge quand items masqués', async ({ page }) => {
  35  |     await enterListerEvent(page)
  36  |     await press(page, 'Meta+:')
  37  |     await press(page, 't')
  38  |     // "Paris" → seul "Arrivée à Paris" correspond → 3 masqués
  39  |     await pane1(page).locator('#filter-input').fill('Paris')
  40  |     await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  41  |   })
  42  | 
  43  |   test('badge FILTRE rouge après Enter quand items masqués', async ({ page }) => {
  44  |     await enterListerEvent(page)
  45  |     await press(page, 'Meta+:')
  46  |     await press(page, 't')
  47  |     await pane1(page).locator('#filter-input').fill('Paris')
  48  |     await press(page, 'Enter')
  49  |     await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  50  |   })
  51  | 
  52  |   test('badge FILTRE absent après Escape dans l\'input', async ({ page }) => {
  53  |     await enterListerEvent(page)
  54  |     await press(page, 'Meta+:')
  55  |     await press(page, 't')
  56  |     await pane1(page).locator('#filter-input').fill('Paris')
  57  |     await press(page, 'Escape')
  58  |     await expect(pane1(page).locator('.status-filter-badge--mode')).not.toBeVisible()
  59  |     await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  60  |   })
  61  | })
  62  | 
  63  | // ── Panneau sélecteur : titre sans raccourcis clavier ─────────────
  64  | 
  65  | test.describe('panneau sélecteur de brins — présentation', () => {
  66  |   test.beforeEach(() => { installFixtures('filter-events') })
  67  | 
  68  |   async function enterListerEvent(page) {
  69  |     await page.goto('/')
  70  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  71  |     await press(page, 'ArrowRight')
  72  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  73  |   }
  74  | 
  75  |   test('titre du sélecteur sans raccourcis clavier', async ({ page }) => {
  76  |     await enterListerEvent(page)
  77  |     await press(page, 'Meta+:')
  78  |     await press(page, 'b')
  79  |     await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  80  |     await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('↑↓')
  81  |     await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('naviguer')
  82  |   })
  83  | })
  84  | 
  85  | // ── Input filtre texte : ne recouvre pas le premier item ──────────
  86  | 
  87  | test.describe('input filtre texte ne recouvre pas le contenu', () => {
  88  |   test.beforeEach(() => { installFixtures('filter-events') })
  89  | 
  90  |   async function enterListerEvent(page) {
  91  |     await page.goto('/')
  92  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  93  |     await press(page, 'ArrowRight')
  94  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  95  |   }
  96  | 
  97  |   test('premier item visible sous l\'input filtre (pas recouvert)', async ({ page }) => {
  98  |     await enterListerEvent(page)
  99  |     await press(page, 'Meta+:')
  100 |     await press(page, 't')
  101 | 
  102 |     const inputBox  = await pane1(page).locator('#filter-input').boundingBox()
  103 |     const firstItem = await pane1(page).locator('.event-item').first().boundingBox()
  104 |     // le haut du premier item doit être sous le bas de l'input
  105 |     expect(firstItem.y).toBeGreaterThan(inputBox.y + inputBox.height - 2)
  106 |   })
  107 | })
  108 | 
  109 | // ── Filtre texte : input positionné sur le lister actif ───────────
  110 | 
  111 | test.describe('position de l\'input selon le lister actif', () => {
  112 |   test.beforeEach(() => { installFixtures('filter-events') })
  113 | 
  114 |   async function enterListerEvent(page) {
  115 |     await page.goto('/')
  116 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  117 |     await press(page, 'ArrowRight')
  118 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  119 |   }
  120 | 
  121 |   test('input filter-text apparaît dans les limites du lister actif (events)', async ({ page }) => {
  122 |     await enterListerEvent(page)
  123 | 
  124 |     const panelRect = await pane1(page).locator('#events-panel').boundingBox()
  125 | 
  126 |     await press(page, 'Meta+:')
  127 |     await press(page, 't')
  128 | 
  129 |     const inputRect = await pane1(page).locator('#filter-input').boundingBox()
```