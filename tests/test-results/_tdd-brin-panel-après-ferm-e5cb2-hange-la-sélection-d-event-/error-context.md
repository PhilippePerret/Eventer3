# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-panel.spec.js >> après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)
- Location: specs/e2e/_tdd/brin-panel.spec.js:50:1

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.press: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item.selected')

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e2]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: "---"
          - generic [ref=f1e11]: roman
      - generic [ref=f1e14]:
        - generic [ref=f1e17]:
          - generic [ref=f1e18]: Événement 1
          - generic [ref=f1e19]:
            - generic [ref=f1e20]: —
            - generic [ref=f1e21]: "---"
            - generic [ref=f1e22]: "---"
          - generic [ref=f1e26]: AUT
        - generic [ref=f1e29]:
          - generic [ref=f1e30]: Événement 2
          - generic [ref=f1e31]:
            - generic [ref=f1e32]: —
            - generic [ref=f1e33]: "---"
            - generic [ref=f1e34]: "---"
    - contentinfo "Raccourcis clavier" [ref=f1e35]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/brin/brins-panel.spec.js
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
  13  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  15  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  16  | }
  17  | 
  18  | async function openBrinPanel(page) {
  19  |   await goToListerEvent(page)
  20  |   await pane1(page).locator('.event-item.selected').press('b')
  21  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  22  | }
  23  | 
  24  | // --- Ouverture / fermeture ---
  25  | 
  26  | test("b ouvre le panneau des brins", async ({ page }) => {
  27  |   await goToListerEvent(page)
  28  |   await pane1(page).locator('.event-item.selected').press('b')
  29  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  30  | })
  31  | 
  32  | test("l'ListerEvent reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  33  |   await openBrinPanel(page)
  34  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  35  | })
  36  | 
  37  | 
  38  | test("b ferme le panneau des brins quand il est actif", async ({ page }) => {
  39  |   await openBrinPanel(page)
  40  |   await pane1(page).locator('.brin-item.selected').press('b')
  41  |   await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
  42  | })
  43  | 
  44  | test("Cmd+Enter ferme le panneau", async ({ page }) => {
  45  |   await openBrinPanel(page)
  46  |   await pane1(page).locator('.brin-item.selected').press('Meta+Enter')
  47  |   await expect(pane1(page).locator('#brins-panel')).not.toBeVisible()
  48  | })
  49  | 
  50  | test("après fermeture, l'ListerEvent redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  51  |   await openBrinPanel(page)
  52  |   await pane1(page).locator('.brin-item.selected').press('b')
  53  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
> 54  |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
      |                                                    ^ Error: locator.press: Test timeout of 15000ms exceeded.
  55  |   await expect(pane1(page).locator('.event-item').nth(1)).toHaveClass(/selected/)
  56  | })
  57  | 
  58  | // --- Affichage ---
  59  | 
  60  | test("le panneau affiche tous les brins existants", async ({ page }) => {
  61  |   await openBrinPanel(page)
  62  |   await expect(pane1(page).locator('.brin-item')).toHaveCount(2)
  63  |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-title')).toHaveText('Mon brin')
  64  |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-title')).toHaveText('Autre brin')
  65  | })
  66  | 
  67  | test("les badges sont affichés", async ({ page }) => {
  68  |   await openBrinPanel(page)
  69  |   await expect(pane1(page).locator('.brin-item').nth(0).locator('.brin-badge')).toHaveText('MON')
  70  |   await expect(pane1(page).locator('.brin-item').nth(1).locator('.brin-badge')).toHaveText('AUT')
  71  | })
  72  | 
  73  | test("les brins cochés (ch:true) ont la classe checked", async ({ page }) => {
  74  |   await openBrinPanel(page)
  75  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  76  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  77  | })
  78  | 
  79  | test("seuls les brins de l'event sélectionné sont cochés à l'ouverture", async ({ page }) => {
  80  |   // e1 sélectionné : seul b2 coché (e1 a bi=["b2"])
  81  |   await goToListerEvent(page)
  82  |   await pane1(page).locator('.event-item.selected').press('b')
  83  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  84  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  85  |   await pane1(page).locator('.brin-item.selected').press('b')
  86  |   // e2 sélectionné : aucun brin coché (e2 n'a pas de bi)
  87  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  88  |   await pane1(page).locator('.event-item.selected').press('b')
  89  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  90  |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  91  |   await pane1(page).locator('.brin-item.selected').press('b')
  92  |   // retour à e1 : b2 doit de nouveau être coché (pas de stale state)
  93  |   await pane1(page).locator('.event-item.selected').press('ArrowUp')
  94  |   await pane1(page).locator('.event-item.selected').press('b')
  95  |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  96  |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  97  | })
  98  | 
  99  | test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  100 |   await openBrinPanel(page)
  101 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  102 | })
  103 | 
  104 | // --- Navigation ---
  105 | 
  106 | test("↓ sélectionne le brin suivant", async ({ page }) => {
  107 |   await openBrinPanel(page)
  108 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  109 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/selected/)
  110 | })
  111 | 
  112 | test("↑ sélectionne le brin précédent", async ({ page }) => {
  113 |   await openBrinPanel(page)
  114 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  115 |   await pane1(page).locator('.brin-item.selected').press('ArrowUp')
  116 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/selected/)
  117 | })
  118 | 
  119 | test("↓↑ dans le panneau ne modifient pas la sélection de l'ListerEvent", async ({ page }) => {
  120 |   await openBrinPanel(page)
  121 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  122 |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  123 | })
  124 | 
  125 | // --- Space (cocher / décocher) ---
  126 | 
  127 | test("Space coche un brin non-coché", async ({ page }) => {
  128 |   await openBrinPanel(page)
  129 |   await expect(pane1(page).locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  130 |   await pane1(page).locator('.brin-item.selected').press(' ')
  131 |   await expect(pane1(page).locator('.brin-item').nth(0)).toHaveClass(/checked/)
  132 | })
  133 | 
  134 | test("Space décoche un brin déjà coché", async ({ page }) => {
  135 |   await openBrinPanel(page)
  136 |   await pane1(page).locator('.brin-item.selected').press('ArrowDown')
  137 |   await expect(pane1(page).locator('.brin-item').nth(1)).toHaveClass(/checked/)
  138 |   await pane1(page).locator('.brin-item.selected').press(' ')
  139 |   await expect(pane1(page).locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  140 | })
  141 | 
  142 | // --- Création ---
  143 | 
  144 | test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  145 |   await openBrinPanel(page)
  146 |   await pane1(page).locator('.brin-item.selected').press('n')
  147 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
  148 |   await expect(titleInput).toBeFocused()
  149 | })
  150 | 
  151 | test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  152 |   await openBrinPanel(page)
  153 |   await pane1(page).locator('.brin-item.selected').press('n')
  154 |   const titleInput = pane1(page).locator('.brin-item.selected [data-field="title"]')
```