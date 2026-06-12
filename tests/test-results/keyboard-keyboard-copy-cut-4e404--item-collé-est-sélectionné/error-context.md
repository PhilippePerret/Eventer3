# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-copy-cut-paste.spec.js >> ⌘+c dans EventLister >> ⌘+c + ⌘+v : l'item collé est sélectionné
- Location: specs/e2e/keyboard/keyboard-copy-cut-paste.spec.js:38:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.event-item.selected')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.event-item.selected')

```

```yaml
- main:
  - navigation:
    - button
    - text: ‹
  - text: Évènement un — Évènement un — Évènement deux — Évènement trois —
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // ─── COPY ⌘+c ───────────────────────────────────────────────────────────────
  5   | // many-events : project-a (hl:true, e1/e2/e3), project-b (sans events)
  6   | 
  7   | test.describe('⌘+c dans EventLister', () => {
  8   | 
  9   |   test.beforeEach(() => installFixtures('many-events'))
  10  | 
  11  |   async function goToEventLister(page) {
  12  |     await page.goto('/')
  13  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  14  |     await page.keyboard.press('ArrowRight')
  15  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  16  |   }
  17  | 
  18  |   test('⌘+c ne retire pas l\'item original de la liste', async ({ page }) => {
  19  |     await goToEventLister(page)
  20  |     const items = page.locator('.event-item')
  21  |     const countBefore = await items.count()
  22  |     await page.keyboard.press('Meta+c')
  23  |     await expect(items).toHaveCount(countBefore)
  24  |   })
  25  | 
  26  |   test('⌘+c + ⌘+v ajoute un item au-dessus de la sélection', async ({ page }) => {
  27  |     await goToEventLister(page)
  28  |     const items = page.locator('.event-item')
  29  |     const countBefore = await items.count()
  30  |     const selectedTitle = await page.locator('.event-item.selected').textContent()
  31  |     await page.keyboard.press('Meta+c')
  32  |     await page.keyboard.press('Meta+v')
  33  |     await expect(items).toHaveCount(countBefore + 1)
  34  |     // L'item collé est au-dessus de la sélection d'origine → index 0 contient le titre copié
  35  |     await expect(items.nth(0)).toContainText(selectedTitle.trim())
  36  |   })
  37  | 
  38  |   test('⌘+c + ⌘+v : l\'item collé est sélectionné', async ({ page }) => {
  39  |     await goToEventLister(page)
  40  |     await page.keyboard.press('Meta+c')
  41  |     await page.keyboard.press('Meta+v')
> 42  |     await expect(page.locator('.event-item.selected')).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  43  |     await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  44  |   })
  45  | 
  46  |   test('⌘+c + ⌘+v : l\'item collé a un id différent de l\'original', async ({ page }) => {
  47  |     await goToEventLister(page)
  48  |     const items = page.locator('.event-item')
  49  |     const originalId = await items.nth(0).getAttribute('data-id')
  50  |     await page.keyboard.press('Meta+c')
  51  |     await page.keyboard.press('Meta+v')
  52  |     const copiedId = await items.nth(0).getAttribute('data-id')
  53  |     expect(copiedId).not.toBe(originalId)
  54  |   })
  55  | 
  56  |   test('après ⌘+c + ⌘+v, le collage est persistant', async ({ page }) => {
  57  |     await goToEventLister(page)
  58  |     const items = page.locator('.event-item')
  59  |     const countBefore = await items.count()
  60  |     await page.keyboard.press('Meta+c')
  61  |     await page.keyboard.press('Meta+v')
  62  |     await page.waitForLoadState('networkidle')
  63  |     await page.reload()
  64  |     await goToEventLister(page)
  65  |     await expect(items).toHaveCount(countBefore + 1)
  66  |   })
  67  | 
  68  | })
  69  | 
  70  | // ─── CUT ⌘+x ────────────────────────────────────────────────────────────────
  71  | 
  72  | test.describe('⌘+x dans EventLister', () => {
  73  | 
  74  |   test.beforeEach(() => installFixtures('many-events'))
  75  | 
  76  |   async function goToEventLister(page) {
  77  |     await page.goto('/')
  78  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  79  |     await page.keyboard.press('ArrowRight')
  80  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  81  |   }
  82  | 
  83  |   test('⌘+x retire l\'item sélectionné de la liste', async ({ page }) => {
  84  |     await goToEventLister(page)
  85  |     const items = page.locator('.event-item')
  86  |     const countBefore = await items.count()
  87  |     await page.keyboard.press('Meta+x')
  88  |     await expect(items).toHaveCount(countBefore - 1)
  89  |   })
  90  | 
  91  |   test('⌘+x + ⌘+v restitue l\'item au-dessus de la sélection', async ({ page }) => {
  92  |     await goToEventLister(page)
  93  |     const items = page.locator('.event-item')
  94  |     const countBefore = await items.count()
  95  |     // Mémoriser le titre de e1
  96  |     const cutTitle = await items.nth(0).textContent()
  97  |     // Couper e1, sélection passe à e2
  98  |     await page.keyboard.press('Meta+x')
  99  |     await expect(items).toHaveCount(countBefore - 1)
  100 |     // Coller au-dessus de e2 (sélectionné)
  101 |     await page.keyboard.press('Meta+v')
  102 |     await expect(items).toHaveCount(countBefore)
  103 |     await expect(items.nth(0)).toContainText(cutTitle.trim())
  104 |   })
  105 | 
  106 |   test('⌘+x + ⌘+v : l\'item collé conserve le même id que l\'original', async ({ page }) => {
  107 |     await goToEventLister(page)
  108 |     const items = page.locator('.event-item')
  109 |     const originalId = await items.nth(0).getAttribute('data-id')
  110 |     await page.keyboard.press('Meta+x')
  111 |     await page.keyboard.press('Meta+v')
  112 |     await expect(items.nth(0)).toHaveAttribute('data-id', originalId)
  113 |   })
  114 | 
  115 |   test('après ⌘+x + ⌘+v, la suppression initiale est annulée (persistance)', async ({ page }) => {
  116 |     await goToEventLister(page)
  117 |     const items = page.locator('.event-item')
  118 |     const countBefore = await items.count()
  119 |     await page.keyboard.press('Meta+x')
  120 |     await page.keyboard.press('Meta+v')
  121 |     await page.waitForLoadState('networkidle')
  122 |     await page.reload()
  123 |     await goToEventLister(page)
  124 |     await expect(items).toHaveCount(countBefore)
  125 |   })
  126 | 
  127 | })
  128 | 
  129 | // ─── CUT : INTERDICTION SUR DERNIER ITEM ────────────────────────────────────
  130 | // with-brins : project-a (2 events, 2 brins b1/b2)
  131 | // many-projects : Projet A (idx 0), Projet B (idx 1), Projet C (idx 2)
  132 | // TODO perso : ajouter quand Perso.js + fixture avec 2 persos existeront
  133 | 
  134 | test.describe('⌘+x interdit sur le dernier item', () => {
  135 | 
  136 |   test.beforeEach(() => installFixtures('with-brins'))
  137 | 
  138 |   test('⌘+x du dernier event affiche une notification et ne supprime pas', async ({ page }) => {
  139 |     await page.goto('/')
  140 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  141 |     await page.keyboard.press('ArrowRight')
  142 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
```