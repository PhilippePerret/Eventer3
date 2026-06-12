# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/consolidate-level.spec.js >> consolidation : titres des nouveaux events corrects
- Location: specs/e2e/event/consolidate-level.spec.js:80:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.event-item')
Expected: 4
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.event-item')
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button "Séquence 1" [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: "+1"
      - generic [ref=e12]: —
    - generic [ref=e15]:
      - generic [ref=e17]: "+1"
      - generic [ref=e19]: —
  - generic:
    - generic: DISP MODE LEVEL
  - contentinfo "Raccourcis clavier" [ref=e20]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // Fixture depth-move :
  5   | //   depth=3 : e57, e68 (réels) + "Séquence 2 +1" + "Séquence 3 +1"  — 2 virtuels
  6   | 
  7   | test.beforeEach(() => {
  8   |   installFixtures('depth-move')
  9   | })
  10  | 
  11  | async function enterLevelMode(page, targetDepth) {
  12  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  13  |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  14  |   await page.keyboard.press('ArrowRight')
  15  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  16  |   if (targetDepth >= 2) {
  17  |     await page.keyboard.press('ArrowRight')
  18  |     await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  19  |   }
  20  |   if (targetDepth >= 3) {
  21  |     await page.keyboard.press('ArrowRight')
  22  |     await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  23  |   }
  24  |   await page.keyboard.press('Meta+m')
  25  |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  26  | }
  27  | 
  28  | test("⌘+k ouvre le panneau d'outils en LEVEL mode", async ({ page }) => {
  29  |   await page.goto('/')
  30  |   await enterLevelMode(page, 3)
  31  | 
  32  |   console.log('-> ⌘+k ouvre le panneau outils')
  33  |   await page.keyboard.press('Meta+k')
  34  |   await expect(page.locator('#tools-panel')).toBeVisible()
  35  | })
  36  | 
  37  | test("⌘+k inactif hors LEVEL mode", async ({ page }) => {
  38  |   await page.goto('/')
  39  | 
  40  |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  41  |   await page.keyboard.press('ArrowRight')
  42  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  43  | 
  44  |   await page.keyboard.press('Meta+k')
  45  | 
  46  |   console.log('-> panneau outils doit exister dans le DOM mais rester caché')
  47  |   await expect(page.locator('#tools-panel')).toBeAttached()
  48  |   await expect(page.locator('#tools-panel')).not.toBeVisible()
  49  | })
  50  | 
  51  | test("panneau outils contient 'Consolider le niveau courant'", async ({ page }) => {
  52  |   await page.goto('/')
  53  |   await enterLevelMode(page, 3)
  54  | 
  55  |   await page.keyboard.press('Meta+k')
  56  |   await expect(page.locator('#tools-panel')).toBeVisible()
  57  | 
  58  |   console.log('-> outil consolidation listé avec sa lettre')
  59  |   await expect(page.locator('#tools-panel')).toContainText('Consolider le niveau courant')
  60  | })
  61  | 
  62  | test("consolidation via lettre dans le panneau outils", async ({ page }) => {
  63  |   await page.goto('/')
  64  |   await enterLevelMode(page, 3)
  65  | 
  66  |   await expect(page.locator('.event-item.virtual')).toHaveCount(2)
  67  | 
  68  |   await page.keyboard.press('Meta+k')
  69  |   await expect(page.locator('#tools-panel')).toBeVisible()
  70  | 
  71  |   console.log('-> touche C : exécute la consolidation, ferme le panneau')
  72  |   await page.keyboard.press('c')
  73  |   await expect(page.locator('#tools-panel')).not.toBeVisible()
  74  | 
  75  |   console.log('-> 0 virtuels, 4 items réels')
  76  |   await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  77  |   await expect(page.locator('.event-item')).toHaveCount(4)
  78  | })
  79  | 
  80  | test("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  81  |   await page.goto('/')
  82  |   await enterLevelMode(page, 3)
  83  | 
  84  |   await page.keyboard.press('Meta+k')
  85  |   await page.keyboard.press('c')
  86  |   await expect(page.locator('.event-item.virtual')).toHaveCount(0)
> 87  |   await expect(page.locator('.event-item')).toHaveCount(4)
      |                                             ^ Error: expect(locator).toHaveCount(expected) failed
  88  | 
  89  |   console.log('-> nouveaux events : "Séquence 2 +1" et "Séquence 3 +1"')
  90  |   const titles = await page.locator('.event-item .event-text').allTextContents()
  91  |   expect(titles).toContain('Séquence 2 +1')
  92  |   expect(titles).toContain('Séquence 3 +1')
  93  | })
  94  | 
  95  | test("consolidation : items restent réels après toggle NESTING → LEVEL", async ({ page }) => {
  96  |   await page.goto('/')
  97  |   await enterLevelMode(page, 3)
  98  | 
  99  |   await page.keyboard.press('Meta+k')
  100 |   await page.keyboard.press('c')
  101 |   await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  102 |   await expect(page.locator('.event-item')).toHaveCount(4)
  103 | 
  104 |   console.log('-> ⌘+m : retour en NESTING')
  105 |   await page.keyboard.press('Meta+m')
  106 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  107 | 
  108 |   console.log('-> ⌘+m : retour en LEVEL')
  109 |   await page.keyboard.press('Meta+m')
  110 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  111 | 
  112 |   console.log('-> items consolidés restent réels (0 virtuels, 4 réels)')
  113 |   await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  114 |   await expect(page.locator('.event-item')).toHaveCount(4)
  115 | })
  116 | 
  117 | // ── BUG 2 : item virtuel au niveau ROOT non persistant ──────────────
  118 | // Fixture level-mode-mixed : e2 "Acte II" est virtuel au niveau ROOT (depth=1)
  119 | // Après consolidation, son lister_id doit être mis à jour en mémoire,
  120 | // sinon le prochain _collectItemsAtDepth voit encore lister_id=null → virtuel.
  121 | test.describe("persistance consolidation — item virtuel au niveau root", () => {
  122 |   test.beforeEach(() => {
  123 |     installFixtures('level-mode-mixed')
  124 |   })
  125 | 
  126 |   test("consolidation item root-level : reste réel après toggle NESTING → LEVEL", async ({ page }) => {
  127 |     await page.goto('/')
  128 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  129 |     await page.keyboard.press('ArrowRight')
  130 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  131 |     await page.keyboard.press('ArrowRight')
  132 |     await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  133 |     await page.keyboard.press('Meta+m')
  134 |     await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  135 | 
  136 |     console.log('-> 1 virtuel visible : Acte II +1')
  137 |     await expect(page.locator('.event-item.virtual')).toHaveCount(1)
  138 |     await expect(page.locator('.event-item')).toHaveCount(3)
  139 | 
  140 |     console.log('-> ⌘+k puis c : consolide')
  141 |     await page.keyboard.press('Meta+k')
  142 |     await page.keyboard.press('c')
  143 |     await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  144 |     await expect(page.locator('.event-item')).toHaveCount(3)
  145 | 
  146 |     console.log('-> ⌘+m : NESTING')
  147 |     await page.keyboard.press('Meta+m')
  148 |     await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  149 | 
  150 |     console.log('-> ⌘+m : LEVEL')
  151 |     await page.keyboard.press('Meta+m')
  152 |     await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  153 | 
  154 |     console.log('-> item Acte II +1 reste réel (0 virtuels)')
  155 |     await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  156 |     await expect(page.locator('.event-item')).toHaveCount(3)
  157 |   })
  158 | })
  159 | 
```