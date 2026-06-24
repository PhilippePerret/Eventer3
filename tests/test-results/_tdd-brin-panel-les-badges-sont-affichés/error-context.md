# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-panel.spec.js >> les badges sont affichés
- Location: specs/e2e/_tdd/brin-panel.spec.js:72:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item').first().locator('.brin-item__badge')
Expected: "MON"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item').first().locator('.brin-item__badge')

```

```yaml
- main: Événement 1 — --- --- AUT Événement 2 — --- ---
- contentinfo "Raccourcis clavier"
- text: "AIDE ⇧⌘ ? Mon brin #888888 MON brin ✓ Autre brin #888888 AUT brin"
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/brin/brin-panel.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures'
  3   | import { test, expect, pane1 } from '../__setup__.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('with-brins')
  7   | })
  8   | 
  9   | // fixture with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
  10  | 
  11  | async function goToListerEvent(page) {
  12  |   await page.goto('/')
  13  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  15  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  16  | }
  17  | 
  18  | async function openBrinPanel(page) {
  19  |   await goToListerEvent(page)
  20  |   await pane1(page).locator('#main-panel').press('b')
  21  |   await expect(pane1(page).locator('#brin-panel')).toBeVisible()
  22  | }
  23  | 
  24  | // --- Ouverture / fermeture ---
  25  | 
  26  | test("b ouvre le panneau des brins", async ({ page }) => {
  27  |   await goToListerEvent(page)
  28  |   await pane1(page).locator('#main-panel').press('b')
  29  |   await expect(pane1(page).locator('#brin-panel')).toBeVisible()
  30  | })
  31  | 
  32  | test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  33  |   await openBrinPanel(page)
  34  |   await expect(pane1(page).locator('#main-panel')).toBeVisible()
  35  | })
  36  | 
  37  | test("Escape ferme le panneau", async ({ page }) => {
  38  |   await openBrinPanel(page)
  39  |   await pane1(page).locator('#main-panel').press('Escape')
  40  |   await expect(pane1(page).locator('#brin-panel')).not.toBeVisible()
  41  | })
  42  | 
  43  | test("b ferme le panneau des brins quand il est actif", async ({ page }) => {
  44  |   await openBrinPanel(page)
  45  |   await pane1(page).locator('#main-panel').press('b')
  46  |   await expect(pane1(page).locator('#brin-panel')).not.toBeVisible()
  47  | })
  48  | 
  49  | test("Cmd+Enter ferme le panneau", async ({ page }) => {
  50  |   await openBrinPanel(page)
  51  |   await pane1(page).locator('#main-panel').press('Meta+Enter')
  52  |   await expect(pane1(page).locator('#brin-panel')).not.toBeVisible()
  53  | })
  54  | 
  55  | test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  56  |   await openBrinPanel(page)
  57  |   await pane1(page).locator('#main-panel').press('Escape')
  58  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  59  |   await pane1(page).locator('#main-panel').press('ArrowDown')
  60  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  61  | })
  62  | 
  63  | // --- Affichage ---
  64  | 
  65  | test("le panneau affiche tous les brins existants", async ({ page }) => {
  66  |   await openBrinPanel(page)
  67  |   await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  68  |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Mon brin')
  69  |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Autre brin')
  70  | })
  71  | 
  72  | test("les badges sont affichés", async ({ page }) => {
  73  |   await openBrinPanel(page)
> 74  |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-item__badge')).toHaveText('MON')
      |                                                                                       ^ Error: expect(locator).toHaveText(expected) failed
  75  |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-item__badge')).toHaveText('AUT')
  76  | })
  77  | 
  78  | test("les brins cochés (ch:true) ont la classe checked", async ({ page }) => {
  79  |   await openBrinPanel(page)
  80  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  81  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  82  | })
  83  | 
  84  | test("seuls les brins de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  85  |   // e1 sélectionné : seul b2 coché (e1 a bi=["b2"])
  86  |   await goToListerEvent(page)
  87  |   await pane1(page).locator('#main-panel').press('b')
  88  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  89  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  90  |   await pane1(page).locator('#main-panel').press('Escape')
  91  |   // e2 sélectionné : aucun brin coché (e2 n'a pas de bi)
  92  |   await pane1(page).locator('#main-panel').press('ArrowDown')
  93  |   await pane1(page).locator('#main-panel').press('b')
  94  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  95  |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  96  |   await pane1(page).locator('#main-panel').press('Escape')
  97  |   // retour à e1 : b2 doit de nouveau être coché (pas de stale state)
  98  |   await pane1(page).locator('#main-panel').press('ArrowUp')
  99  |   await pane1(page).locator('#main-panel').press('b')
  100 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  101 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  102 | })
  103 | 
  104 | test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  105 |   await openBrinPanel(page)
  106 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  107 | })
  108 | 
  109 | // --- Navigation ---
  110 | 
  111 | test("↓ sélectionne le brin suivant", async ({ page }) => {
  112 |   await openBrinPanel(page)
  113 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  114 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  115 | })
  116 | 
  117 | test("↑ sélectionne le brin précédent", async ({ page }) => {
  118 |   await openBrinPanel(page)
  119 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  120 |   await pane1(page).locator('#main-panel').press('ArrowUp')
  121 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  122 | })
  123 | 
  124 | test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  125 |   await openBrinPanel(page)
  126 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  127 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  128 | })
  129 | 
  130 | // --- Space (cocher / décocher) ---
  131 | 
  132 | test("Space coche un brin non-coché", async ({ page }) => {
  133 |   await openBrinPanel(page)
  134 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  135 |   await pane1(page).locator('#main-panel').press(' ')
  136 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  137 | })
  138 | 
  139 | test("Space décoche un brin déjà coché", async ({ page }) => {
  140 |   await openBrinPanel(page)
  141 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  142 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  143 |   await pane1(page).locator('#main-panel').press(' ')
  144 |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  145 | })
  146 | 
  147 | // --- Création ---
  148 | 
  149 | test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  150 |   await openBrinPanel(page)
  151 |   await pane1(page).locator('#main-panel').press('n')
  152 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  153 |   await expect(titleInput).toBeFocused()
  154 | })
  155 | 
  156 | test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  157 |   await openBrinPanel(page)
  158 |   await pane1(page).locator('#main-panel').press('n')
  159 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  160 |   await titleInput.fill('Nouveau brin')
  161 |   await pane1(page).locator('#main-panel').press('Enter')
  162 |   await expect(pane1(page).locator('.brin-item')).toHaveCount(3)
  163 |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Nouveau brin')
  164 | })
  165 | 
  166 | test("créer un brin : Escape annule, liste inchangée", async ({ page }) => {
  167 |   await openBrinPanel(page)
  168 |   await pane1(page).locator('#main-panel').press('n')
  169 |   await pane1(page).locator('#main-panel').press('Escape')
  170 |   await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  171 | })
  172 | 
  173 | // --- Édition ---
  174 | 
```