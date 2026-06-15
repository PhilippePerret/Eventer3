# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/consolidate-level.spec.js >> persistance consolidation — item virtuel au niveau root >> consolidation item root-level : reste réel après toggle NESTING → LEVEL
- Location: specs/e2e/_tdd/consolidate-level.spec.js:126:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item')
Expected: 3
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [active] [ref=f1e1]:
    - main [ref=f1e2]:
      - navigation [ref=f1e3]:
        - button "Acte I" [ref=f1e4] [cursor=pointer]
        - generic [ref=f1e5]: ‹
      - generic [ref=f1e8]:
        - generic [ref=f1e10]: Séquence 1 de Acte I
        - generic [ref=f1e12]: —
    - generic:
      - generic: DISP MODE LEVEL
    - contentinfo "Raccourcis clavier" [ref=f1e13]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  56  |   await expect(pane1(page).locator('#tools-panel')).toBeVisible()
  57  | 
  58  |   console.log('-> outil consolidation listé avec sa lettre')
  59  |   await expect(pane1(page).locator('#tools-panel')).toContainText('Consolider le niveau courant')
  60  | })
  61  | 
  62  | test("consolidation via lettre dans le panneau outils", async ({ page }) => {
  63  |   await page.goto('/')
  64  |   await enterLevelMode(page, 3)
  65  | 
  66  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(2)
  67  | 
  68  |   await page.keyboard.press('Meta+k')
  69  |   await expect(pane1(page).locator('#tools-panel')).toBeVisible()
  70  | 
  71  |   console.log('-> touche C : exécute la consolidation, ferme le panneau')
  72  |   await page.keyboard.press('c')
  73  |   await expect(pane1(page).locator('#tools-panel')).not.toBeVisible()
  74  | 
  75  |   console.log('-> 0 virtuels, 4 items réels')
  76  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  77  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  78  | })
  79  | 
  80  | test("consolidation : titres des nouveaux events corrects", async ({ page }) => {
  81  |   await page.goto('/')
  82  |   await enterLevelMode(page, 3)
  83  | 
  84  |   await page.keyboard.press('Meta+k')
  85  |   await page.keyboard.press('c')
  86  |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  87  |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  88  | 
  89  |   console.log('-> nouveaux events : "Séquence 2 +1" et "Séquence 3 +1"')
  90  |   const titles = await pane1(page).locator('.event-item .event-text').allTextContents()
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
  101 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  102 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
  103 | 
  104 |   console.log('-> ⌘+m : retour en NESTING')
  105 |   await page.keyboard.press('Meta+m')
  106 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  107 | 
  108 |   console.log('-> ⌘+m : retour en LEVEL')
  109 |   await page.keyboard.press('Meta+m')
  110 |   await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  111 | 
  112 |   console.log('-> items consolidés restent réels (0 virtuels, 4 réels)')
  113 |   await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  114 |   await expect(pane1(page).locator('.event-item')).toHaveCount(4)
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
  128 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  129 |     await page.keyboard.press('ArrowRight')
  130 |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  131 |     await page.keyboard.press('ArrowRight')
  132 |     await expect(pane1(page).locator('#main-panel')).toHaveAttribute('data-depth', '2')
  133 |     await page.keyboard.press('Meta+m')
  134 |     await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  135 | 
  136 |     console.log('-> 1 virtuel visible : Acte II +1')
  137 |     await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(1)
  138 |     await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  139 | 
  140 |     console.log('-> ⌘+k puis c : consolide')
  141 |     await page.keyboard.press('Meta+k')
  142 |     await page.keyboard.press('c')
  143 |     await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
  144 |     await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  145 | 
  146 |     console.log('-> ⌘+m : NESTING')
  147 |     await page.keyboard.press('Meta+m')
  148 |     await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE NESTING')
  149 | 
  150 |     console.log('-> ⌘+m : LEVEL')
  151 |     await page.keyboard.press('Meta+m')
  152 |     await expect(pane1(page).locator('#status-bar')).toContainText('DISP MODE LEVEL')
  153 | 
  154 |     console.log('-> item Acte II +1 reste réel (0 virtuels)')
  155 |     await expect(pane1(page).locator('.event-item.virtual')).toHaveCount(0)
> 156 |     await expect(pane1(page).locator('.event-item')).toHaveCount(3)
      |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  157 |   })
  158 | })
  159 | 
```