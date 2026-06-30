# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/style-panel.spec.js >> s ouvre le panneau des styles depuis l'ListerEvent
- Location: specs/e2e/_tdd/style-panel.spec.js:28:1

# Error details

```
Error: locator.waitFor: Test ended.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('#style-panel') to be visible
    14 × locator resolved to hidden <div class="hidden" id="style-panel"></div>

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
> 31  |   await pane1(page).locator('#style-panel').waitFor()
      |                                             ^ Error: locator.waitFor: Test ended.
  32  | })
  33  | 
  34  | test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  35  |   await openStylePanel(page)
  36  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  37  | })
  38  | 
  39  | test("Escape ferme le panneau des styles", async ({ page }) => {
  40  |   await openStylePanel(page)
  41  |   await press(page, 'Escape')
  42  |   await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  43  | })
  44  | 
  45  | test("s ferme le panneau quand il est actif", async ({ page }) => {
  46  |   await openStylePanel(page)
  47  |   await press(page, 's')
  48  |   await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  49  | })
  50  | 
  51  | test("Cmd+Enter ferme le panneau des styles", async ({ page }) => {
  52  |   await openStylePanel(page)
  53  |   await press(page, 'Meta+Enter')
  54  |   await expect(pane1(page).locator('#style-panel')).not.toBeVisible()
  55  | })
  56  | 
  57  | test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection)", async ({ page }) => {
  58  |   await openStylePanel(page)
  59  |   await press(page, 'Escape')
  60  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  61  |   await press(page, 'ArrowDown')
  62  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  63  | })
  64  | 
  65  | // ─── Affichage ──────────────────────────────────────────────────────────────
  66  | 
  67  | test("le panneau affiche les styles disponibles (2 dans le fixture)", async ({ page }) => {
  68  |   await openStylePanel(page)
  69  |   await expect(pane1(page).locator('.style-item')).toHaveCount(2)
  70  | })
  71  | 
  72  | test("chaque style-item a un attribut data-name avec le nom de la classe CSS", async ({ page }) => {
  73  |   await openStylePanel(page)
  74  |   const name0 = await pane1(page).locator('.style-item').nth(0).getAttribute('data-name')
  75  |   const name1 = await pane1(page).locator('.style-item').nth(1).getAttribute('data-name')
  76  |   expect(name0).toBeTruthy()
  77  |   expect(name1).toBeTruthy()
  78  |   expect(name0).not.toBe(name1)
  79  | })
  80  | 
  81  | test("chaque style-item a un aperçu textuel (.style-item__preview)", async ({ page }) => {
  82  |   await openStylePanel(page)
  83  |   await expect(pane1(page).locator('.style-item').nth(0).locator('.style-item__preview')).toBeVisible()
  84  |   await expect(pane1(page).locator('.style-item').nth(1).locator('.style-item__preview')).toBeVisible()
  85  | })
  86  | 
  87  | test("le premier style est sélectionné à l'ouverture", async ({ page }) => {
  88  |   await openStylePanel(page)
  89  |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
  90  |   await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/selected/)
  91  | })
  92  | 
  93  | test("aucun style n'est coché à l'ouverture (event sans css)", async ({ page }) => {
  94  |   await openStylePanel(page)
  95  |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  96  |   await expect(pane1(page).locator('.style-item').nth(1)).not.toHaveClass(/checked/)
  97  | })
  98  | 
  99  | // ─── Navigation ─────────────────────────────────────────────────────────────
  100 | 
  101 | test("↓ sélectionne le style suivant", async ({ page }) => {
  102 |   await openStylePanel(page)
  103 |   await press(page, 'ArrowDown')
  104 |   await expect(pane1(page).locator('.style-item').nth(1)).toHaveClass(/selected/)
  105 |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/selected/)
  106 | })
  107 | 
  108 | test("↑ sélectionne le style précédent", async ({ page }) => {
  109 |   await openStylePanel(page)
  110 |   await press(page, 'ArrowDown')
  111 |   await press(page, 'ArrowUp')
  112 |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/selected/)
  113 | })
  114 | 
  115 | test("↓↑ ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  116 |   await openStylePanel(page)
  117 |   await press(page, 'ArrowDown')
  118 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  119 | })
  120 | 
  121 | // ─── Cocher / décocher ───────────────────────────────────────────────────────
  122 | 
  123 | test("Space coche un style non-coché", async ({ page }) => {
  124 |   await openStylePanel(page)
  125 |   await expect(pane1(page).locator('.style-item').nth(0)).not.toHaveClass(/checked/)
  126 |   await press(page, ' ')
  127 |   await expect(pane1(page).locator('.style-item').nth(0)).toHaveClass(/checked/)
  128 | })
  129 | 
  130 | test("Space décoche un style coché", async ({ page }) => {
  131 |   await openStylePanel(page)
```