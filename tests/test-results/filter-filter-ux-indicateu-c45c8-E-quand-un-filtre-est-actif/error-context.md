# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-ux.spec.js >> indicateur FILTRE dans la barre d'état >> status bar affiche FILTRE quand un filtre est actif
- Location: specs/e2e/filter/filter-ux.spec.js:178:3

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('#filter-input')
    - locator resolved to <input type="text" class="hidden" id="filter-input" autocomplete="off" placeholder="Filtrer par titre…"/>
    - fill("bal")
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
  147 |     await enterListerEvent(page)
  148 | 
  149 |     await press(page, 'Meta+:')
  150 |     await press(page, 'b')
  151 | 
  152 |     await expect(pane1(page).locator('#notification')).toBeVisible()
  153 |     await expect(pane1(page).locator('#notification')).toContainText('Aucun brin')
  154 |   })
  155 | 
  156 |   test('Cmd+: puis b sans brins ne montre pas le sélecteur', async ({ page }) => {
  157 |     await enterListerEvent(page)
  158 | 
  159 |     await press(page, 'Meta+:')
  160 |     await press(page, 'b')
  161 | 
  162 |     await expect(pane1(page).locator('#filter-selector-panel')).not.toBeVisible()
  163 |   })
  164 | })
  165 | 
  166 | // ── Barre d'état : indicateur FILTRE ─────────────────────────────
  167 | 
  168 | test.describe('indicateur FILTRE dans la barre d\'état', () => {
  169 |   test.beforeEach(() => { installFixtures('filter-events') })
  170 | 
  171 |   async function enterListerEvent(page) {
  172 |     await page.goto('/')
  173 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  174 |     await press(page, 'ArrowRight')
  175 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  176 |   }
  177 | 
  178 |   test('status bar affiche FILTRE quand un filtre est actif', async ({ page }) => {
  179 |     await enterListerEvent(page)
  180 | 
  181 |     await press(page, 'Meta+:')
  182 |     await press(page, 't')
> 183 |     await pane1(page).locator('#filter-input').fill('bal')
      |                                                ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  184 |     await press(page, 'Enter')
  185 | 
  186 |     await expect(pane1(page).locator('#status-bar')).toContainText('FILTRE')
  187 |   })
  188 | 
  189 |   test('status bar n\'affiche plus FILTRE après effacement du filtre', async ({ page }) => {
  190 |     await enterListerEvent(page)
  191 | 
  192 |     await press(page, 'Meta+:')
  193 |     await press(page, 't')
  194 |     await pane1(page).locator('#filter-input').fill('bal')
  195 |     await press(page, 'Enter')
  196 | 
  197 |     await press(page, 'Meta+:')
  198 |     await press(page, ':')
  199 | 
  200 |     await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  201 |   })
  202 | 
  203 |   test('Escape dans l\'input efface le filtre et retire FILTRE du status bar', async ({ page }) => {
  204 |     await enterListerEvent(page)
  205 | 
  206 |     await press(page, 'Meta+:')
  207 |     await press(page, 't')
  208 |     await pane1(page).locator('#filter-input').fill('bal')
  209 |     await press(page, 'Escape')
  210 | 
  211 |     await expect(pane1(page).locator('#status-bar')).not.toContainText('FILTRE')
  212 |   })
  213 | })
  214 | 
```