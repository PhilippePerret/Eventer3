# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-alt-arrows-panels.spec.js >> perso panel (depuis BrinPanel) : ⌥↓ sélectionne le brin suivant
- Location: specs/e2e/keyboard/keyboard-alt-arrows-panels.spec.js:81:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item').nth(1)
Expected pattern: /selected/
Received string:  "brin-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item').nth(1)
    14 × locator resolved to <div data-id="b2" tabindex="-1" class="brin-item">…</div>
       - unexpected value "brin-item"

```

```yaml
- text: "Autre brin AUT brin #c8d9a9"
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | // fixture with-brins : project-a, e1/e2, b1 (MON) / b2 (AUT), pas de persos
  5   | // fixture with-brins-and-persos : project-a, e1/e2, b1 (MON)/b2 (AUT), c1 (CY)/c2 (RO)
  6   | 
  7   | async function goToListerEvent(page) {
  8   |   await page.goto('/')
  9   |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  10  |   await press(page, 'ArrowRight')
  11  |   await press(page, 'ArrowRight')
  12  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  13  | }
  14  | 
  15  | // ─── Brin panel : ⌥↓↑ navigue les events ────────────────────────────────────
  16  | 
  17  | test("brin panel : ⌥↓ sélectionne l'event suivant", async ({ page }) => {
  18  |   installFixtures('with-brins')
  19  |   await goToListerEvent(page)
  20  |   await press(page, 'b')
  21  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  22  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  23  |   await press(page, 'Alt+ArrowDown')
  24  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  25  | })
  26  | 
  27  | test("brin panel : ⌥↑ sélectionne l'event précédent", async ({ page }) => {
  28  |   installFixtures('with-brins')
  29  |   await goToListerEvent(page)
  30  |   await press(page, 'b')
  31  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  32  |   await press(page, 'Alt+ArrowDown')
  33  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  34  |   await press(page, 'Alt+ArrowUp')
  35  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  36  | })
  37  | 
  38  | test("brin panel : ⌥↓ ne change pas la sélection du brin actif", async ({ page }) => {
  39  |   installFixtures('with-brins')
  40  |   await goToListerEvent(page)
  41  |   await press(page, 'b')
  42  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  43  |   await press(page, 'Alt+ArrowDown')
  44  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  45  | })
  46  | 
  47  | // ─── Perso panel depuis ListerEvent : ⌥↓↑ navigue les events ───────────────
  48  | 
  49  | test("perso panel (depuis ListerEvent) : ⌥↓ sélectionne l'event suivant", async ({ page }) => {
  50  |   installFixtures('with-brins-and-persos')
  51  |   await goToListerEvent(page)
  52  |   await press(page, 'p')
  53  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  54  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  55  |   await press(page, 'Alt+ArrowDown')
  56  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  57  | })
  58  | 
  59  | test("perso panel (depuis ListerEvent) : ⌥↑ sélectionne l'event précédent", async ({ page }) => {
  60  |   installFixtures('with-brins-and-persos')
  61  |   await goToListerEvent(page)
  62  |   await press(page, 'p')
  63  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  64  |   await press(page, 'Alt+ArrowDown')
  65  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  66  |   await press(page, 'Alt+ArrowUp')
  67  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  68  | })
  69  | 
  70  | test("perso panel (depuis ListerEvent) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  71  |   installFixtures('with-brins-and-persos')
  72  |   await goToListerEvent(page)
  73  |   await press(page, 'p')
  74  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  75  |   await press(page, 'Alt+ArrowDown')
  76  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  77  | })
  78  | 
  79  | // ─── Perso panel depuis BrinPanel : ⌥↓↑ navigue les brins ──────────────────
  80  | 
  81  | test("perso panel (depuis BrinPanel) : ⌥↓ sélectionne le brin suivant", async ({ page }) => {
  82  |   installFixtures('with-brins-and-persos')
  83  |   await goToListerEvent(page)
  84  |   await press(page, 'b')
  85  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  86  |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  87  |   await press(page, 'p')
  88  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  89  |   await press(page, 'Alt+ArrowDown')
> 90  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
      |                                                          ^ Error: expect(locator).toHaveClass(expected) failed
  91  | })
  92  | 
  93  | test("perso panel (depuis BrinPanel) : ⌥↑ sélectionne le brin précédent", async ({ page }) => {
  94  |   installFixtures('with-brins-and-persos')
  95  |   await goToListerEvent(page)
  96  |   await press(page, 'b')
  97  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  98  |   await press(page, 'p')
  99  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  100 |   await press(page, 'Alt+ArrowDown')
  101 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  102 |   await press(page, 'Alt+ArrowUp')
  103 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  104 | })
  105 | 
  106 | test("perso panel (depuis BrinPanel) : ⌥↓ ne change pas la sélection du perso", async ({ page }) => {
  107 |   installFixtures('with-brins-and-persos')
  108 |   await goToListerEvent(page)
  109 |   await press(page, 'b')
  110 |   await press(page, 'p')
  111 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  112 |   await press(page, 'Alt+ArrowDown')
  113 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  114 | })
  115 | 
  116 | // ─── Refresh état coché après ⌥↓↑ ───────────────────────────────────────────
  117 | 
  118 | test("brin panel : ⌥↓ rafraîchit l'état coché des brins", async ({ page }) => {
  119 |   // with-brins : e1 a brin_ids=["b2"] → b2 coché ; e2 a [] → rien coché
  120 |   installFixtures('with-brins')
  121 |   await goToListerEvent(page)
  122 |   await press(page, 'b')
  123 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  124 |   await press(page, 'Alt+ArrowDown')
  125 |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  126 | })
  127 | 
  128 | test("brin panel : ⌥↓ met à jour le titre (nom de l'event en fond)", async ({ page }) => {
  129 |   installFixtures('with-brins')
  130 |   await goToListerEvent(page)
  131 |   await press(page, 'b')
  132 |   await expect(pane1(page).locator('.panel-title')).toContainText('Événement 1')
  133 |   await press(page, 'Alt+ArrowDown')
  134 |   await expect(pane1(page).locator('.panel-title')).toContainText('Événement 2')
  135 | })
  136 | 
  137 | test("brin panel : espace après ⌥↓ coche pour l'event sélectionné en fond", async ({ page }) => {
  138 |   // alt+↓ → e2 ; espace sur b1 → b1 coché pour e2
  139 |   installFixtures('with-brins')
  140 |   await goToListerEvent(page)
  141 |   await press(page, 'b')
  142 |   await press(page, 'Alt+ArrowDown')
  143 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  144 |   await press(page, ' ')
  145 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  146 |   // e1 ne doit pas avoir b1 coché
  147 |   await press(page, 'Alt+ArrowUp')
  148 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  149 | })
  150 | 
  151 | test("perso panel (depuis ListerEvent) : ⌥↓ rafraîchit l'état coché des persos", async ({ page }) => {
  152 |   // with-brins-and-persos : e1 a perso_ids=["c1"] → c1 coché ; e2 a [] → rien
  153 |   installFixtures('with-brins-and-persos')
  154 |   await goToListerEvent(page)
  155 |   await press(page, 'p')
  156 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  157 |   await press(page, 'Alt+ArrowDown')
  158 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  159 | })
  160 | 
  161 | 
```