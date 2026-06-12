# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/display-mode-level.spec.js >> mode LEVEL depth=3 : events réels + virtuels avec +N
- Location: specs/e2e/event/display-mode-level.spec.js:48:1

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
    - generic: "+1"
    - generic: "+1"
  - generic:
    - generic: DISP MODE LEVEL
  - contentinfo "Raccourcis clavier" [ref=e6]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // Fixture depth-move :
  5   | //   Liste#2 (depth=1) : [e14 "Acte 1", e23 "Acte 2"]
  6   | //   Liste#3 (depth=2, enfant e14) : [e31 "Séquence 1", e45 "Séquence 2"]
  7   | //   Liste#4 (depth=3, enfant e31) : [e57 "Scène 1", e68 "Scène 2"]
  8   | //   Liste#5 (depth=2, enfant e23) : [e88 "Séquence 3"]
  9   | 
  10  | test.beforeEach(() => {
  11  |   installFixtures('depth-move')
  12  | })
  13  | 
  14  | async function enterProject(page) {
  15  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  16  |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  17  |   await page.keyboard.press('ArrowRight')
  18  |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  19  | }
  20  | 
  21  | test("mode LEVEL depth=2 : liste plate de tous les events depth=2", async ({ page }) => {
  22  |   await page.goto('/')
  23  |   await enterProject(page)
  24  | 
  25  |   console.log('\n=== TEST LEVEL MODE — DEPTH=2 ===')
  26  | 
  27  |   console.log('-> entrée dans e14 (Acte 1) → depth=2')
  28  |   await page.keyboard.press('ArrowRight')
  29  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  30  |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  31  | 
  32  |   console.log('-> ⌘+m : passage en LEVEL mode')
  33  |   await page.keyboard.press('Meta+m')
  34  |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  35  | 
  36  |   console.log('-> 3 items affichés : e31, e45 (Liste#3) + e88 (Liste#5)')
  37  |   await expect(page.locator('.event-item')).toHaveCount(3)
  38  |   await expect(page.locator('.event-item[data-id="e31"]')).toBeVisible()
  39  |   await expect(page.locator('.event-item[data-id="e45"]')).toBeVisible()
  40  |   await expect(page.locator('.event-item[data-id="e88"]')).toBeVisible()
  41  | 
  42  |   console.log('-> aucun item virtuel')
  43  |   await expect(page.locator('.event-item.virtual')).toHaveCount(0)
  44  | 
  45  |   console.log('\n=== FIN ===\n')
  46  | })
  47  | 
  48  | test("mode LEVEL depth=3 : events réels + virtuels avec +N", async ({ page }) => {
  49  |   await page.goto('/')
  50  |   await enterProject(page)
  51  | 
  52  |   console.log('\n=== TEST LEVEL MODE — DEPTH=3 ===')
  53  | 
  54  |   console.log('-> entrée dans e14 → depth=2, puis e31 → depth=3')
  55  |   await page.keyboard.press('ArrowRight')
  56  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  57  |   await page.keyboard.press('ArrowRight')
  58  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  59  | 
  60  |   console.log('-> ⌘+m : passage en LEVEL mode')
  61  |   await page.keyboard.press('Meta+m')
  62  |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  63  | 
  64  |   console.log('-> 4 items : e57, e68 (réels) + 2 virtuels (e45+1, e88+1)')
> 65  |   await expect(page.locator('.event-item')).toHaveCount(4)
      |                                             ^ Error: expect(locator).toHaveCount(expected) failed
  66  |   await expect(page.locator('.event-item[data-id="e57"]')).toBeVisible()
  67  |   await expect(page.locator('.event-item[data-id="e68"]')).toBeVisible()
  68  | 
  69  |   console.log('-> 2 items virtuels avec texte "+1"')
  70  |   await expect(page.locator('.event-item.virtual')).toHaveCount(2)
  71  |   await expect(page.locator('.event-item.virtual').nth(0)).toContainText('+1')
  72  |   await expect(page.locator('.event-item.virtual').nth(1)).toContainText('+1')
  73  | 
  74  |   console.log('-> items virtuels contiennent le titre de l\'event de référence')
  75  |   await expect(page.locator('.event-item.virtual').nth(0)).toContainText('Séquence 2')
  76  |   await expect(page.locator('.event-item.virtual').nth(1)).toContainText('Séquence 3')
  77  | 
  78  |   console.log('\n=== FIN ===\n')
  79  | })
  80  | 
  81  | test("items virtuels non sélectionnables au clavier", async ({ page }) => {
  82  |   await page.goto('/')
  83  |   await enterProject(page)
  84  | 
  85  |   await page.keyboard.press('ArrowRight')
  86  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '2')
  87  |   await page.keyboard.press('ArrowRight')
  88  |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  89  |   await page.keyboard.press('Meta+m')
  90  |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  91  | 
  92  |   console.log('-> LEVEL mode actif : 4 items dont 2 virtuels')
  93  |   await expect(page.locator('.event-item')).toHaveCount(4)
  94  |   await expect(page.locator('.event-item.virtual')).toHaveCount(2)
  95  | 
  96  |   console.log('-> ↓ navigue uniquement sur les items réels, saute les virtuels')
  97  |   await expect(page.locator('.event-item[data-id="e57"]')).toHaveClass(/selected/)
  98  |   await page.keyboard.press('ArrowDown')
  99  |   await expect(page.locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  100 |   await page.keyboard.press('ArrowDown')
  101 |   await expect(page.locator('.event-item[data-id="e68"]')).toHaveClass(/selected/)
  102 | })
  103 | 
  104 | test("entrer dans un item en mode LEVEL rebascule en NESTING", async ({ page }) => {
  105 |   await page.goto('/')
  106 |   await enterProject(page)
  107 | 
  108 |   await page.keyboard.press('ArrowRight')
  109 |   await page.keyboard.press('Meta+m')
  110 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE LEVEL')
  111 | 
  112 |   console.log('-> ArrowRight sur e31 : entre dans Liste#4, rebascule NESTING')
  113 |   await expect(page.locator('.event-item[data-id="e31"]')).toHaveClass(/selected/)
  114 |   await page.keyboard.press('ArrowRight')
  115 |   await expect(page.locator('#main-panel')).toHaveAttribute('data-depth', '3')
  116 |   await expect(page.locator('#status-bar')).toContainText('DISP MODE NESTING')
  117 | })
  118 | 
```