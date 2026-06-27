# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/perso-panel.spec.js >> le perso sélectionné a un fond coloré visible (pas transparent)
- Location: specs/e2e/_tdd/perso-panel.spec.js:70:1

# Error details

```
Error: expect(locator).toHaveCSS(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.perso-item').first()
Expected: "rgb(77, 158, 254)"
Received: "rgba(0, 0, 0, 0)"
Timeout:  5000ms

Call log:
  - Expect "toHaveCSS" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item').first()
    14 × locator resolved to <div data-id="c1" tabindex="-1" class="perso-item selected">…</div>
       - unexpected value "rgba(0, 0, 0, 0)"

```

```yaml
- text: Cyrano de Bergerac --- CY ---
```

# Test source

```ts
  1   | // Origine: tests/specs/e2e/perso/perso-panel.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures'
  3   | import { test, expect, pane1, getErr } from '../__setup__.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('with-persos')
  7   | })
  8   | 
  9   | // Fixture with-persos :
  10  | //   project-a, events e1/e2, brin b1 (MON, perso_ids=[c2])
  11  | //   c1 Cyrano  (CY, direct sur e1,       sans avatar)
  12  | //   c2 Roxane  (RO, sur brin b1,          sans avatar) → hérité par e1
  13  | //   c3 Christian (CH, non assigné,        avatar 🎭)
  14  | //   c4 Valvert   (VA, non assigné,        avatar 👑)
  15  | 
  16  | async function goToListerEvent(page) {
  17  |   await page.goto('/')
  18  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  19  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  20  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  21  | }
  22  | 
  23  | async function openPersoPanel(page) {
  24  |   await goToListerEvent(page)
  25  |   await pane1(page).locator('.event-item.selected').press('p')
  26  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  27  | }
  28  | 
  29  | // ─── Ouverture / fermeture ───────────────────────────────────────────────────
  30  | 
  31  | test("p ouvre le panneau des personnages depuis ListerEvent", async ({ page }) => {
  32  |   await goToListerEvent(page)
  33  |   await pane1(page).locator('.event-item.selected').press('p')
  34  |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
  35  | })
  36  | 
  37  | test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  38  |   await openPersoPanel(page)
  39  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  40  | })
  41  | 
  42  | test("Escape ferme le panneau perso", async ({ page }) => {
  43  |   await openPersoPanel(page)
  44  |   await pane1(page).locator('.event-item.selected').press('Escape')
  45  |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  46  | })
  47  | 
  48  | test("p ferme le panneau des persos quand il est actif", async ({ page }) => {
  49  |   await openPersoPanel(page)
  50  |   await pane1(page).locator('.event-item.selected').press('p')
  51  |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  52  | })
  53  | 
  54  | test("Cmd+Enter ferme le panneau perso", async ({ page }) => {
  55  |   await openPersoPanel(page)
  56  |   await pane1(page).locator('.event-item.selected').press('Meta+Enter')
  57  |   await expect(pane1(page).locator('#persos-panel')).not.toBeVisible()
  58  | })
  59  | 
  60  | test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  61  |   await openPersoPanel(page)
  62  |   await pane1(page).locator('.event-item.selected').press('Escape')
  63  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  64  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  65  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  66  | })
  67  | 
  68  | // ─── Sélection visuelle ──────────────────────────────────────────────────────
  69  | 
  70  | test("le perso sélectionné a un fond coloré visible (pas transparent)", async ({ page }) => {
  71  |   await openPersoPanel(page)
  72  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
> 73  |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveCSS('background-color', 'rgb(77, 158, 254)')
      |                                                           ^ Error: expect(locator).toHaveCSS(expected) failed
  74  | })
  75  | 
  76  | test("la coche d'un perso coché sélectionné est blanche (pas verte)", async ({ page }) => {
  77  |   await openPersoPanel(page)
  78  |   // c1 est sélectionné (index 0) ET coché (direct sur e1)
  79  |   const c1 = pane1(page).locator('.perso-item').nth(0)
  80  |   await expect(c1).toHaveClass(/selected/)
  81  |   await expect(c1).toHaveClass(/checked/)
  82  |   // Comme pour tous les items sélectionnés, la coche est blanche
  83  |   await expect(c1.locator('.panel-check')).toHaveCSS('color', 'rgb(255, 255, 255)')
  84  | })
  85  | 
  86  | // ─── Affichage ───────────────────────────────────────────────────────────────
  87  | 
  88  | test("le panneau affiche tous les personnages du projet", async ({ page }) => {
  89  |   await openPersoPanel(page)
  90  |   await expect(pane1(page).locator('.perso-item')).toHaveCount(4)
  91  | })
  92  | 
  93  | test("les pseudos sont affichés", async ({ page }) => {
  94  |   await openPersoPanel(page)
  95  |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__title')).toHaveText('Cyrano')
  96  |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__title')).toHaveText('Roxane')
  97  | })
  98  | 
  99  | test("les badges sont affichés (2 lettres)", async ({ page }) => {
  100 |   await openPersoPanel(page)
  101 |   await expect(pane1(page).locator('.perso-item').nth(0).locator('.perso-item__badge')).toHaveText('CY')
  102 |   await expect(pane1(page).locator('.perso-item').nth(1).locator('.perso-item__badge')).toHaveText('RO')
  103 | })
  104 | 
  105 | test("le premier perso est sélectionné à l'ouverture", async ({ page }) => {
  106 |   await openPersoPanel(page)
  107 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  108 | })
  109 | 
  110 | // ─── Cochés : direct vs hérité ───────────────────────────────────────────────
  111 | 
  112 | test("c1 (direct e1) est coché et décochable", async ({ page }) => {
  113 |   await openPersoPanel(page)
  114 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/checked/)
  115 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/inherited/)
  116 | })
  117 | 
  118 | test("c2 (via brin b1) est coché et grisé (hérité)", async ({ page }) => {
  119 |   await openPersoPanel(page)
  120 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/)
  121 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  122 | })
  123 | 
  124 | test("c3 et c4 ne sont pas cochés", async ({ page }) => {
  125 |   await openPersoPanel(page)
  126 |   await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  127 |   await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
  128 | })
  129 | 
  130 | test("Space ne décroche pas un perso hérité (grisé)", async ({ page }) => {
  131 |   await openPersoPanel(page)
  132 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // → c2 (inherited)
  133 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/inherited/)
  134 |   await pane1(page).locator('.event-item.selected').press(' ')
  135 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/checked/) // toujours coché
  136 | })
  137 | 
  138 | test("e2 (sans brins ni persos directs) : aucun perso coché", async ({ page }) => {
  139 |   await goToListerEvent(page)
  140 |   await pane1(page).locator('.event-item.selected').press('ArrowDown') // e2
  141 |   await pane1(page).locator('.event-item.selected').press('p')
  142 |   await expect(pane1(page).locator('.perso-item').nth(0)).not.toHaveClass(/checked/)
  143 |   await expect(pane1(page).locator('.perso-item').nth(1)).not.toHaveClass(/checked/)
  144 |   await expect(pane1(page).locator('.perso-item').nth(2)).not.toHaveClass(/checked/)
  145 |   await expect(pane1(page).locator('.perso-item').nth(3)).not.toHaveClass(/checked/)
  146 | })
  147 | 
  148 | // ─── Navigation ──────────────────────────────────────────────────────────────
  149 | 
  150 | test("↓ sélectionne le perso suivant", async ({ page }) => {
  151 |   await openPersoPanel(page)
  152 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  153 |   await expect(pane1(page).locator('.perso-item').nth(1)).toHaveClass(/selected/)
  154 | })
  155 | 
  156 | test("↑ sélectionne le perso précédent", async ({ page }) => {
  157 |   await openPersoPanel(page)
  158 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  159 |   await pane1(page).locator('.event-item.selected').press('ArrowUp')
  160 |   await expect(pane1(page).locator('.perso-item').nth(0)).toHaveClass(/selected/)
  161 | })
  162 | 
  163 | test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  164 |   await openPersoPanel(page)
  165 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  166 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  167 | })
  168 | 
  169 | // ─── Space (cocher/décocher perso direct) ────────────────────────────────────
  170 | 
  171 | test("Space coche un perso non-coché (c3)", async ({ page }) => {
  172 |   await openPersoPanel(page)
  173 |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
```