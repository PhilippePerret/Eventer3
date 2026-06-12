# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard/keyboard-alt-n.spec.js >> Alt+n dans la liste des projets >> Alt+n crée un nouvel item AU-DESSUS de l'item sélectionné
- Location: specs/e2e/keyboard/keyboard-alt-n.spec.js:16:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.project-item').nth(1)
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 4

- Projet A
+
+       
+       project-a
+     

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item').nth(1)
    14 × locator resolved to <div data-id="project-a" class="item project-item">…</div>
       - unexpected value "
      
      project-a
    "

```

```yaml
- text: project-a
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | // Simule le vrai ⌥n Mac US : event.key = '˜' (dead tilde), event.code = 'KeyN'
  5   | async function pressAltNMac(page) {
  6   |   await page.evaluate(() => {
  7   |     document.dispatchEvent(new KeyboardEvent('keydown', {
  8   |       key: '˜', code: 'KeyN', altKey: true, bubbles: true, cancelable: true
  9   |     }))
  10  |   })
  11  | }
  12  | 
  13  | test.describe('Alt+n dans la liste des projets', () => {
  14  |   test.beforeEach(() => installFixtures('many-projects'))
  15  | 
  16  |   test("Alt+n crée un nouvel item AU-DESSUS de l'item sélectionné", async ({ page }) => {
  17  |     await page.goto('/')
  18  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  19  | 
  20  |     const items = page.locator('.project-item')
  21  |     await expect(items.nth(0)).toHaveClass(/selected/)
  22  | 
  23  |     await page.keyboard.press('Alt+n')
  24  | 
  25  |     await expect(items).toHaveCount(4)
> 26  |     await expect(items.nth(1)).toContainText('Projet A')
      |                                ^ Error: expect(locator).toContainText(expected) failed
  27  |     await expect(items.nth(0)).toHaveClass(/selected/)
  28  |     await expect(items.nth(0).locator('input[name="title"]')).toBeVisible()
  29  |     await expect(items.nth(2)).toContainText('Projet B')
  30  |   })
  31  | 
  32  |   test("⌥n Mac (key='˜') crée un item AU-DESSUS — comportement clavier réel", async ({ page }) => {
  33  |     await page.goto('/')
  34  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  35  |     await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  36  | 
  37  |     await pressAltNMac(page)
  38  | 
  39  |     const items = page.locator('.project-item')
  40  |     await expect(items).toHaveCount(4)
  41  |     await expect(items.nth(0)).toHaveClass(/selected/)
  42  |     await expect(items.nth(0).locator('input[name="title"]')).toBeVisible()
  43  |   })
  44  | })
  45  | 
  46  | test.describe("Alt+n dans un EventLister", () => {
  47  |   test.beforeEach(() => installFixtures('many-events'))
  48  | 
  49  |   test("Alt+n crée un event AU-DESSUS de l'event sélectionné", async ({ page }) => {
  50  |     await page.goto('/')
  51  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  52  |     await page.keyboard.press('ArrowRight')
  53  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  54  | 
  55  |     const items = page.locator('.event-item')
  56  |     await expect(items.nth(0)).toHaveClass(/selected/)
  57  | 
  58  |     await page.keyboard.press('Alt+n')
  59  | 
  60  |     await expect(items.nth(1)).toContainText('Évènement un')
  61  |     await expect(items.nth(0)).toHaveClass(/selected/)
  62  |     await expect(items.nth(0).locator('input[name="title"]')).toBeVisible()
  63  |     await expect(items.nth(2)).toContainText('Évènement deux')
  64  |   })
  65  | 
  66  |   test("⌥n Mac (key='˜') crée un event AU-DESSUS — comportement clavier réel", async ({ page }) => {
  67  |     await page.goto('/')
  68  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  69  |     await page.keyboard.press('ArrowRight')
  70  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  71  |     await expect(page.locator('.event-item').nth(0)).toHaveClass(/selected/)
  72  | 
  73  |     await pressAltNMac(page)
  74  | 
  75  |     const items = page.locator('.event-item')
  76  |     await expect(items.nth(1)).toContainText('Évènement un')
  77  |     await expect(items.nth(0)).toHaveClass(/selected/)
  78  |     await expect(items.nth(0).locator('input[name="title"]')).toBeVisible()
  79  |   })
  80  | })
  81  | 
  82  | test.describe("Alt+n dans un BrinLister", () => {
  83  |   test.beforeEach(() => installFixtures('with-brins'))
  84  | 
  85  |   test("Alt+n crée un brin AU-DESSUS du brin sélectionné", async ({ page }) => {
  86  |     await page.goto('/')
  87  |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  88  |     await page.keyboard.press('ArrowRight')
  89  |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  90  |     await page.keyboard.press('b')
  91  |     await expect(page.locator('#brin-panel')).toBeVisible()
  92  | 
  93  |     const brins = page.locator('.brin-item')
  94  |     await expect(brins.nth(0)).toHaveClass(/selected/)
  95  | 
  96  |     await page.keyboard.press('Alt+n')
  97  | 
  98  |     await expect(brins.nth(0)).toHaveClass(/selected/)
  99  |     await expect(brins.nth(0).locator('input[name="title"]')).toBeVisible()
  100 |   })
  101 | })
  102 | 
```