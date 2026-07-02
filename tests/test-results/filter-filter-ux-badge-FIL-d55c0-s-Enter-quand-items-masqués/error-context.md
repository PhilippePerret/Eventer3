# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-ux.spec.js >> badge FILTRE dans la barre d'état — couleur selon état >> badge FILTRE rouge après Enter quand items masqués
- Location: specs/e2e/filter/filter-ux.spec.js:42:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('#filter-input')
    - locator resolved to <input type="text" class="hidden" id="filter-input" autocomplete="off" placeholder="Filtrer par titre…"/>
    - fill("Paris")
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
    - generic [ref=f1e5]:
      - generic [ref=f1e8]:
        - generic [ref=f1e9]: Scène du bal
        - generic [ref=f1e11]: —
        - generic [ref=f1e15]: AMO
      - generic [ref=f1e18]:
        - generic [ref=f1e19]: Arrivée à Paris
        - generic [ref=f1e21]: —
        - generic [ref=f1e25]: INT
      - generic [ref=f1e28]:
        - generic [ref=f1e29]: La trahison
        - generic [ref=f1e31]: —
        - generic [ref=f1e34]:
          - generic [ref=f1e35]: AMO
          - generic [ref=f1e36]: INT
      - generic [ref=f1e39]:
        - generic [ref=f1e40]: Retour au bal
        - generic [ref=f1e42]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e43]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | // ── Badge FILTRE : couleur selon état ─────────────────────────────
  5   | 
  6   | test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  7   |   test.beforeEach(() => { installFixtures('filter-events') })
  8   | 
  9   |   async function enterListerEvent(page) {
  10  |     await page.goto('/')
  11  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  12  |     await press(page, 'ArrowRight')
  13  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14  |   }
  15  | 
  16  |   test('badge FILTRE vert dès Cmd+: (mode filtre activé)', async ({ page }) => {
  17  |     await enterListerEvent(page)
  18  |     await press(page, 'Meta+:')
  19  |     await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  20  |   })
  21  | 
  22  |   test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
  23  |     await enterListerEvent(page)
  24  |     await press(page, 'Meta+:')
  25  |     await press(page, 't')
  26  |     // "bal" → 2 visibles, 2 masqués — mais d'abord tester avec terme qui masque rien
  27  |     // "a" → tous contiennent "a" (Scène du bAl, Arrivée à Paris, lA trAhison, Retour Au bAl)
  28  |     await pane1(page).locator('#filter-input').fill('a')
  29  |     await expect(pane1(page).locator('.status-filter-badge--mode')).toBeVisible()
  30  |     await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  31  |   })
  32  | 
  33  |   test('badge FILTRE rouge quand items masqués', async ({ page }) => {
  34  |     await enterListerEvent(page)
  35  |     await press(page, 'Meta+:')
  36  |     await press(page, 't')
  37  |     // "Paris" → seul "Arrivée à Paris" correspond → 3 masqués
  38  |     await pane1(page).locator('#filter-input').fill('Paris')
  39  |     await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  40  |   })
  41  | 
  42  |   test('badge FILTRE rouge après Enter quand items masqués', async ({ page }) => {
  43  |     await enterListerEvent(page)
  44  |     await press(page, 'Meta+:')
  45  |     await press(page, 't')
> 46  |     await pane1(page).locator('#filter-input').fill('Paris')
      |                                                ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  47  |     await press(page, 'Enter')
  48  |     await expect(pane1(page).locator('.status-filter-badge--active')).toBeVisible()
  49  |   })
  50  | 
  51  |   test('badge FILTRE absent après Escape dans l\'input', async ({ page }) => {
  52  |     await enterListerEvent(page)
  53  |     await press(page, 'Meta+:')
  54  |     await press(page, 't')
  55  |     await pane1(page).locator('#filter-input').fill('Paris')
  56  |     await press(page, 'Escape')
  57  |     await expect(pane1(page).locator('.status-filter-badge--mode')).not.toBeVisible()
  58  |     await expect(pane1(page).locator('.status-filter-badge--active')).not.toBeVisible()
  59  |   })
  60  | })
  61  | 
  62  | // ── Panneau sélecteur : titre sans raccourcis clavier ─────────────
  63  | 
  64  | test.describe('panneau sélecteur de brins — présentation', () => {
  65  |   test.beforeEach(() => { installFixtures('filter-events') })
  66  | 
  67  |   async function enterListerEvent(page) {
  68  |     await page.goto('/')
  69  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  70  |     await press(page, 'ArrowRight')
  71  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  72  |   }
  73  | 
  74  |   test('titre du sélecteur sans raccourcis clavier', async ({ page }) => {
  75  |     await enterListerEvent(page)
  76  |     await press(page, 'Meta+:')
  77  |     await press(page, 'b')
  78  |     await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  79  |     await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('↑↓')
  80  |     await expect(pane1(page).locator('.filter-selector-title')).not.toContainText('naviguer')
  81  |   })
  82  | })
  83  | 
  84  | // ── Input filtre texte : ne recouvre pas le premier item ──────────
  85  | 
  86  | test.describe('input filtre texte ne recouvre pas le contenu', () => {
  87  |   test.beforeEach(() => { installFixtures('filter-events') })
  88  | 
  89  |   async function enterListerEvent(page) {
  90  |     await page.goto('/')
  91  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  92  |     await press(page, 'ArrowRight')
  93  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  94  |   }
  95  | 
  96  |   test('premier item visible sous l\'input filtre (pas recouvert)', async ({ page }) => {
  97  |     await enterListerEvent(page)
  98  |     await press(page, 'Meta+:')
  99  |     await press(page, 't')
  100 | 
  101 |     const inputBox  = await pane1(page).locator('#filter-input').boundingBox()
  102 |     const firstItem = await pane1(page).locator('.event-item').first().boundingBox()
  103 |     // le haut du premier item doit être sous le bas de l'input
  104 |     expect(firstItem.y).toBeGreaterThan(inputBox.y + inputBox.height - 2)
  105 |   })
  106 | })
  107 | 
  108 | // ── Filtre texte : input positionné sur le lister actif ───────────
  109 | 
  110 | test.describe('position de l\'input selon le lister actif', () => {
  111 |   test.beforeEach(() => { installFixtures('filter-events') })
  112 | 
  113 |   async function enterListerEvent(page) {
  114 |     await page.goto('/')
  115 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  116 |     await press(page, 'ArrowRight')
  117 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  118 |   }
  119 | 
  120 |   test('input filter-text apparaît dans les limites du lister actif (events)', async ({ page }) => {
  121 |     await enterListerEvent(page)
  122 | 
  123 |     const panelRect = await pane1(page).locator('#events-panel').boundingBox()
  124 | 
  125 |     await press(page, 'Meta+:')
  126 |     await press(page, 't')
  127 | 
  128 |     const inputRect = await pane1(page).locator('#filter-input').boundingBox()
  129 |     // l'input doit commencer au niveau vertical du lister (± 2px)
  130 |     expect(inputRect.y).toBeCloseTo(panelRect.y, -1)
  131 |   })
  132 | })
  133 | 
  134 | // ── Filtre brins : notification si aucun brin ─────────────────────
  135 | 
  136 | test.describe('filtre brins sans brins disponibles', () => {
  137 |   test.beforeEach(() => { installFixtures('filter-no-brins') })
  138 | 
  139 |   async function enterListerEvent(page) {
  140 |     await page.goto('/')
  141 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  142 |     await press(page, 'ArrowRight')
  143 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  144 |   }
  145 | 
  146 |   test('Cmd+: puis b sans brins affiche notification', async ({ page }) => {
```