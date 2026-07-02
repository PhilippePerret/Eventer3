# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-copy-cut-paste.spec.js >> ⌘+c dans ListerEvent >> ⌘+c + ⌘+v : l'item collé a un id différent de l'original
- Location: specs/e2e/keyboard/keyboard-copy-cut-paste.spec.js:44:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item')
Expected: 4
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item')
    14 × locator resolved to 3 elements
       - unexpected value "3"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e8]:
        - generic [ref=f1e9]: Évènement un
        - generic [ref=f1e11]: —
      - generic [ref=f1e14]:
        - generic [ref=f1e15]: Évènement deux
        - generic [ref=f1e17]: —
      - generic [ref=f1e20]:
        - generic [ref=f1e21]: Évènement trois
        - generic [ref=f1e23]: —
    - generic:
      - generic: DISP MODE NESTING
    - contentinfo "Raccourcis clavier" [ref=f1e24]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect, pane1, press } from '../__setup__.js'
  3   | 
  4   | // ─── COPY ⌘+c ───────────────────────────────────────────────────────────────
  5   | // many-events : project-a (hl:true, e1/e2/e3), project-b (sans events)
  6   | 
  7   | test.describe('⌘+c dans ListerEvent', () => {
  8   | 
  9   |   test.beforeEach(() => installFixtures('many-events'))
  10  | 
  11  |   async function goToListerEvent(page) {
  12  |     await page.goto('/')
  13  |     await pane1(page).locator('#projects-panel').waitFor()
  14  |     await press(page, 'ArrowRight')
  15  |     await pane1(page).locator('#events-panel').waitFor()
  16  |   }
  17  | 
  18  |   test('⌘+c ne retire pas l\'item original de la liste', async ({ page }) => {
  19  |     await goToListerEvent(page)
  20  |     const items = pane1(page).locator('.event-item')
  21  |     const countBefore = await items.count()
  22  |     await press(page, 'Meta+c')
  23  |     await expect(items).toHaveCount(countBefore)
  24  |   })
  25  | 
  26  |   test('⌘+c + ⌘+v ajoute un item au-dessus de la sélection', async ({ page }) => {
  27  |     await goToListerEvent(page)
  28  |     const items = pane1(page).locator('.event-item')
  29  |     const countBefore = await items.count()
  30  |     const selectedTitle = await pane1(page).locator('.event-item.selected').textContent()
  31  |     await press(page, 'Meta+c')
  32  |     await press(page, 'Meta+v')
  33  |     await expect(items).toHaveCount(countBefore + 1)
  34  |     await expect(items.nth(0)).toContainText(selectedTitle.trim())
  35  |   })
  36  | 
  37  |   test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
  38  |     await goToListerEvent(page)
  39  |     await press(page, 'Meta+c')
  40  |     await press(page, 'Meta+v')
  41  |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  42  |   })
  43  | 
  44  |   test('⌘+c + ⌘+v : l\'item collé a un id différent de l\'original', async ({ page }) => {
  45  |     await goToListerEvent(page)
  46  |     const items = pane1(page).locator('.event-item')
  47  |     const countBefore = await items.count()
  48  |     const originalId = await items.nth(0).getAttribute('data-id')
  49  |     await press(page, 'Meta+c')
  50  |     await press(page, 'Meta+v')
> 51  |     await expect(items).toHaveCount(countBefore + 1)
      |                         ^ Error: expect(locator).toHaveCount(expected) failed
  52  |     const copiedId = await items.nth(0).getAttribute('data-id')
  53  |     expect(copiedId).not.toBe(originalId)
  54  |   })
  55  | 
  56  |   test('après ⌘+c + ⌘+v, le collage est persistant', async ({ page }) => {
  57  |     await goToListerEvent(page)
  58  |     const items = pane1(page).locator('.event-item')
  59  |     const countBefore = await items.count()
  60  |     await press(page, 'Meta+c')
  61  |     await press(page, 'Meta+v')
  62  |     await page.waitForLoadState('networkidle')
  63  |     await page.reload()
  64  |     await goToListerEvent(page)
  65  |     await expect(items).toHaveCount(countBefore + 1)
  66  |   })
  67  | 
  68  | })
  69  | 
  70  | // ─── CUT ⌘+x ────────────────────────────────────────────────────────────────
  71  | 
  72  | test.describe('⌘+x dans ListerEvent', () => {
  73  | 
  74  |   test.beforeEach(() => installFixtures('many-events'))
  75  | 
  76  |   async function goToListerEvent(page) {
  77  |     await page.goto('/')
  78  |     await pane1(page).locator('#projects-panel').waitFor()
  79  |     await press(page, 'ArrowRight')
  80  |     await pane1(page).locator('#events-panel').waitFor()
  81  |   }
  82  | 
  83  |   test('⌘+x retire l\'item sélectionné de la liste', async ({ page }) => {
  84  |     await goToListerEvent(page)
  85  |     const items = pane1(page).locator('.event-item')
  86  |     const countBefore = await items.count()
  87  |     await press(page, 'Meta+x')
  88  |     await expect(items).toHaveCount(countBefore - 1)
  89  |   })
  90  | 
  91  |   test('⌘+x + ⌘+v restitue l\'item au-dessus de la sélection', async ({ page }) => {
  92  |     await goToListerEvent(page)
  93  |     const items = pane1(page).locator('.event-item')
  94  |     const countBefore = await items.count()
  95  |     const cutTitle = await items.nth(0).textContent()
  96  |     await press(page, 'Meta+x')
  97  |     await expect(items).toHaveCount(countBefore - 1)
  98  |     await press(page, 'Meta+v')
  99  |     await expect(items).toHaveCount(countBefore)
  100 |     await expect(items.nth(0)).toContainText(cutTitle.trim())
  101 |   })
  102 | 
  103 |   test('⌘+x + ⌘+v : l\'item collé conserve le même id que l\'original', async ({ page }) => {
  104 |     await goToListerEvent(page)
  105 |     const items = pane1(page).locator('.event-item')
  106 |     const originalId = await items.nth(0).getAttribute('data-id')
  107 |     await press(page, 'Meta+x')
  108 |     await press(page, 'Meta+v')
  109 |     await expect(items.nth(0)).toHaveAttribute('data-id', originalId)
  110 |   })
  111 | 
  112 |   test('après ⌘+x + ⌘+v, la suppression initiale est annulée (persistance)', async ({ page }) => {
  113 |     await goToListerEvent(page)
  114 |     const items = pane1(page).locator('.event-item')
  115 |     const countBefore = await items.count()
  116 |     await press(page, 'Meta+x')
  117 |     await press(page, 'Meta+v')
  118 |     await page.waitForLoadState('networkidle')
  119 |     await page.reload()
  120 |     await goToListerEvent(page)
  121 |     await expect(items).toHaveCount(countBefore)
  122 |   })
  123 | 
  124 | })
  125 | 
  126 | // ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────
  127 | 
  128 | test.describe('⌘+x interdit sur le dernier item', () => {
  129 | 
  130 |   test.beforeEach(() => installFixtures('with-brins'))
  131 | 
  132 |   test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
  133 |     await page.goto('/')
  134 |     await pane1(page).locator('#projects-panel').waitFor()
  135 |     await press(page, 'ArrowRight')
  136 |     await pane1(page).locator('#events-panel').waitFor()
  137 |     const items = pane1(page).locator('.event-item')
  138 |     await press(page, 'Meta+x')
  139 |     await expect(items).toHaveCount(1)
  140 |     await press(page, 'Meta+x')
  141 |     await expect(items).toHaveCount(1)
  142 |     await expect(pane1(page).locator('#notification')).toBeVisible()
  143 |     await expect(pane1(page).locator('#notification')).toContainText('évènement')
  144 |   })
  145 | 
  146 |   test('⌘+x du dernier brin affiche une notification mentionnant "brin"', async ({ page }) => {
  147 |     await page.goto('/')
  148 |     await pane1(page).locator('#projects-panel').waitFor()
  149 |     await press(page, 'ArrowRight')
  150 |     await pane1(page).locator('#events-panel').waitFor()
  151 |     await press(page, 'b')
```