# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-brin.spec.js >> Cmd+:: efface le filtre brin et réaffiche tous les events
- Location: specs/e2e/filter/filter-brin.spec.js:68:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#filter-selector-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#filter-selector-panel')
    14 × locator resolved to <div class="hidden" id="filter-selector-panel"></div>
       - unexpected value "hidden"

```

```yaml
- text: "✓ Amour romantique AMO brin #d9c8a9 Intrigue politique INT brin #c8d9a9 Scène du bal — AMO Arrivée à Paris — INT La trahison — AMO INT Retour au bal — DISP MODE NESTING"
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | // Fixture filter-events :
  5  | //   b1 → e1 "Scène du bal", e3 "La trahison"
  6  | //   b2 → e2 "Arrivée à Paris", e3 "La trahison"
  7  | //   e4 "Retour au bal" → aucun brin
  8  | 
  9  | test.beforeEach(() => {
  10 |   installFixtures('filter-events')
  11 | })
  12 | 
  13 | async function enterListerEvent(page) {
  14 |   await page.goto('/')
  15 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  16 |   await press(page, 'ArrowRight')
  17 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  18 | }
  19 | 
  20 | // ── Panneau ───────────────────────────────────────────────────────
  21 | 
  22 | test('Cmd+: puis b ouvre le sélecteur de brins', async ({ page }) => {
  23 |   await enterListerEvent(page)
  24 |   await press(page, 'Meta+:')
  25 |   await press(page, 'b')
  26 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  27 | })
  28 | 
  29 | test('le sélecteur affiche les brins du projet', async ({ page }) => {
  30 |   await enterListerEvent(page)
  31 |   await press(page, 'Meta+:')
  32 |   await press(page, 'b')
  33 |   await expect(pane1(page).locator('.filter-selector-row')).toHaveCount(2)
  34 | })
  35 | 
  36 | // ── Filtrage réel ─────────────────────────────────────────────────
  37 | 
  38 | test('sélectionner b1 masque les events sans b1', async ({ page }) => {
  39 |   await enterListerEvent(page)
  40 |   await press(page, 'Meta+:')
  41 |   await press(page, 'b')
  42 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  43 |   await press(page, ' ')      // coche b1 (premier brin)
  44 |   await press(page, 'Enter')  // applique
  45 | 
  46 |   const items = pane1(page).locator('.event-item')
  47 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)  // e1 a b1 → visible
  48 |   await expect(items.nth(1)).toHaveClass(/hidden/)       // e2 n'a pas b1 → masqué
  49 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)  // e3 a b1+b2 → visible
  50 |   await expect(items.nth(3)).toHaveClass(/hidden/)       // e4 aucun brin → masqué
  51 | })
  52 | 
  53 | test('Escape dans le sélecteur n\'applique pas le filtre', async ({ page }) => {
  54 |   await enterListerEvent(page)
  55 |   await press(page, 'Meta+:')
  56 |   await press(page, 'b')
  57 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
  58 |   await press(page, ' ')      // coche b1
  59 |   await press(page, 'Escape') // annule
  60 | 
  61 |   const items = pane1(page).locator('.event-item')
  62 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  63 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  64 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  65 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  66 | })
  67 | 
  68 | test('Cmd+:: efface le filtre brin et réaffiche tous les events', async ({ page }) => {
  69 |   await enterListerEvent(page)
  70 |   await press(page, 'Meta+:')
  71 |   await press(page, 'b')
> 72 |   await expect(pane1(page).locator('#filter-selector-panel')).toBeVisible()
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  73 |   await press(page, ' ')
  74 |   await press(page, 'Enter')
  75 | 
  76 |   // filtre actif : e2 et e4 masqués
  77 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  78 | 
  79 |   // effacement
  80 |   await press(page, 'Meta+:')
  81 |   await press(page, ':')
  82 | 
  83 |   const items = pane1(page).locator('.event-item')
  84 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  85 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  86 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  87 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  88 | })
  89 | 
```