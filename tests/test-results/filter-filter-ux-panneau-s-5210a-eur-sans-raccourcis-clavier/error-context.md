# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-ux.spec.js >> panneau sélecteur de brins — présentation >> titre du sélecteur sans raccourcis clavier
- Location: specs/e2e/filter/filter-ux.spec.js:74:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#filter-selector-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#filter-selector-panel')
    14 × locator resolved to <div class="hidden" id="filter-selector-panel"></div>
       - unexpected value "hidden"

```

```yaml
- main:
  - navigation:
    - button
    - text: ‹
  - text: Scène du bal — AMO Arrivée à Paris — INT La trahison — AMO INT Retour au bal —
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // ── Badge FILTRE : couleur selon état ─────────────────────────────
  5   | 
  6   | test.describe('badge FILTRE dans la barre d\'état — couleur selon état', () => {
  7   |   test.beforeEach(() => { installFixtures('filter-events') })
  8   | 
  9   |   async function enterEventLister(page) {
  10  |     await page.goto('/')
  11  |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  12  |     await page.keyboard.press('ArrowRight')
  13  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  14  |   }
  15  | 
  16  |   test('badge FILTRE vert dès Cmd+: (mode filtre activé)', async ({ page }) => {
  17  |     await enterEventLister(page)
  18  |     await page.keyboard.press('Meta+:')
  19  |     await expect(page.locator('.status-filter-badge--mode')).toBeVisible()
  20  |   })
  21  | 
  22  |   test('badge FILTRE reste vert si aucun item masqué', async ({ page }) => {
  23  |     await enterEventLister(page)
  24  |     await page.keyboard.press('Meta+:')
  25  |     await page.keyboard.press('t')
  26  |     // "bal" → 2 visibles, 2 masqués — mais d'abord tester avec terme qui masque rien
  27  |     // "a" → tous contiennent "a" (Scène du bAl, Arrivée à Paris, lA trAhison, Retour Au bAl)
  28  |     await page.keyboard.type('a')
  29  |     await expect(page.locator('.status-filter-badge--mode')).toBeVisible()
  30  |     await expect(page.locator('.status-filter-badge--active')).not.toBeVisible()
  31  |   })
  32  | 
  33  |   test('badge FILTRE rouge quand items masqués', async ({ page }) => {
  34  |     await enterEventLister(page)
  35  |     await page.keyboard.press('Meta+:')
  36  |     await page.keyboard.press('t')
  37  |     // "Paris" → seul "Arrivée à Paris" correspond → 3 masqués
  38  |     await page.keyboard.type('Paris')
  39  |     await expect(page.locator('.status-filter-badge--active')).toBeVisible()
  40  |   })
  41  | 
  42  |   test('badge FILTRE rouge après Enter quand items masqués', async ({ page }) => {
  43  |     await enterEventLister(page)
  44  |     await page.keyboard.press('Meta+:')
  45  |     await page.keyboard.press('t')
  46  |     await page.keyboard.type('Paris')
  47  |     await page.keyboard.press('Enter')
  48  |     await expect(page.locator('.status-filter-badge--active')).toBeVisible()
  49  |   })
  50  | 
  51  |   test('badge FILTRE absent après Escape dans l\'input', async ({ page }) => {
  52  |     await enterEventLister(page)
  53  |     await page.keyboard.press('Meta+:')
  54  |     await page.keyboard.press('t')
  55  |     await page.keyboard.type('Paris')
  56  |     await page.keyboard.press('Escape')
  57  |     await expect(page.locator('.status-filter-badge--mode')).not.toBeVisible()
  58  |     await expect(page.locator('.status-filter-badge--active')).not.toBeVisible()
  59  |   })
  60  | })
  61  | 
  62  | // ── Panneau sélecteur : titre sans raccourcis clavier ─────────────
  63  | 
  64  | test.describe('panneau sélecteur de brins — présentation', () => {
  65  |   test.beforeEach(() => { installFixtures('filter-events') })
  66  | 
  67  |   async function enterEventLister(page) {
  68  |     await page.goto('/')
  69  |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  70  |     await page.keyboard.press('ArrowRight')
  71  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  72  |   }
  73  | 
  74  |   test('titre du sélecteur sans raccourcis clavier', async ({ page }) => {
  75  |     await enterEventLister(page)
  76  |     await page.keyboard.press('Meta+:')
  77  |     await page.keyboard.press('b')
> 78  |     await expect(page.locator('#filter-selector-panel')).toBeVisible()
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  79  |     await expect(page.locator('.filter-selector-title')).not.toContainText('↑↓')
  80  |     await expect(page.locator('.filter-selector-title')).not.toContainText('naviguer')
  81  |   })
  82  | })
  83  | 
  84  | // ── Input filtre texte : ne recouvre pas le premier item ──────────
  85  | 
  86  | test.describe('input filtre texte ne recouvre pas le contenu', () => {
  87  |   test.beforeEach(() => { installFixtures('filter-events') })
  88  | 
  89  |   async function enterEventLister(page) {
  90  |     await page.goto('/')
  91  |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  92  |     await page.keyboard.press('ArrowRight')
  93  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  94  |   }
  95  | 
  96  |   test('premier item visible sous l\'input filtre (pas recouvert)', async ({ page }) => {
  97  |     await enterEventLister(page)
  98  |     await page.keyboard.press('Meta+:')
  99  |     await page.keyboard.press('t')
  100 | 
  101 |     const inputBox  = await page.locator('#filter-input').boundingBox()
  102 |     const firstItem = await page.locator('.event-item').first().boundingBox()
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
  113 |   async function enterEventLister(page) {
  114 |     await page.goto('/')
  115 |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  116 |     await page.keyboard.press('ArrowRight')
  117 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  118 |   }
  119 | 
  120 |   test('input filter-text apparaît dans les limites du lister actif (events)', async ({ page }) => {
  121 |     await enterEventLister(page)
  122 | 
  123 |     const panelRect = await page.locator('#main-panel').boundingBox()
  124 | 
  125 |     await page.keyboard.press('Meta+:')
  126 |     await page.keyboard.press('t')
  127 | 
  128 |     const inputRect = await page.locator('#filter-input').boundingBox()
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
  139 |   async function enterEventLister(page) {
  140 |     await page.goto('/')
  141 |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  142 |     await page.keyboard.press('ArrowRight')
  143 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  144 |   }
  145 | 
  146 |   test('Cmd+: puis b sans brins affiche notification', async ({ page }) => {
  147 |     await enterEventLister(page)
  148 | 
  149 |     await page.keyboard.press('Meta+:')
  150 |     await page.keyboard.press('b')
  151 | 
  152 |     await expect(page.locator('#notification')).toBeVisible()
  153 |     await expect(page.locator('#notification')).toContainText('Aucun brin')
  154 |   })
  155 | 
  156 |   test('Cmd+: puis b sans brins ne montre pas le sélecteur', async ({ page }) => {
  157 |     await enterEventLister(page)
  158 | 
  159 |     await page.keyboard.press('Meta+:')
  160 |     await page.keyboard.press('b')
  161 | 
  162 |     await expect(page.locator('#filter-selector-panel')).not.toBeVisible()
  163 |   })
  164 | })
  165 | 
  166 | // ── Barre d'état : indicateur FILTRE ─────────────────────────────
  167 | 
  168 | test.describe('indicateur FILTRE dans la barre d\'état', () => {
  169 |   test.beforeEach(() => { installFixtures('filter-events') })
  170 | 
  171 |   async function enterEventLister(page) {
  172 |     await page.goto('/')
  173 |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  174 |     await page.keyboard.press('ArrowRight')
  175 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  176 |   }
  177 | 
  178 |   test('status bar affiche FILTRE quand un filtre est actif', async ({ page }) => {
```