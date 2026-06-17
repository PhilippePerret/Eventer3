# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/consolidate-level.spec.js >> consolidation via lettre dans le panneau outils
- Location: specs/e2e/event/consolidate-level.spec.js:59:1

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
  4   | // Fixture consolidate-level (copie de depth-move, dédiée à ce module) :
  5   | //   depth=3 : e57, e68 (réels) + "Séquence 2 +1" + "Séquence 3 +1"  — 2 virtuels
  6   | 
  7   | test.beforeEach(() => {
  8   |   installFixtures('consolidate-level')
  9   | })
  10  | 
  11  | async function enterLevelMode(page, targetDepth) {
  12  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  13  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  14  |   await page.keyboard.press('ArrowRight')
  15  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  16  |   if (targetDepth >= 2) {
  17  |     await page.keyboard.press('ArrowRight')
  18  |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  19  |   }
  20  |   if (targetDepth >= 3) {
  21  |     await page.keyboard.press('ArrowRight')
  22  |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '3')
  23  |   }
  24  |   await page.keyboard.press('Meta+m')
> 25  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  26  | }
  27  | 
  28  | test("⌘+t ouvre le panneau d'outils en LEVEL mode", async ({ page }) => {
  29  |   await page.goto('/')
  30  |   await enterLevelMode(page, 3)
  31  | 
  32  |   await page.keyboard.press('Meta+t')
  33  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  34  | })
  35  | 
  36  | test("hors LEVEL mode : panneau outils s'ouvre sans l'outil Consolider", async ({ page }) => {
  37  |   await page.goto('/')
  38  | 
  39  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  40  |   await page.keyboard.press('ArrowRight')
  41  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  42  | 
  43  |   await page.keyboard.press('Meta+t')
  44  | 
  45  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  46  |   await expect(pane1(page).locator('.tools-panel')).not.toContainText('Consolider')
  47  | })
  48  | 
  49  | test("panneau outils contient 'Consolider le niveau'", async ({ page }) => {
  50  |   await page.goto('/')
  51  |   await enterLevelMode(page, 3)
  52  | 
  53  |   await page.keyboard.press('Meta+t')
  54  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  55  | 
  56  |   await expect(pane1(page).locator('.tools-panel')).toContainText('Consolider le niveau')
  57  | })
  58  | 
  59  | test("consolidation via lettre dans le panneau outils", async ({ page }) => {
  60  |   await page.goto('/')
  61  |   await enterLevelMode(page, 3)
  62  | 
  63  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  64  | 
  65  |   await page.keyboard.press('Meta+t')
  66  |   await expect(pane1(page).locator('.tools-panel')).toBeVisible()
  67  | 
  68  |   await page.keyboard.press('c')
  69  |   await expect(pane1(page).locator('.tools-panel')).not.toBeVisible()
  70  | 
  71  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  72  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  73  | })
  74  | 
  75  | test("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  76  |   await page.goto('/')
  77  |   await enterLevelMode(page, 3)
  78  | 
  79  |   await page.keyboard.press('Meta+t')
  80  |   await page.keyboard.press('c')
  81  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  82  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  83  | 
  84  |   const titles = await pane1(page).locator('.event-item .event-text').allTextContents()
  85  |   expect(titles).toContain('Séquence 2 +1')
  86  |   expect(titles).toContain('Séquence 3 +1')
  87  | })
  88  | 
  89  | test("consolidation : items restent réels après toggle NESTING → LEVEL", async ({ page }) => {
  90  |   await page.goto('/')
  91  |   await enterLevelMode(page, 3)
  92  | 
  93  |   await page.keyboard.press('Meta+t')
  94  |   await page.keyboard.press('c')
  95  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  96  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  97  | 
  98  |   await page.keyboard.press('Meta+m')
  99  |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  100 | 
  101 |   await page.keyboard.press('Meta+m')
  102 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  103 | 
  104 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  105 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  106 | })
  107 | 
  108 | // ── BUG 2 : item virtuel au niveau ROOT non persistant ──────────────
  109 | // Fixture level-mode-mixed : e2 "Acte II" est virtuel au niveau ROOT (depth=1)
  110 | // Après consolidation, son lister_id doit être mis à jour en mémoire,
  111 | // sinon le prochain _collectItemsAtDepth voit encore lister_id=null → virtuel.
  112 | test.describe("persistance consolidation — item virtuel au niveau root", () => {
  113 |   test.beforeEach(() => {
  114 |     installFixtures('level-mode-mixed')
  115 |   })
  116 | 
  117 |   test("consolidation item root-level : reste réel après toggle NESTING → LEVEL", async ({ page }) => {
  118 |     page.on('console', msg => process.stdout.write(`[BROWSER] ${msg.text()}\n`))
  119 | 
  120 |     await page.goto('/')
  121 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  122 |     await page.keyboard.press('ArrowRight')
  123 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  124 |     await page.keyboard.press('ArrowRight')
  125 |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
```