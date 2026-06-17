# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: panels/tools-panel.spec.js >> panneau outils : titre visible
- Location: specs/e2e/panels/tools-panel.spec.js:50:1

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
  4   | // Fixture depth-move : events à profondeur 3 avec virtuels — même que consolidate-level
  5   | 
  6   | test.beforeEach(() => {
  7   |   installFixtures('depth-move')
  8   | })
  9   | 
  10  | async function enterLevelMode(page, targetDepth) {
  11  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  12  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  13  |   await page.keyboard.press('ArrowRight')
  14  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  15  |   if (targetDepth >= 2) {
  16  |     await page.keyboard.press('ArrowRight')
  17  |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  18  |   }
  19  |   if (targetDepth >= 3) {
  20  |     await page.keyboard.press('ArrowRight')
  21  |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  22  |   }
  23  |   await page.keyboard.press('Meta+m')
> 24  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  25  | }
  26  | 
  27  | // ── Ouverture / fermeture ────────────────────────────────────────────────────
  28  | 
  29  | test('⌘+t ouvre le panneau outils en mode LEVEL', async ({ page }) => {
  30  |   await page.goto('/')
  31  |   await enterLevelMode(page, 3)
  32  | 
  33  |   await page.keyboard.press('Meta+t')
  34  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  35  | })
  36  | 
  37  | test('⌘+t hors mode LEVEL : ouvre le panneau sans l\'outil Consolider', async ({ page }) => {
  38  |   await page.goto('/')
  39  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  40  |   await page.keyboard.press('ArrowRight')
  41  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  42  | 
  43  |   await page.keyboard.press('Meta+t')
  44  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  45  |   await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
  46  | })
  47  | 
  48  | // ── Esthétique ───────────────────────────────────────────────────────────────
  49  | 
  50  | test('panneau outils : titre visible', async ({ page }) => {
  51  |   await page.goto('/')
  52  |   await enterLevelMode(page, 3)
  53  | 
  54  |   await page.keyboard.press('Meta+t')
  55  |   await expect(pane1(page).locator('.tools-panel .floating-panel__title')).toBeVisible()
  56  | })
  57  | 
  58  | test('panneau outils : footer avec faux-boutons Fermer et Exécuter', async ({ page }) => {
  59  |   await page.goto('/')
  60  |   await enterLevelMode(page, 3)
  61  | 
  62  |   await page.keyboard.press('Meta+t')
  63  |   const footer = pane1(page).locator('.tools-panel .floating-panel__footer')
  64  |   await expect(footer).toBeVisible()
  65  |   await expect(footer.locator('.panel-btn--cancel')).toContainText('Fermer')
  66  |   await expect(footer.locator('.panel-btn--primary')).toContainText('Exécuter')
  67  | })
  68  | 
  69  | test('panneau outils : item Consolider listé avec son raccourci ⌘⇧C', async ({ page }) => {
  70  |   await page.goto('/')
  71  |   await enterLevelMode(page, 3)
  72  | 
  73  |   await page.keyboard.press('Meta+t')
  74  |   await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('Consolider le niveau')
  75  |   await expect(pane1(page).locator('.tools-panel .floating-panel__item').first()).toContainText('⌘')
  76  | })
  77  | 
  78  | // ── TAB cycle ────────────────────────────────────────────────────────────────
  79  | 
  80  | test('TAB : items → Exécuter → Fermer → items', async ({ page }) => {
  81  |   await page.goto('/')
  82  |   await enterLevelMode(page, 3)
  83  |   await page.keyboard.press('Meta+t')
  84  | 
  85  |   const panel = pane1(page).locator('.tools-panel')
  86  | 
  87  |   console.log('-> aucun faux-bouton focusé à l\'ouverture')
  88  |   await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)
  89  | 
  90  |   console.log('-> TAB #1 : Exécuter focusé')
  91  |   await page.keyboard.press('Tab')
  92  |   await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toBeVisible()
  93  |   await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toHaveCount(0)
  94  | 
  95  |   console.log('-> TAB #2 : Fermer focusé')
  96  |   await page.keyboard.press('Tab')
  97  |   await expect(panel.locator('.panel-btn--cancel.panel-btn--focused')).toBeVisible()
  98  |   await expect(panel.locator('.panel-btn--primary.panel-btn--focused')).toHaveCount(0)
  99  | 
  100 |   console.log('-> TAB #3 : retour aux items, aucun bouton focusé')
  101 |   await page.keyboard.press('Tab')
  102 |   await expect(panel.locator('.panel-btn--focused')).toHaveCount(0)
  103 |   await expect(panel.locator('.floating-panel__item.selected')).toBeVisible()
  104 | })
  105 | 
  106 | test('TAB + Enter sur Exécuter : consolide et ferme le panneau', async ({ page }) => {
  107 |   await page.goto('/')
  108 |   await enterLevelMode(page, 3)
  109 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  110 | 
  111 |   await page.keyboard.press('Meta+t')
  112 |   await page.keyboard.press('Tab')
  113 |   await expect(pane1(page).locator('.tools-panel .panel-btn--primary.panel-btn--focused')).toBeVisible()
  114 | 
  115 |   await page.keyboard.press('Enter')
  116 |   await expect(pane1(page).locator('.tools-panel')).not.toBeAttached()
  117 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  118 | })
  119 | 
  120 | test('TAB + TAB + Enter sur Fermer : ferme sans consolider', async ({ page }) => {
  121 |   await page.goto('/')
  122 |   await enterLevelMode(page, 3)
  123 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  124 | 
```