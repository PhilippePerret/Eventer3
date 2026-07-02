# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lister/lister-nature.spec.js >> panneau nature → contient 'Nature projet' et 'Nature évènemencier'
- Location: specs/e2e/lister/lister-nature.spec.js:71:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.nature-panel')
Expected substring: "Nature projet"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.nature-panel')

```

```yaml
- text: Événement 1 — AUT Événement 2 — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | import { MANUSCRIT_WIDTH } from '../../../../public/constants/constants.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('with-styles')
  7   | })
  8   | 
  9   | async function goToProjectList(page) {
  10  |   await page.goto('/')
  11  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  12  | }
  13  | 
  14  | async function goToListerEvent(page) {
  15  |   await page.goto('/')
  16  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  17  |   await press(page, 'ArrowRight')
  18  |   await press(page, 'ArrowRight')
  19  |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  20  | }
  21  | 
  22  | // Tab Tab Enter = activer le bouton "Appliquer" (dernier bouton footer)
  23  | async function applyNaturePanel(page) {
  24  |   await press(page, 'Tab')   // footer focus → Annuler
  25  |   await press(page, 'Tab')   // footer focus → Appliquer
  26  |   await press(page, 'Enter') // appliquer
  27  | }
  28  | 
  29  | // Ouvre le panneau, sélectionne roman+manuscrit, applique, refuse man_depth
  30  | async function setRomanMan(page) {
  31  |   await press(page, 't')
  32  |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  33  |   await press(page, 'Enter')                          // ouvre popup projet
  34  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  35  |   await press(page, 'ArrowUp')                        // film/BD
  36  |   await press(page, 'ArrowUp')                        // roman
  37  |   await press(page, 'Enter')                          // roman
  38  |   await press(page, 'ArrowDown')                      // champ évènemencier
  39  |   await press(page, 'Enter')                          // ouvre popup évènemencier
  40  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  41  |   await press(page, 'ArrowUp')                        // manuscrit
  42  |   await press(page, 'Enter')                          // manuscrit
  43  |   await applyNaturePanel(page)
  44  |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  45  |   await press(page, 'Escape')                         // refuser man_depth
  46  |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  47  | }
  48  | 
  49  | // ─── Structure du panneau ─────────────────────────────────────────────────────
  50  | 
  51  | test("'t' dans project list → popup projet nature (pas nature-panel)", async ({ page }) => {
  52  |   await goToProjectList(page)
  53  |   await press(page, 't')
  54  |   await expect(pane1(page).locator('.popup-select')).toBeVisible()
  55  |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  56  | })
  57  | 
  58  | test("'t' dans event lister → panneau .nature-panel s'ouvre", async ({ page }) => {
  59  |   await goToListerEvent(page)
  60  |   await press(page, 't')
  61  |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  62  |   await expect(pane1(page).locator('.popup-select')).not.toBeVisible()
  63  | })
  64  | 
  65  | test("panneau nature → titre mentionne le niveau courant", async ({ page }) => {
  66  |   await goToListerEvent(page)
  67  |   await press(page, 't')
  68  |   await expect(pane1(page).locator('.nature-panel .floating-panel__title')).toContainText('niv. 1')
  69  | })
  70  | 
  71  | test("panneau nature → contient 'Nature projet' et 'Nature évènemencier'", async ({ page }) => {
  72  |   await goToListerEvent(page)
  73  |   await press(page, 't')
  74  |   const panel = pane1(page).locator('.nature-panel')
> 75  |   await expect(panel).toContainText('Nature projet')
      |                       ^ Error: expect(locator).toContainText(expected) failed
  76  |   await expect(panel).toContainText('Nature évènemencier')
  77  | })
  78  | 
  79  | test("panneau nature → footer a boutons 'Annuler' et 'Appliquer' alternables par Tab", async ({ page }) => {
  80  |   await goToListerEvent(page)
  81  |   await press(page, 't')
  82  |   const footer = pane1(page).locator('.nature-panel .floating-panel__footer')
  83  |   await expect(footer).toBeVisible()
  84  |   const btns = footer.locator('.panel-btn')
  85  |   await expect(btns).toHaveCount(2)
  86  |   await expect(btns.first()).toContainText('Annuler')
  87  |   await expect(btns.last()).toContainText('Appliquer')
  88  | })
  89  | 
  90  | // ─── Navigation et menus ──────────────────────────────────────────────────────
  91  | 
  92  | test("Enter sur champ projet → popup avec 'roman' et 'film'", async ({ page }) => {
  93  |   await goToListerEvent(page)
  94  |   await press(page, 't')
  95  |   await press(page, 'Enter')
  96  |   const popup = pane1(page).locator('.popup-select')
  97  |   await expect(popup).toBeVisible()
  98  |   await expect(popup).toContainText('roman')
  99  |   await expect(popup).toContainText('film')
  100 | })
  101 | 
  102 | test("choix 'roman' → champ évènemencier activé par ArrowDown, Enter ouvre popup 'manuscrit'", async ({ page }) => {
  103 |   await goToListerEvent(page)
  104 |   await press(page, 't')
  105 |   await press(page, 'Enter')
  106 |   await press(page, 'ArrowUp')   // film/BD
  107 |   await press(page, 'ArrowUp')   // roman
  108 |   await press(page, 'Enter')     // roman
  109 |   await press(page, 'ArrowDown')
  110 |   await press(page, 'Enter')
  111 |   const popup = pane1(page).locator('.popup-select')
  112 |   await expect(popup).toBeVisible()
  113 |   await expect(popup).toContainText('manuscrit')
  114 |   await expect(popup).toContainText('défaut')
  115 | })
  116 | 
  117 | test("projet 'film' → popup évènemencier propose 'scénario'", async ({ page }) => {
  118 |   await goToListerEvent(page)
  119 |   await press(page, 't')
  120 |   await press(page, 'Enter')
  121 |   await press(page, 'ArrowUp')    // film/BD (index 1 depuis —)
  122 |   await press(page, 'Enter')
  123 |   await press(page, 'ArrowDown')  // champ évènemencier
  124 |   await press(page, 'Enter')
  125 |   await expect(pane1(page).locator('.popup-select')).toContainText('scénario')
  126 | })
  127 | 
  128 | // ─── Escape / Annuler ─────────────────────────────────────────────────────────
  129 | 
  130 | test("Escape ferme le panneau sans appliquer", async ({ page }) => {
  131 |   await goToListerEvent(page)
  132 |   await press(page, 't')
  133 |   await expect(pane1(page).locator('.nature-panel')).toBeVisible()
  134 |   await press(page, 'Escape')
  135 |   await expect(pane1(page).locator('.nature-panel')).not.toBeVisible()
  136 |   await expect(pane1(page).locator('#events-panel')).not.toHaveClass(/roman/)
  137 | })
  138 | 
  139 | // ─── Appliquer ────────────────────────────────────────────────────────────────
  140 | 
  141 | test("roman+manuscrit → #main-panel a la classe 'roman-man'", async ({ page }) => {
  142 |   await goToListerEvent(page)
  143 |   await setRomanMan(page)
  144 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/roman-man/)
  145 | })
  146 | 
  147 | test("film+scénario → #main-panel a la classe 'film-man'", async ({ page }) => {
  148 |   await goToListerEvent(page)
  149 |   await press(page, 't')
  150 |   await press(page, 'Enter')
  151 |   await press(page, 'ArrowUp')   // film/BD (index 1 depuis —)
  152 |   await press(page, 'Enter')
  153 |   await press(page, 'ArrowDown') // champ évènemencier
  154 |   await press(page, 'Enter')
  155 |   await press(page, 'ArrowUp')   // scénario (index 0 depuis évènemencier)
  156 |   await press(page, 'Enter')
  157 |   await applyNaturePanel(page)
  158 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  159 |   await press(page, 'Escape')    // refuser man_depth
  160 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  161 |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/film-man/)
  162 | })
  163 | 
  164 | // ─── Confirmation man_depth ───────────────────────────────────────────────────
  165 | 
  166 | test("nature man et depth ≠ man_depth → ConfirmDialog s'ouvre avec 'niveau par défaut'", async ({ page }) => {
  167 |   await goToListerEvent(page)
  168 |   await press(page, 't')
  169 |   await press(page, 'Enter')
  170 |   await press(page, 'ArrowUp')   // film/BD
  171 |   await press(page, 'ArrowUp')   // roman
  172 |   await press(page, 'Enter')
  173 |   await press(page, 'ArrowDown')
  174 |   await press(page, 'Enter')
  175 |   await press(page, 'ArrowUp')   // manuscrit
```