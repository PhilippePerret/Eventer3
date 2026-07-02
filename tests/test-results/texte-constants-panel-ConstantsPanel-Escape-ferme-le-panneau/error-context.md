# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: texte/constants-panel.spec.js >> ConstantsPanel >> Escape ferme le panneau
- Location: specs/e2e/texte/constants-panel.spec.js:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#constants-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#constants-panel')
    14 × locator resolved to <div id="constants-panel" class="ftpanel hidden"></div>
       - unexpected value "hidden"

```

```yaml
- text: Projet A roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | 
  4   | // Fixture deep-events : Projet A (UUID-1) avec e1/e2/e3
  5   | 
  6   | test.describe('ConstantsPanel', () => {
  7   | 
  8   |   test.beforeEach(() => installFixtures('deep-events'))
  9   | 
  10  |   // ─── Ouverture ─────────────────────────────────────────────────────────────
  11  | 
  12  |   test('q ouvre le panneau depuis ListerProject', async ({ page }) => {
  13  |     await page.goto('/')
  14  |     await press(page, 'q')
  15  |     await expect(pane1(page).locator('#constants-panel')).toBeVisible()
  16  |   })
  17  | 
  18  |   test('q ouvre le panneau depuis ListerEvent', async ({ page }) => {
  19  |     await page.goto('/')
  20  |     await press(page, 'ArrowRight')
  21  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  22  |     await press(page, 'q')
  23  |     await expect(pane1(page).locator('#constants-panel')).toBeVisible()
  24  |   })
  25  | 
  26  |   test('Escape ferme le panneau', async ({ page }) => {
  27  |     await page.goto('/')
  28  |     await press(page, 'q')
> 29  |     await expect(pane1(page).locator('#constants-panel')).toBeVisible()
      |                                                           ^ Error: expect(locator).toBeVisible() failed
  30  |     await press(page, 'Escape')
  31  |     await expect(pane1(page).locator('#constants-panel')).not.toBeVisible()
  32  |   })
  33  | 
  34  |   // ─── Structure ─────────────────────────────────────────────────────────────
  35  | 
  36  |   test('le panneau a exactement deux colonnes', async ({ page }) => {
  37  |     await page.goto('/')
  38  |     await press(page, 'q')
  39  |     await expect(pane1(page).locator('.constants-panel__column')).toHaveCount(2)
  40  |   })
  41  | 
  42  |   test('chaque colonne contient des lignes constante/valeur', async ({ page }) => {
  43  |     await page.goto('/')
  44  |     await press(page, 'q')
  45  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  46  |     const rows = pane1(page).locator('.constants-row')
  47  |     const count = await rows.count()
  48  |     expect(count).toBeGreaterThan(4)
  49  |     await expect(pane1(page).locator('.constants-row__name').first()).toBeVisible()
  50  |     await expect(pane1(page).locator('.constants-row__value').first()).toBeVisible()
  51  |   })
  52  | 
  53  |   // ─── Navigation ────────────────────────────────────────────────────────────
  54  | 
  55  |   test('la première ligne est sélectionnée à l\'ouverture', async ({ page }) => {
  56  |     await page.goto('/')
  57  |     await press(page, 'q')
  58  |     await expect(pane1(page).locator('.constants-row').first()).toHaveClass(/selected/)
  59  |   })
  60  | 
  61  |   test('↓ sélectionne la ligne suivante', async ({ page }) => {
  62  |     await page.goto('/')
  63  |     await press(page, 'q')
  64  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  65  |     await press(page, 'ArrowDown')
  66  |     await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
  67  |     await expect(pane1(page).locator('.constants-row').first()).not.toHaveClass(/selected/)
  68  |   })
  69  | 
  70  |   test('↑ remonte d\'une ligne', async ({ page }) => {
  71  |     await page.goto('/')
  72  |     await press(page, 'q')
  73  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  74  |     await press(page, 'ArrowDown')
  75  |     await press(page, 'ArrowDown')
  76  |     await press(page, 'ArrowUp')
  77  |     await expect(pane1(page).locator('.constants-row').nth(1)).toHaveClass(/selected/)
  78  |   })
  79  | 
  80  |   // ─── Édition ───────────────────────────────────────────────────────────────
  81  | 
  82  |   test('Tab met le focus sur le champ constante de la ligne sélectionnée', async ({ page }) => {
  83  |     await page.goto('/')
  84  |     await press(page, 'q')
  85  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  86  |     await press(page, 'Tab')
  87  |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  88  |   })
  89  | 
  90  |   test('Tab depuis le champ constante met le focus sur le champ valeur', async ({ page }) => {
  91  |     await page.goto('/')
  92  |     await press(page, 'q')
  93  |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  94  |     await press(page, 'Tab')
  95  |     await press(page, 'Tab')
  96  |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  97  |   })
  98  | 
  99  |   test('Shift+Tab depuis le champ valeur revient sur le champ constante (même ligne)', async ({ page }) => {
  100 |     await page.goto('/')
  101 |     await press(page, 'q')
  102 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  103 |     await press(page, 'Tab')
  104 |     await press(page, 'Tab')
  105 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  106 |     await press(page, 'Shift+Tab')
  107 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__name')).toBeFocused()
  108 |   })
  109 | 
  110 |   test('Shift+Tab depuis le champ constante va sur la valeur de la ligne précédente', async ({ page }) => {
  111 |     await page.goto('/')
  112 |     await press(page, 'q')
  113 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  114 |     await press(page, 'ArrowDown')
  115 |     await press(page, 'Tab')
  116 |     await expect(pane1(page).locator('.constants-row').nth(1).locator('.constants-row__name')).toBeFocused()
  117 |     await press(page, 'Shift+Tab')
  118 |     await expect(pane1(page).locator('.constants-row').first().locator('.constants-row__value')).toBeFocused()
  119 |   })
  120 | 
  121 |   // ─── Persistance ───────────────────────────────────────────────────────────
  122 | 
  123 |   test('constante + valeur : sauvegardée à la fermeture', async ({ page }) => {
  124 |     await page.goto('/')
  125 |     await press(page, 'ArrowRight')
  126 |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  127 |     await press(page, 'q')
  128 |     await expect(pane1(page).locator('.constants-row').first()).toBeVisible()
  129 |     await press(page, 'Tab')
```