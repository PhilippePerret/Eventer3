# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filter/filter-text.spec.js >> Cmd+: puis t affiche un input de filtre texte
- Location: specs/e2e/filter/filter-text.spec.js:49:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#filter-input')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#filter-input')
    14 × locator resolved to <input type="text" class="hidden" id="filter-input" autocomplete="off" placeholder="Filtrer par titre…"/>
       - unexpected value "hidden"

```

```yaml
- text: Scène du bal — AMO Arrivée à Paris — INT La trahison — AMO INT Retour au bal — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('filter-events')
  6   | })
  7   | 
  8   | // Fixture : 4 events
  9   | //   e1 "Scène du bal"     brin_ids: [b1]
  10  | //   e2 "Arrivée à Paris"  brin_ids: [b2]
  11  | //   e3 "La trahison"      brin_ids: [b1,b2]
  12  | //   e4 "Retour au bal"    brin_ids: []
  13  | 
  14  | async function enterListerEvent(page) {
  15  |   await page.goto('/')
  16  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  17  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  18  |   await press(page, 'ArrowRight')
  19  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  20  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  21  | }
  22  | 
  23  | // ── Cmd+: affiche le hint immédiatement ───────────────────────────
  24  | 
  25  | test('Cmd+: affiche filter-bar avec hint des sous-commandes', async ({ page }) => {
  26  |   await enterListerEvent(page)
  27  |   await expect(pane1(page).locator('#filter-bar')).not.toBeVisible()
  28  | 
  29  |   await press(page, 'Meta+:')
  30  | 
  31  |   await expect(pane1(page).locator('#filter-bar')).toBeVisible()
  32  |   await expect(pane1(page).locator('#filter-bar')).toContainText('t')
  33  |   await expect(pane1(page).locator('#filter-bar')).toContainText('b')
  34  |   await expect(pane1(page).locator('#filter-bar')).toContainText('p')
  35  | })
  36  | 
  37  | test('Escape depuis filter-sequence ferme le hint', async ({ page }) => {
  38  |   await enterListerEvent(page)
  39  |   await press(page, 'Meta+:')
  40  |   await expect(pane1(page).locator('#filter-bar')).toBeVisible()
  41  | 
  42  |   await press(page, 'Escape')
  43  | 
  44  |   await expect(pane1(page).locator('#filter-bar')).not.toBeVisible()
  45  | })
  46  | 
  47  | // ── Cmd+: + t : ouvre l'input de filtre texte ─────────────────────
  48  | 
  49  | test('Cmd+: puis t affiche un input de filtre texte', async ({ page }) => {
  50  |   await enterListerEvent(page)
  51  |   await expect(pane1(page).locator('#filter-input')).not.toBeVisible()
  52  | 
  53  |   await press(page, 'Meta+:')
  54  |   await press(page, 't')
  55  | 
> 56  |   await expect(pane1(page).locator('#filter-input')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  57  |   await expect(pane1(page).locator('#filter-input')).toBeFocused()
  58  | })
  59  | 
  60  | // ── filtrage live (sans Enter) ─────────────────────────────────────
  61  | 
  62  | test('filtrage live : "bal" filtre dès la frappe sans Enter', async ({ page }) => {
  63  |   await enterListerEvent(page)
  64  | 
  65  |   await press(page, 'Meta+:')
  66  |   await press(page, 't')
  67  |   await pane1(page).locator('#filter-input').fill('bal')
  68  |   // Pas de Enter — filtre live
  69  | 
  70  |   const items = pane1(page).locator('.event-item')
  71  |   await expect(items.nth(0)).not.toHaveClass(/hidden/)  // "Scène du bal"
  72  |   await expect(items.nth(1)).toHaveClass(/hidden/)       // "Arrivée à Paris"
  73  |   await expect(items.nth(2)).toHaveClass(/hidden/)       // "La trahison"
  74  |   await expect(items.nth(3)).not.toHaveClass(/hidden/)  // "Retour au bal"
  75  | })
  76  | 
  77  | test('filtrage live : insensible à la casse', async ({ page }) => {
  78  |   await enterListerEvent(page)
  79  | 
  80  |   await press(page, 'Meta+:')
  81  |   await press(page, 't')
  82  |   await pane1(page).locator('#filter-input').fill('BAL')
  83  | 
  84  |   await expect(pane1(page).locator('.event-item').nth(0)).not.toHaveClass(/hidden/)
  85  |   await expect(pane1(page).locator('.event-item').nth(3)).not.toHaveClass(/hidden/)
  86  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  87  | })
  88  | 
  89  | // ── Enter ferme l'input, filtre reste actif ────────────────────────
  90  | 
  91  | test("Enter ferme l'input sans annuler le filtre", async ({ page }) => {
  92  |   await enterListerEvent(page)
  93  | 
  94  |   await press(page, 'Meta+:')
  95  |   await press(page, 't')
  96  |   await pane1(page).locator('#filter-input').fill('bal')
  97  |   await press(page, 'Enter')
  98  | 
  99  |   await expect(pane1(page).locator('#filter-input')).not.toBeVisible()
  100 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  101 |   await expect(pane1(page).locator('.event-item').nth(2)).toHaveClass(/hidden/)
  102 | })
  103 | 
  104 | // ── navigation saute les items cachés ─────────────────────────────
  105 | 
  106 | test('navigation ↓ saute les items cachés par le filtre', async ({ page }) => {
  107 |   await enterListerEvent(page)
  108 | 
  109 |   await press(page, 'Meta+:')
  110 |   await press(page, 't')
  111 |   await pane1(page).locator('#filter-input').fill('bal')
  112 |   await press(page, 'Enter')
  113 | 
  114 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  115 |   await press(page, 'ArrowDown')
  116 | 
  117 |   await expect(pane1(page).locator('.event-item').nth(3)).toHaveClass(/selected/)
  118 |   await expect(pane1(page).locator('.event-item').nth(1)).not.toHaveClass(/selected/)
  119 | })
  120 | 
  121 | // ── FilterBar affiche le filtre actif ─────────────────────────────
  122 | 
  123 | test('FilterBar affiche le terme de filtre texte actif', async ({ page }) => {
  124 |   await enterListerEvent(page)
  125 | 
  126 |   await press(page, 'Meta+:')
  127 |   await press(page, 't')
  128 |   await pane1(page).locator('#filter-input').fill('bal')
  129 |   await press(page, 'Enter')
  130 | 
  131 |   await expect(pane1(page).locator('#filter-bar')).toBeVisible()
  132 |   await expect(pane1(page).locator('#filter-bar')).toContainText('bal')
  133 | })
  134 | 
  135 | // ── Cmd+: puis : efface le filtre ─────────────────────────────────
  136 | 
  137 | test('Cmd+: puis : efface le filtre texte', async ({ page }) => {
  138 |   await enterListerEvent(page)
  139 | 
  140 |   await press(page, 'Meta+:')
  141 |   await press(page, 't')
  142 |   await pane1(page).locator('#filter-input').fill('bal')
  143 |   await press(page, 'Enter')
  144 | 
  145 |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/hidden/)
  146 | 
  147 |   await press(page, 'Meta+:')
  148 |   await press(page, ':')
  149 | 
  150 |   const items = pane1(page).locator('.event-item')
  151 |   await expect(items.nth(0)).not.toHaveClass(/hidden/)
  152 |   await expect(items.nth(1)).not.toHaveClass(/hidden/)
  153 |   await expect(items.nth(2)).not.toHaveClass(/hidden/)
  154 |   await expect(items.nth(3)).not.toHaveClass(/hidden/)
  155 | })
  156 | 
```