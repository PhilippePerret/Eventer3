# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-brin.spec.js >> le sélecteur affiche les brins du projet
- Location: specs/e2e/filter/filter-brin.spec.js:29:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.filter-selector-row')
Expected: 2
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.filter-selector-row')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: Scène du bal
      - generic [ref=e12]: —
      - generic [ref=e15]: AMO
    - generic [ref=e18]:
      - generic [ref=e20]: Arrivée à Paris
      - generic [ref=e22]: —
      - generic [ref=e25]: INT
    - generic [ref=e28]:
      - generic [ref=e30]: La trahison
      - generic [ref=e32]: —
      - generic [ref=e34]:
        - generic [ref=e35]: AMO
        - generic [ref=e36]: INT
    - generic [ref=e39]:
      - generic [ref=e41]: Retour au bal
      - generic [ref=e43]: —
  - generic:
    - generic: DISP MODE NESTING
  - contentinfo "Raccourcis clavier" [ref=e44]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect } from '../__setup__.js'
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
  13 | async function enterEventLister(page) {
  14 |   await page.goto('/')
  15 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  16 |   await page.keyboard.press('ArrowRight')
  17 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  18 | }
  19 | 
  20 | // ── Panneau ───────────────────────────────────────────────────────
  21 | 
  22 | test('Cmd+: puis b ouvre le sélecteur de brins', async ({ page }) => {
  23 |   await enterEventLister(page)
  24 |   await page.keyboard.press('Meta+:')
  25 |   await page.keyboard.press('b')
  26 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
  27 | })
  28 | 
  29 | test('le sélecteur affiche les brins du projet', async ({ page }) => {
  30 |   await enterEventLister(page)
  31 |   await page.keyboard.press('Meta+:')
  32 |   await page.keyboard.press('b')
> 33 |   await expect(page.locator('.filter-selector-row')).toHaveCount(2)
     |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  34 | })
  35 | 
  36 | // ── Filtrage réel ─────────────────────────────────────────────────
  37 | 
  38 | test('sélectionner b1 masque les events sans b1', async ({ page }) => {
  39 |   await enterEventLister(page)
  40 |   await page.keyboard.press('Meta+:')
  41 |   await page.keyboard.press('b')
  42 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
  43 |   await page.keyboard.press(' ')      // coche b1 (premier brin)
  44 |   await page.keyboard.press('Enter')  // applique
  45 | 
  46 |   const items = page.locator('.event-item')
  47 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)  // e1 a b1 → visible
  48 |   await expect(items.nth(1)).toHaveClass(/hidden/)       // e2 n'a pas b1 → masqué
  49 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)  // e3 a b1+b2 → visible
  50 |   await expect(items.nth(3)).toHaveClass(/hidden/)       // e4 aucun brin → masqué
  51 | })
  52 | 
  53 | test('Escape dans le sélecteur n\'applique pas le filtre', async ({ page }) => {
  54 |   await enterEventLister(page)
  55 |   await page.keyboard.press('Meta+:')
  56 |   await page.keyboard.press('b')
  57 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
  58 |   await page.keyboard.press(' ')      // coche b1
  59 |   await page.keyboard.press('Escape') // annule
  60 | 
  61 |   const items = page.locator('.event-item')
  62 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  63 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  64 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  65 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  66 | })
  67 | 
  68 | test('Cmd+:: efface le filtre brin et réaffiche tous les events', async ({ page }) => {
  69 |   await enterEventLister(page)
  70 |   await page.keyboard.press('Meta+:')
  71 |   await page.keyboard.press('b')
  72 |   await expect(page.locator('#filter-selector-panel')).toBeVisible()
  73 |   await page.keyboard.press(' ')
  74 |   await page.keyboard.press('Enter')
  75 | 
  76 |   // filtre actif : e2 et e4 masqués
  77 |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/hidden/)
  78 | 
  79 |   // effacement
  80 |   await page.keyboard.press('Meta+:')
  81 |   await page.keyboard.press(':')
  82 | 
  83 |   const items = page.locator('.event-item')
  84 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  85 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  86 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  87 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  88 | })
  89 | 
```