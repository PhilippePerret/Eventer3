# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparence/style-panel.spec.js >> après fermeture, l'ListerEvent redevient actif (↓ change la sélection)
- Location: specs/e2e/apparence/style-panel.spec.js:51:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').nth(1)
Expected pattern: /selected/
Received string:  "event-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').nth(1)
    14 × locator resolved to <div data-id="e2" tabindex="-1" class="event-item">…</div>
       - unexpected value "event-item"

```

```yaml
- text: Événement 2 —
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/apparence/style-panel.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | import { test, expect, pane1, press } from '../__setup__.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('with-styles')
  7   | })
  8   | 
  9   | // fixture with-styles :
  10  | //   project-a, events e1/e2, brins b1/b2
  11  | //   themes/default.css : .titre (font-size:26px, underline), .note-rouge (font-size:9px, red, margin)
  12  | 
  13  | async function goToListerEvent(page) {
  14  |   await page.goto('/')
  15  |   await pane1(page).locator('#projects-panel').waitFor()
  16  |   await press(page, 'ArrowRight')
  17  |   await pane1(page).locator('#events-panel').waitFor()
  18  | }
  19  | 
  20  | async function openStylePanel(page) {
  21  |   await goToListerEvent(page)
  22  |   await press(page, 's')
  23  |   await pane1(page).locator('#style-panel').waitFor()
  24  | }
  25  | 
  26  | // ─── Ouverture / fermeture ──────────────────────────────────────────────────
  27  | 
  28  | test("s ouvre le panneau des styles depuis l'ListerEvent", async ({ page }) => {
  29  |   await goToListerEvent(page)
  30  |   await press(page, 's')
  31  |   await pane1(page).locator('#style-panel').waitFor()
  32  | })
  33  | 
  34  | test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  35  |   await openStylePanel(page)
  36  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  37  | })
  38  | 
  39  | test("s ferme le panneau quand il est actif", async ({ page }) => {
  40  |   await openStylePanel(page)
  41  |   await press(page, 's')
  42  |   await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  43  | })
  44  | 
  45  | test("Cmd+Enter ferme le panneau des styles", async ({ page }) => {
  46  |   await openStylePanel(page)
  47  |   await press(page, 'Meta+Enter')
  48  |   await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  49  | })
  50  | 
  51  | test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection)", async ({ page }) => {
  52  |   await openStylePanel(page)
  53  |   await press(page, 's')
  54  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  55  |   await press(page, 'ArrowDown')
> 56  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
      |                                                           ^ Error: expect(locator).toHaveClass(expected) failed
  57  | })
  58  | 
  59  | // ─── Affichage ──────────────────────────────────────────────────────────────
  60  | 
  61  | test("le panneau affiche les styles disponibles (2 dans le fixture)", async ({ page }) => {
  62  |   await openStylePanel(page)
  63  |   await expect(pane1(page).locator('.style-item')).toHaveCount(2)
  64  | })
  65  | 
  66  | test("chaque style-item a un attribut data-name avec le nom de la classe CSS", async ({ page }) => {
  67  |   await openStylePanel(page)
  68  |   const name0 = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  69  |   const name1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  70  |   expect(name0).toBeTruthy()
  71  |   expect(name1).toBeTruthy()
  72  |   expect(name0).not.toBe(name1)
  73  | })
  74  | 
  75  | test("chaque style-item a un aperçu textuel (.style-item__preview)", async ({ page }) => {
  76  |   await openStylePanel(page)
  77  |   await expect(pane1(page).locator('.style-item').nth(0).locator('.style-item__preview')).toBeVisible()
  78  |   await expect(pane1(page).locator('.style-item').nth(1).locator('.style-item__preview')).toBeVisible()
  79  | })
  80  | 
  81  | test("le premier style est sélectionné à l'ouverture", async ({ page }) => {
  82  |   await openStylePanel(page)
  83  |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
  84  |   await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/selected/)
  85  | })
  86  | 
  87  | test("aucun style n'est coché à l'ouverture (event sans css)", async ({ page }) => {
  88  |   await openStylePanel(page)
  89  |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  90  |   await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/checked/)
  91  | })
  92  | 
  93  | // ─── Navigation ─────────────────────────────────────────────────────────────
  94  | 
  95  | test("↓ sélectionne le style suivant", async ({ page }) => {
  96  |   await openStylePanel(page)
  97  |   await press(page, 'ArrowDown')
  98  |   await expect(pane1(page).locator('.style-item').nth(1)).toHaveClass(/selected/)
  99  |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/selected/)
  100 | })
  101 | 
  102 | test("↑ sélectionne le style précédent", async ({ page }) => {
  103 |   await openStylePanel(page)
  104 |   await press(page, 'ArrowDown')
  105 |   await press(page, 'ArrowUp')
  106 |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
  107 | })
  108 | 
  109 | test("↓↑ ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  110 |   await openStylePanel(page)
  111 |   await press(page, 'ArrowDown')
  112 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  113 | })
  114 | 
  115 | // ─── Cocher / décocher ───────────────────────────────────────────────────────
  116 | 
  117 | test("Space coche un style non-coché", async ({ page }) => {
  118 |   await openStylePanel(page)
  119 |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  120 |   await press(page, ' ')
  121 |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
  122 | })
  123 | 
  124 | test("Space décoche un style coché", async ({ page }) => {
  125 |   await openStylePanel(page)
  126 |   await press(page, ' ')
  127 |   await press(page, ' ')
  128 |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  129 | })
  130 | 
  131 | // ─── Application CSS immédiate ───────────────────────────────────────────────
  132 | 
  133 | test("cocher .titre applique font-size:26px à .event-title de l'event courant", async ({ page }) => {
  134 |   await openStylePanel(page)
  135 |   const name0 = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  136 |   expect(name0).toBe('titre')
  137 |   await press(page, ' ')
  138 |   await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
  139 |     .toHaveCSS('font-size', '26px')
  140 | })
  141 | 
  142 | test("cocher .note-rouge applique font-size:9px à .event-title", async ({ page }) => {
  143 |   await openStylePanel(page)
  144 |   await press(page, 'ArrowDown')
  145 |   const name1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  146 |   expect(name1).toBe('note-rouge')
  147 |   await press(page, ' ')
  148 |   await expect(pane1(page).locator('.event-item').nth(0).locator('.event-title'))
  149 |     .toHaveCSS('font-size', '9px')
  150 | })
  151 | 
  152 | test("cocher .note-rouge applique margin-left à .event-title (inline-block requis)", async ({ page }) => {
  153 |   await openStylePanel(page)
  154 |   await press(page, 'ArrowDown')
  155 |   await press(page, ' ')
  156 |   const ml = await pane1(page).locator('.event-item').nth(0).locator('.event-title').evaluate(el =>
```