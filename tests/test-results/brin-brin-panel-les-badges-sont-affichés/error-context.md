# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brin-panel.spec.js >> les badges sont affichés
- Location: specs/e2e/brin/brin-panel.spec.js:65:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.brin-item').first().locator('.brin-item__badge')
Expected: "MON"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('.brin-item').first().locator('.brin-item__badge')

```

```yaml
- main:
  - navigation:
    - button "Projet A"
    - text: ‹
  - text: Évènement un Évènement deux
- contentinfo "Raccourcis clavier"
- text: Brins · Évènement un Fermer · Cmd+Enter MON Mon brin ✓ AUT Autre brin
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('with-brins')
  6   | })
  7   | 
  8   | // fixture with-brins : project-a (hl:true), events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché)
  9   | 
  10  | async function goToEventLister(page) {
  11  |   await page.goto('/')
  12  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  13  |   await page.keyboard.press('ArrowRight')
  14  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  15  | }
  16  | 
  17  | async function openBrinPanel(page) {
  18  |   await goToEventLister(page)
  19  |   await page.keyboard.press('b')
  20  |   await expect(page.locator('#brin-panel')).toBeVisible()
  21  | }
  22  | 
  23  | // --- Ouverture / fermeture ---
  24  | 
  25  | test("b ouvre le panneau des brins", async ({ page }) => {
  26  |   await goToEventLister(page)
  27  |   await page.keyboard.press('b')
  28  |   await expect(page.locator('#brin-panel')).toBeVisible()
  29  | })
  30  | 
  31  | test("l'EventLister reste visible en fond pendant que le panneau est ouvert", async ({ page }) => {
  32  |   await openBrinPanel(page)
  33  |   await expect(page.locator('#main-panel')).toBeVisible()
  34  | })
  35  | 
  36  | test("Escape ferme le panneau", async ({ page }) => {
  37  |   await openBrinPanel(page)
  38  |   await page.keyboard.press('Escape')
  39  |   await expect(page.locator('#brin-panel')).not.toBeVisible()
  40  | })
  41  | 
  42  | test("Cmd+Enter ferme le panneau", async ({ page }) => {
  43  |   await openBrinPanel(page)
  44  |   await page.keyboard.press('Meta+Enter')
  45  |   await expect(page.locator('#brin-panel')).not.toBeVisible()
  46  | })
  47  | 
  48  | test("après fermeture, l'EventLister redevient actif (↓ change la sélection d'event)", async ({ page }) => {
  49  |   await openBrinPanel(page)
  50  |   await page.keyboard.press('Escape')
  51  |   await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  52  |   await page.keyboard.press('ArrowDown')
  53  |   await expect(page.locator('.event-item').nth(1)).toHaveClass(/selected/)
  54  | })
  55  | 
  56  | // --- Affichage ---
  57  | 
  58  | test("le panneau affiche tous les brins existants", async ({ page }) => {
  59  |   await openBrinPanel(page)
  60  |   await expect(page.locator('.brin-item')).toHaveCount(2)
  61  |   await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Mon brin')
  62  |   await expect(page.locator('.brin-item').nth(1).locator('.brin-item__title')).toHaveText('Autre brin')
  63  | })
  64  | 
  65  | test("les badges sont affichés", async ({ page }) => {
  66  |   await openBrinPanel(page)
> 67  |   await expect(page.locator('.brin-item').nth(0).locator('.brin-item__badge')).toHaveText('MON')
      |                                                                                ^ Error: expect(locator).toHaveText(expected) failed
  68  |   await expect(page.locator('.brin-item').nth(1).locator('.brin-item__badge')).toHaveText('AUT')
  69  | })
  70  | 
  71  | test("les brins cochés (ch:true) ont la classe checked", async ({ page }) => {
  72  |   await openBrinPanel(page)
  73  |   await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  74  |   await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
  75  | })
  76  | 
  77  | test("le premier brin est sélectionné à l'ouverture", async ({ page }) => {
  78  |   await openBrinPanel(page)
  79  |   await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
  80  | })
  81  | 
  82  | // --- Navigation ---
  83  | 
  84  | test("↓ sélectionne le brin suivant", async ({ page }) => {
  85  |   await openBrinPanel(page)
  86  |   await page.keyboard.press('ArrowDown')
  87  |   await expect(page.locator('.brin-item').nth(1)).toHaveClass(/selected/)
  88  | })
  89  | 
  90  | test("↑ sélectionne le brin précédent", async ({ page }) => {
  91  |   await openBrinPanel(page)
  92  |   await page.keyboard.press('ArrowDown')
  93  |   await page.keyboard.press('ArrowUp')
  94  |   await expect(page.locator('.brin-item').nth(0)).toHaveClass(/selected/)
  95  | })
  96  | 
  97  | test("↓↑ dans le panneau ne modifient pas la sélection de l'EventLister", async ({ page }) => {
  98  |   await openBrinPanel(page)
  99  |   await page.keyboard.press('ArrowDown')
  100 |   await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  101 | })
  102 | 
  103 | // --- Space (cocher / décocher) ---
  104 | 
  105 | test("Space coche un brin non-coché", async ({ page }) => {
  106 |   await openBrinPanel(page)
  107 |   await expect(page.locator('.brin-item').nth(0)).not.toHaveClass(/checked/)
  108 |   await page.keyboard.press(' ')
  109 |   await expect(page.locator('.brin-item').nth(0)).toHaveClass(/checked/)
  110 | })
  111 | 
  112 | test("Space décoche un brin déjà coché", async ({ page }) => {
  113 |   await openBrinPanel(page)
  114 |   await page.keyboard.press('ArrowDown')
  115 |   await expect(page.locator('.brin-item').nth(1)).toHaveClass(/checked/)
  116 |   await page.keyboard.press(' ')
  117 |   await expect(page.locator('.brin-item').nth(1)).not.toHaveClass(/checked/)
  118 | })
  119 | 
  120 | // --- Création ---
  121 | 
  122 | test("n ouvre l'éditeur pour un nouveau brin (input title focalisé)", async ({ page }) => {
  123 |   await openBrinPanel(page)
  124 |   await page.keyboard.press('n')
  125 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  126 |   await expect(titleInput).toBeFocused()
  127 | })
  128 | 
  129 | test("créer un brin : Enter valide et l'ajoute à la liste", async ({ page }) => {
  130 |   await openBrinPanel(page)
  131 |   await page.keyboard.press('n')
  132 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  133 |   await titleInput.fill('Nouveau brin')
  134 |   await page.keyboard.press('Enter')
  135 |   await expect(page.locator('.brin-item')).toHaveCount(3)
  136 |   await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Nouveau brin')
  137 | })
  138 | 
  139 | test("créer un brin : Escape annule, liste inchangée", async ({ page }) => {
  140 |   await openBrinPanel(page)
  141 |   await page.keyboard.press('n')
  142 |   await page.keyboard.press('Escape')
  143 |   await expect(page.locator('.brin-item')).toHaveCount(2)
  144 | })
  145 | 
  146 | // --- Édition ---
  147 | 
  148 | test("Enter édite le brin sélectionné (input title focalisé avec valeur courante)", async ({ page }) => {
  149 |   await openBrinPanel(page)
  150 |   await page.keyboard.press('Enter')
  151 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  152 |   await expect(titleInput).toBeFocused()
  153 |   await expect(titleInput).toHaveValue('Mon brin')
  154 | })
  155 | 
  156 | test("édition : modifier le titre puis Enter met à jour l'affichage", async ({ page }) => {
  157 |   await openBrinPanel(page)
  158 |   await page.keyboard.press('Enter')
  159 |   const titleInput = page.locator('.brin-item.selected input[name="title"]')
  160 |   await titleInput.fill('Brin renommé')
  161 |   await page.keyboard.press('Enter')
  162 |   await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Brin renommé')
  163 | })
  164 | 
  165 | test("édition : Escape restaure le titre original", async ({ page }) => {
  166 |   await openBrinPanel(page)
  167 |   await page.keyboard.press('Enter')
```