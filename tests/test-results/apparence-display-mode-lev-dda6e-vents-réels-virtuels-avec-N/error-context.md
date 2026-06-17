# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparence/display-mode-level.spec.js >> mode LEVEL depth=3 : events réels + virtuels avec +N
- Location: specs/e2e/apparence/display-mode-level.spec.js:48:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#status-bar')
Expected substring: "DISP MODE LEVEL"
Received string:    "DISP MODE NESTING"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#status-bar')
    14 × locator resolved to <div id="status-bar">…</div>
       - unexpected value "DISP MODE NESTING"

```

```yaml
- text: DISP MODE NESTING
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1 } from '../__setup__.js'
  3   | 
  4   | // Fixture depth-move :
  5   | //   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
  6   | //   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
  7   | //   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
  8   | //   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]
  9   | 
  10  | test.beforeEach(() => {
  11  |   installFixtures('depth-move')
  12  | })
  13  | 
  14  | async function enterProject(page) {
  15  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  16  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  17  |   await page.keyboard.press('ArrowRight')
  18  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  19  | }
  20  | 
  21  | test("mode LEVEL depth=2 : liste plate de tous les events depth=2", async ({ page }) => {
  22  |   await page.goto('/')
  23  |   await enterProject(page)
  24  | 
  25  |   console.log('\n=== TEST LEVEL MODE — DEPTH=2 ===')
  26  | 
  27  |   console.log('-> entrée dans e14 (Acte 1) → depth=2')
  28  |   await page.keyboard.press('ArrowRight')
  29  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  30  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  31  | 
  32  |   console.log('-> ⌘+m : passage en LEVEL mode')
  33  |   await page.keyboard.press('Meta+m')
  34  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  35  | 
  36  |   console.log('-> 3 items affichés : e31, e45 (Liste#3) + e88 (Liste#5)')
  37  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  38  |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toBeVisible()
  39  |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).toBeVisible()
  40  |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toBeVisible()
  41  | 
  42  |   console.log('-> aucun item virtuel')
  43  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  44  | 
  45  |   console.log('\n=== FIN ===\n')
  46  | })
  47  | 
  48  | test("mode LEVEL depth=3 : events réels + virtuels avec +N", async ({ page }) => {
  49  |   await page.goto('/')
  50  |   await enterProject(page)
  51  | 
  52  |   console.log('\n=== TEST LEVEL MODE — DEPTH=3 ===')
  53  | 
  54  |   console.log('-> entrée dans e14 → depth=2, puis e31 → depth=3')
  55  |   await page.keyboard.press('ArrowRight')
  56  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  57  |   await page.keyboard.press('ArrowRight')
  58  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  59  | 
  60  |   console.log('-> ⌘+m : passage en LEVEL mode')
  61  |   await page.keyboard.press('Meta+m')
> 62  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  63  | 
  64  |   console.log('-> 4 items : e57, e68 (réels) + 2 virtuels (e45+1, e88+1)')
  65  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  66  |   await expect(pane1(page).locator('.event-item[data-id="e57"]')).toBeVisible()
  67  |   await expect(pane1(page).locator('.event-item[data-id="e68"]')).toBeVisible()
  68  | 
  69  |   console.log('-> 2 items virtuels avec texte "+1"')
  70  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  71  |   await expect(pane1(page).locator('.event-item.virtual').nth(0)).toContainText('+1')
  72  |   await expect(pane1(page).locator('.event-item.virtual').nth(1)).toContainText('+1')
  73  | 
  74  |   console.log('-> items virtuels contiennent le titre de l\'event de référence')
  75  |   await expect(pane1(page).locator('.event-item.virtual').nth(0)).toContainText('Séquence 2')
  76  |   await expect(pane1(page).locator('.event-item.virtual').nth(1)).toContainText('Séquence 3')
  77  | 
  78  |   console.log('\n=== FIN ===\n')
  79  | })
  80  | 
  81  | test("items virtuels non sélectionnables au clavier", async ({ page }) => {
  82  |   await page.goto('/')
  83  |   await enterProject(page)
  84  | 
  85  |   await page.keyboard.press('ArrowRight')
  86  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  87  |   await page.keyboard.press('ArrowRight')
  88  |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  89  |   await page.keyboard.press('Meta+m')
  90  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  91  | 
  92  |   console.log('-> LEVEL mode actif : 4 items dont 2 virtuels')
  93  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  94  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  95  | 
  96  |   console.log('-> ↓ navigue uniquement sur les items réels, saute les virtuels')
  97  |   await expect(pane1(page).locator('.event-item[data-id="e57"]')).toHaveClass(/selected/)
  98  |   await page.keyboard.press('ArrowDown')
  99  |   await expect(pane1(page).locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  100 |   await page.keyboard.press('ArrowDown')
  101 |   await expect(pane1(page).locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  102 | })
  103 | 
  104 | test("entrer dans un item en mode LEVEL rebascule en NESTING", async ({ page }) => {
  105 |   await page.goto('/')
  106 |   await enterProject(page)
  107 | 
  108 |   await page.keyboard.press('ArrowRight')
  109 |   await page.keyboard.press('Meta+m')
  110 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  111 | 
  112 |   console.log('-> ArrowRight sur e31 : entre dans Liste#4, rebascule NESTING')
  113 |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  114 |   await page.keyboard.press('ArrowRight')
  115 |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  116 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  117 | })
  118 | 
  119 | // ─── Bug 1 : LEVEL→NEST navigue vers l'item sélectionné ──────────────────────
  120 | 
  121 | test("LEVEL→NEST : retour dans le lister de l'item sélectionné (e88 sous Acte 2)", async ({ page }) => {
  122 |   await page.goto('/')
  123 |   await enterProject(page)
  124 |   await page.keyboard.press('ArrowRight')  // depth 2 (sous Acte 1)
  125 |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  126 | 
  127 |   await page.keyboard.press('Meta+m')  // LEVEL mode
  128 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  129 |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)  // attendre fin render async
  130 | 
  131 |   // Sélectionner e88 (3e item : e31, e45, e88)
  132 |   await page.keyboard.press('ArrowDown')
  133 |   await page.keyboard.press('ArrowDown')
  134 |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  135 | 
  136 |   await page.keyboard.press('Meta+m')  // retour NEST
  137 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  138 | 
  139 |   // Doit être dans le lister de Acte 2 (depth=2), e88 sélectionné
  140 |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  141 |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toHaveClass(/selected/)
  142 | })
  143 | 
  144 | // ─── Bug 2 : LEVEL mode sur lister "man" ─────────────────────────────────────
  145 | // Fixture man-level-mode : depth-move + man_depth=2, nature='roman' dans project_meta
  146 | // Lister 3 (depth=2, sous e14) et Lister 5 (depth=2, sous e23) deviennent "man" via man_depth
  147 | 
  148 | test("man lister depth=2 (=man_depth) → LEVEL mode affiche items des listers man (cas normal)", async ({ page }) => {
  149 |   installFixtures('man-level-mode')
  150 |   await page.goto('/')
  151 |   await enterProject(page)
  152 |   await page.keyboard.press('ArrowRight')  // depth 2 (man lister, man_depth=2)
  153 |   await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  154 | 
  155 |   await page.keyboard.press('Meta+m')
  156 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  157 | 
  158 |   // e31, e45 (Liste#3), e88 (Liste#5), e99 (feuille sans lister enfant)
  159 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  160 |   await expect(pane1(page).locator('.event-item[data-id="e31"]')).toBeVisible()
  161 |   await expect(pane1(page).locator('.event-item[data-id="e45"]')).toBeVisible()
  162 |   await expect(pane1(page).locator('.event-item[data-id="e88"]')).toBeVisible()
```