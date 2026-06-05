# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: perso/perso-panel.spec.js >> le perso sélectionné a un fond coloré visible (pas transparent)
- Location: specs/e2e/perso/perso-panel.spec.js:63:1

# Error details

```
Error: expect(locator).toHaveCSS(expected) failed

Locator:  locator('.perso-item').first()
Expected: "rgb(77, 158, 254)"
Received: "rgba(0, 0, 0, 0.06)"
Timeout:  5000ms

Call log:
  - Expect "toHaveCSS" with timeout 5000ms
  - waiting for locator('.perso-item').first()
    14 × locator resolved to <div class="panel-row perso-row perso-item checked selected">…</div>
       - unexpected value "rgba(0, 0, 0, 0.06)"

```

```yaml
- text: ✓ CY Cyrano de Bergerac — protagoniste
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('with-persos')
  6   | })
  7   | 
  8   | // Fixture with-persos :
  9   | //   project-a, events e1/e2, brin b1 (MON, perso_ids=[c2])
  10  | //   c1 Cyrano  (CY, direct sur e1,       sans avatar)
  11  | //   c2 Roxane  (RO, sur brin b1,          sans avatar) → hérité par e1
  12  | //   c3 Christian (CH, non assigné,        avatar 🎭)
  13  | //   c4 Valvert   (VA, non assigné,        avatar 👑)
  14  | 
  15  | async function goToEventLister(page) {
  16  |   await page.goto('/')
  17  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  18  |   await page.keyboard.press('ArrowRight')
  19  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  20  | }
  21  | 
  22  | async function openPersoPanel(page) {
  23  |   await goToEventLister(page)
  24  |   await page.keyboard.press('p')
  25  |   await expect(page.locator('#perso-panel')).toBeVisible()
  26  | }
  27  | 
  28  | // ─── Ouverture / fermeture ───────────────────────────────────────────────────
  29  | 
  30  | test("p ouvre le panneau des personnages depuis EventLister", async ({ page }) => {
  31  |   await goToEventLister(page)
  32  |   await page.keyboard.press('p')
  33  |   await expect(page.locator('#perso-panel')).toBeVisible()
  34  | })
  35  | 
  36  | test("l'EventLister reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  37  |   await openPersoPanel(page)
  38  |   await expect(page.locator('#main-panel')).toBeVisible()
  39  | })
  40  | 
  41  | test("Escape ferme le panneau perso", async ({ page }) => {
  42  |   await openPersoPanel(page)
  43  |   await page.keyboard.press('Escape')
  44  |   await expect(page.locator('#perso-panel')).not.toBeVisible()
  45  | })
  46  | 
  47  | test("Cmd+Enter ferme le panneau perso", async ({ page }) => {
  48  |   await openPersoPanel(page)
  49  |   await page.keyboard.press('Meta+Enter')
  50  |   await expect(page.locator('#perso-panel')).not.toBeVisible()
  51  | })
  52  | 
  53  | test("après fermeture, l'EventLister redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  54  |   await openPersoPanel(page)
  55  |   await page.keyboard.press('Escape')
  56  |   await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  57  |   await page.keyboard.press('ArrowDown')
  58  |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
  59  | })
  60  | 
  61  | // ─── Sélection visuelle ──────────────────────────────────────────────────────
  62  | 
  63  | test("le perso sélectionné a un fond coloré visible (pas transparent)", async ({ page }) => {
  64  |   await openPersoPanel(page)
  65  |   await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
> 66  |   await expect(page.locator('.perso-item').nth(0)).toHaveCSS('background-color', 'rgb(77, 158, 254)')
      |                                                    ^ Error: expect(locator).toHaveCSS(expected) failed
  67  | })
  68  | 
  69  | // ─── Affichage ───────────────────────────────────────────────────────────────
  70  | 
  71  | test("le panneau affiche tous les personnages du projet", async ({ page }) => {
  72  |   await openPersoPanel(page)
  73  |   await expect(page.locator('.perso-item')).toHaveCount(4)
  74  | })
  75  | 
  76  | test("les pseudos sont affichés", async ({ page }) => {
  77  |   await openPersoPanel(page)
  78  |   await expect(page.locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano')
  79  |   await expect(page.locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Roxane')
  80  | })
  81  | 
  82  | test("les badges sont affichés (2 lettres)", async ({ page }) => {
  83  |   await openPersoPanel(page)
  84  |   await expect(page.locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
  85  |   await expect(page.locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('RO')
  86  | })
  87  | 
  88  | test("le premier perso est sélectionné à l'ouverture", async ({ page }) => {
  89  |   await openPersoPanel(page)
  90  |   await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
  91  | })
  92  | 
  93  | // ─── Cochés : direct vs hérité ───────────────────────────────────────────────
  94  | 
  95  | test("c1 (direct e1) est coché et décochable", async ({ page }) => {
  96  |   await openPersoPanel(page)
  97  |   await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  98  |   await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/inherited/)
  99  | })
  100 | 
  101 | test("c2 (via brin b1) est coché et grisé (hérité)", async ({ page }) => {
  102 |   await openPersoPanel(page)
  103 |   await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/)
  104 |   await expect(page.locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  105 | })
  106 | 
  107 | test("c3 et c4 ne sont pas cochés", async ({ page }) => {
  108 |   await openPersoPanel(page)
  109 |   await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  110 |   await expect(page.locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
  111 | })
  112 | 
  113 | test("Space ne décroche pas un perso hérité (grisé)", async ({ page }) => {
  114 |   await openPersoPanel(page)
  115 |   await page.keyboard.press('ArrowDown') // → c2 (inherited)
  116 |   await expect(page.locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  117 |   await page.keyboard.press(' ')
  118 |   await expect(page.locator('.perso-item').nth(1)).toHaveClass(/checked/) // toujours coché
  119 | })
  120 | 
  121 | test("e2 (sans brins ni persos directs) : aucun perso coché", async ({ page }) => {
  122 |   await goToEventLister(page)
  123 |   await page.keyboard.press('ArrowDown') // e2
  124 |   await page.keyboard.press('p')
  125 |   await expect(page.locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  126 |   await expect(page.locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  127 |   await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  128 |   await expect(page.locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
  129 | })
  130 | 
  131 | // ─── Navigation ──────────────────────────────────────────────────────────────
  132 | 
  133 | test("↓ sélectionne le perso suivant", async ({ page }) => {
  134 |   await openPersoPanel(page)
  135 |   await page.keyboard.press('ArrowDown')
  136 |   await expect(page.locator('.perso-item').nth(1)).toHaveClass(/selected/)
  137 | })
  138 | 
  139 | test("↑ sélectionne le perso précédent", async ({ page }) => {
  140 |   await openPersoPanel(page)
  141 |   await page.keyboard.press('ArrowDown')
  142 |   await page.keyboard.press('ArrowUp')
  143 |   await expect(page.locator('.perso-item').nth(0)).toHaveClass(/selected/)
  144 | })
  145 | 
  146 | test("↓↑ dans le panneau ne modifient pas la sélection de l'EventLister", async ({ page }) => {
  147 |   await openPersoPanel(page)
  148 |   await page.keyboard.press('ArrowDown')
  149 |   await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  150 | })
  151 | 
  152 | // ─── Space (cocher/décocher perso direct) ────────────────────────────────────
  153 | 
  154 | test("Space coche un perso non-coché (c3)", async ({ page }) => {
  155 |   await openPersoPanel(page)
  156 |   await page.keyboard.press('ArrowDown')
  157 |   await page.keyboard.press('ArrowDown') // → c3
  158 |   await expect(page.locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  159 |   await page.keyboard.press(' ')
  160 |   await expect(page.locator('.perso-item').nth(2)).toHaveClass(/checked/)
  161 | })
  162 | 
  163 | test("Space décoche un perso direct coché (c1)", async ({ page }) => {
  164 |   await openPersoPanel(page)
  165 |   await expect(page.locator('.perso-item').nth(0)).toHaveClass(/checked/)
  166 |   await page.keyboard.press(' ')
```