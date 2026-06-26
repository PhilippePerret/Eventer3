# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/keyboard-alt-n.spec.js >> Alt+n dans un ListerBrin >> Alt+n crée un brin AU-DESSUS du brin sélectionné
- Location: specs/e2e/_tdd/keyboard-alt-n.spec.js:89:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.brin-item').first().locator('[data-field="title"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.brin-item').first().locator('[data-field="title"]')

```

```yaml
- text: "Projet A --- roman Événement 1 — --- --- AUT Événement 2 — --- --- Mon brin #d9c8a9 MON brin #c8d9a9 --- ✓ Autre brin #a9d9c8 AUT brin"
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | import { test, expect, pane1 } from '../__setup__.js'
  5   | 
  6   | // Simule le vrai ⌥n Mac US : event.key = '˜' (dead tilde), event.code = 'KeyN'
  7   | async function pressAltNMac(page) {
  8   |   const frame = page.frames().find(f => f.url().includes('app-frame'))
  9   |   await frame.evaluate(() => {
  10  |     const el = document.activeElement ?? document
  11  |     el.dispatchEvent(new KeyboardEvent('keydown', {
  12  |       key: '˜', code: 'KeyN', altKey: true, bubbles: true, cancelable: true
  13  |     }))
  14  |   })
  15  | }
  16  | 
  17  | test.describe('Alt+n dans la liste des projets', () => {
  18  |   test.beforeEach(() => installFixtures('many-projects'))
  19  | 
  20  |   test("Alt+n crée un nouvel item AU-DESSUS de l'item sélectionné", async ({ page }) => {
  21  |     await page.goto('/')
  22  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  23  | 
  24  |     const items = pane1(page).locator('.project-item')
  25  |     await expect(items.nth(0)).toHaveClass(/selected/)
  26  | 
  27  |     await pane1(page).locator('.project-item.selected').press('Alt+n')
  28  | 
  29  |     await expect(items).toHaveCount(4)
  30  |     await expect(items.nth(1)).toContainText('Projet A')
  31  |     await expect(items.nth(0)).toHaveClass(/selected/)
  32  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  33  |     await expect(items.nth(2)).toContainText('Projet B')
  34  |   })
  35  | 
  36  |   test("⌥n Mac (key='˜') crée un item AU-DESSUS — comportement clavier réel", async ({ page }) => {
  37  |     await page.goto('/')
  38  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  39  |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  40  | 
  41  |     await pressAltNMac(page)
  42  | 
  43  |     const items = pane1(page).locator('.project-item')
  44  |     await expect(items).toHaveCount(4)
  45  |     await expect(items.nth(0)).toHaveClass(/selected/)
  46  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  47  |   })
  48  | })
  49  | 
  50  | test.describe("Alt+n dans un ListerEvent", () => {
  51  |   test.beforeEach(() => installFixtures('many-events'))
  52  | 
  53  |   test("Alt+n crée un event AU-DESSUS de l'event sélectionné", async ({ page }) => {
  54  |     await page.goto('/')
  55  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  56  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  57  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  58  | 
  59  |     const items = pane1(page).locator('.event-item')
  60  |     await expect(items.nth(0)).toHaveClass(/selected/)
  61  | 
  62  |     await pane1(page).locator('.event-item.selected').press('Alt+n')
  63  | 
  64  |     await expect(items.nth(1)).toContainText('Évènement un')
  65  |     await expect(items.nth(0)).toHaveClass(/selected/)
  66  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  67  |     await expect(items.nth(2)).toContainText('Évènement deux')
  68  |   })
  69  | 
  70  |   test("⌥n Mac (key='˜') crée un event AU-DESSUS — comportement clavier réel", async ({ page }) => {
  71  |     await page.goto('/')
  72  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  73  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  74  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  75  |     await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  76  | 
  77  |     await pressAltNMac(page)
  78  | 
  79  |     const items = pane1(page).locator('.event-item')
  80  |     await expect(items.nth(1)).toContainText('Évènement un')
  81  |     await expect(items.nth(0)).toHaveClass(/selected/)
  82  |     await expect(items.nth(0).locator('[data-field="title"]')).toBeVisible()
  83  |   })
  84  | })
  85  | 
  86  | test.describe("Alt+n dans un ListerBrin", () => {
  87  |   test.beforeEach(() => installFixtures('with-brins'))
  88  | 
  89  |   test("Alt+n crée un brin AU-DESSUS du brin sélectionné", async ({ page }) => {
  90  |     await page.goto('/')
  91  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  92  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  93  |     await expect(pane1(page).locator('#events-panel')).toBeVisible()
  94  |     await pane1(page).locator('.event-item.selected').press('b')
  95  |     await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  96  | 
  97  |     const brins = pane1(page).locator('.brin-item')
  98  |     await expect(brins.nth(0)).toHaveClass(/selected/)
  99  | 
  100 |     await pane1(page).locator('.brin-item.selected').press('Alt+n')
  101 | 
  102 |     await expect(brins.nth(0)).toHaveClass(/selected/)
> 103 |     await expect(brins.nth(0).locator('[data-field="title"]')).toBeVisible()
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  104 |   })
  105 | })
  106 | 
```