# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/keyboard-alt-n.spec.js >> Alt+n dans un BrinLister >> Alt+n crée un brin AU-DESSUS du brin sélectionné
- Location: specs/e2e/_tdd/keyboard-alt-n.spec.js:87:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#pane-1').contentFrame().locator('#brin-panel')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#brin-panel')
    14 × locator resolved to <div class="hidden" id="brin-panel"></div>
       - unexpected value "hidden"

```

```yaml
- main: Événement 1 — --- --- Événement 2 — --- ---
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/keyboard/keyboard-alt-n.spec.js
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | import { test, expect, pane1 } from '../__setup__.js'
  4   | 
  5   | // Simule le vrai ⌥n Mac US : event.key = '˜' (dead tilde), event.code = 'KeyN'
  6   | async function pressAltNMac(page) {
  7   |   const frame = page.frames().find(f => f.url().includes('app-frame'))
  8   |   await frame.evaluate(() => {
  9   |     document.dispatchEvent(new KeyboardEvent('keydown', {
  10  |       key: '˜', code: 'KeyN', altKey: true, bubbles: true, cancelable: true
  11  |     }))
  12  |   })
  13  | }
  14  | 
  15  | test.describe('Alt+n dans la liste des projets', () => {
  16  |   test.beforeEach(() => installFixtures('many-projects'))
  17  | 
  18  |   test("Alt+n crée un nouvel item AU-DESSUS de l'item sélectionné", async ({ page }) => {
  19  |     await page.goto('/')
  20  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  21  | 
  22  |     const items = pane1(page).locator('.project-item')
  23  |     await expect(items.nth(0)).toHaveClass(/selected/)
  24  | 
  25  |     await pane1(page).locator('#main-panel').press('Alt+n')
  26  | 
  27  |     await expect(items).toHaveCount(4)
  28  |     await expect(items.nth(1)).toContainText('Projet A')
  29  |     await expect(items.nth(0)).toHaveClass(/selected/)
  30  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  31  |     await expect(items.nth(2)).toContainText('Projet B')
  32  |   })
  33  | 
  34  |   test("⌥n Mac (key='˜') crée un item AU-DESSUS — comportement clavier réel", async ({ page }) => {
  35  |     await page.goto('/')
  36  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  37  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  38  | 
  39  |     await pressAltNMac(page)
  40  | 
  41  |     const items = pane1(page).locator('.project-item')
  42  |     await expect(items).toHaveCount(4)
  43  |     await expect(items.nth(0)).toHaveClass(/selected/)
  44  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  45  |   })
  46  | })
  47  | 
  48  | test.describe("Alt+n dans un EventLister", () => {
  49  |   test.beforeEach(() => installFixtures('many-events'))
  50  | 
  51  |   test("Alt+n crée un event AU-DESSUS de l'event sélectionné", async ({ page }) => {
  52  |     await page.goto('/')
  53  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  54  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  55  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  56  | 
  57  |     const items = pane1(page).locator('.event-item')
  58  |     await expect(items.nth(0)).toHaveClass(/selected/)
  59  | 
  60  |     await pane1(page).locator('#main-panel').press('Alt+n')
  61  | 
  62  |     await expect(items.nth(1)).toContainText('Évènement un')
  63  |     await expect(items.nth(0)).toHaveClass(/selected/)
  64  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  65  |     await expect(items.nth(2)).toContainText('Évènement deux')
  66  |   })
  67  | 
  68  |   test("⌥n Mac (key='˜') crée un event AU-DESSUS — comportement clavier réel", async ({ page }) => {
  69  |     await page.goto('/')
  70  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  71  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  72  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  73  |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  74  | 
  75  |     await pressAltNMac(page)
  76  | 
  77  |     const items = pane1(page).locator('.event-item')
  78  |     await expect(items.nth(1)).toContainText('Évènement un')
  79  |     await expect(items.nth(0)).toHaveClass(/selected/)
  80  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  81  |   })
  82  | })
  83  | 
  84  | test.describe("Alt+n dans un BrinLister", () => {
  85  |   test.beforeEach(() => installFixtures('with-brins'))
  86  | 
  87  |   test("Alt+n crée un brin AU-DESSUS du brin sélectionné", async ({ page }) => {
  88  |     await page.goto('/')
  89  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  90  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  91  |     await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  92  |     await pane1(page).locator('#main-panel').press('b')
> 93  |     await expect(pane1(page).locator('#brin-panel')).toBeVisible()
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  94  | 
  95  |     const brins = pane1(page).locator('.brin-item')
  96  |     await expect(brins.nth(0)).toHaveClass(/selected/)
  97  | 
  98  |     await pane1(page).locator('#main-panel').press('Alt+n')
  99  | 
  100 |     await expect(brins.nth(0)).toHaveClass(/selected/)
  101 |     await expect(brins.nth(0).locator('[data-field="title"]')).toBeVisible()
  102 |   })
  103 | })
  104 | 
```