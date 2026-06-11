# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brins-selection.spec.js >> brins cochés doivent correspondre aux brins de l'event
- Location: specs/e2e/brin/brins-selection.spec.js:4:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.event-item')
Expected: 3
Received: 4
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.event-item')
    - locator resolved to 0 elements
    - unexpected value "0"
    13 × locator resolved to 4 elements
       - unexpected value "4"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button "Projet Brins Test" [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: Brin A
      - generic [ref=e12]: —
    - generic [ref=e15]:
      - generic [ref=e17]: Brin B
      - generic [ref=e19]: —
    - generic [ref=e22]:
      - generic [ref=e24]: Brin C
      - generic [ref=e26]: —
    - generic [ref=e29]:
      - generic [ref=e31]: Brin D
      - generic [ref=e33]: —
  - generic:
    - generic: DISP MODE NESTING
  - contentinfo "Raccourcis clavier" [ref=e34]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { test, expect } from '../__setup__.js'
  2   | import { setupTestBrinsFixture } from '../../../helpers/fixture-setup.js'
  3   | 
  4   | test('brins cochés doivent correspondre aux brins de l\'event', async ({ page }) => {
  5   |   await setupTestBrinsFixture()
  6   |   await page.goto('/')
  7   | 
  8   |   // Naviguer au premier project
  9   |   await page.press('body', 'ArrowRight')
> 10  |   await expect(page.locator('.event-item')).toHaveCount(3)
      |                                             ^ Error: expect(locator).toHaveCount(expected) failed
  11  | 
  12  |   // Ouvrir brins pour e1 (doit avoir A et B cochés)
  13  |   await page.press('body', 'b')
  14  |   await expect(page.locator('#brin-panel')).toBeVisible()
  15  | 
  16  |   let brinsItems = page.locator('.brin-item')
  17  |   let checkedCount = 0
  18  |   let uncheckedCount = 0
  19  | 
  20  |   console.log(`e1: ${await brinsItems.count()} brins trouvés`)
  21  | 
  22  |   for (let i = 0; i < await brinsItems.count(); i++) {
  23  |     const item = brinsItems.nth(i)
  24  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  25  |     const title = await item.locator('.brin-item__title').textContent()
  26  |     console.log(`  - "${title}" (checked: ${hasChecked})`)
  27  |     if (hasChecked) {
  28  |       checkedCount++
  29  |       expect(title).toMatch(/Brin [AB]/)
  30  |     } else {
  31  |       uncheckedCount++
  32  |       expect(title).toMatch(/Brin [CD]/)
  33  |     }
  34  |   }
  35  |   expect(checkedCount).toBe(2)
  36  |   expect(uncheckedCount).toBe(2)
  37  | 
  38  |   // Fermer
  39  |   await page.press('body', 'Escape')
  40  |   await page.waitForTimeout(200)
  41  | 
  42  |   // Ouvrir brins pour e3 (aucun coché)
  43  |   await page.press('body', 'ArrowDown')
  44  |   await page.waitForTimeout(200)
  45  |   await page.press('body', 'b')
  46  |   await page.waitForTimeout(300)
  47  | 
  48  |   brinsItems = page.locator('.brin-item')
  49  |   checkedCount = 0
  50  | 
  51  |   for (let i = 0; i < await brinsItems.count(); i++) {
  52  |     const item = brinsItems.nth(i)
  53  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  54  |     const title = await item.locator('.brin-item__title').textContent()
  55  |     expect(hasChecked).toBe(false)
  56  |     if (hasChecked) checkedCount++
  57  |   }
  58  |   expect(checkedCount).toBe(0)
  59  | 
  60  |   // Fermer
  61  |   await page.press('body', 'Escape')
  62  |   await page.waitForTimeout(200)
  63  | 
  64  |   // Ouvrir brins pour e2 (doit avoir B et C cochés)
  65  |   await page.press('body', 'ArrowDown')
  66  |   await page.waitForTimeout(200)
  67  |   await page.press('body', 'b')
  68  |   await page.waitForTimeout(300)
  69  | 
  70  |   brinsItems = page.locator('.brin-item')
  71  |   checkedCount = 0
  72  |   uncheckedCount = 0
  73  | 
  74  |   for (let i = 0; i < await brinsItems.count(); i++) {
  75  |     const item = brinsItems.nth(i)
  76  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  77  |     const title = await item.locator('.brin-item__title').textContent()
  78  |     if (hasChecked) {
  79  |       checkedCount++
  80  |       expect(title).toMatch(/Brin [BC]/)
  81  |     } else {
  82  |       uncheckedCount++
  83  |       expect(title).toMatch(/Brin [AD]/)
  84  |     }
  85  |   }
  86  |   expect(checkedCount).toBe(2)
  87  |   expect(uncheckedCount).toBe(2)
  88  | 
  89  |   // Cocher D
  90  |   const brinDItem = page.locator('.brin-item').filter({ hasText: /Brin D/ })
  91  |   await brinDItem.click()
  92  |   await page.waitForTimeout(200)
  93  | 
  94  |   // Fermer
  95  |   await page.press('body', 'Escape')
  96  |   await page.waitForTimeout(200)
  97  | 
  98  |   // Naviguer back à e1 et vérifier que A et B sont encore cochés
  99  |   await page.press('body', 'ArrowLeft')
  100 |   await page.waitForTimeout(200)
  101 |   await page.press('body', 'ArrowUp')
  102 |   await page.waitForTimeout(200)
  103 |   await page.press('body', 'ArrowUp')
  104 |   await page.waitForTimeout(200)
  105 |   await page.press('body', 'ArrowRight')
  106 |   await page.waitForTimeout(500)
  107 |   await page.press('body', 'b')
  108 |   await page.waitForTimeout(300)
  109 | 
  110 |   brinsItems = page.locator('.brin-item')
```