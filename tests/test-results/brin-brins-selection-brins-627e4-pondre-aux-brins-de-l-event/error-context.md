# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brins-selection.spec.js >> brins cochés doivent correspondre aux brins de l'event
- Location: specs/e2e/brin/brins-selection.spec.js:5:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.event-item')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e7]:
      - generic [ref=f1e8]: Projet Brins Test
      - generic [ref=f1e10]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e11]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/brin/brins-selection.spec.js
  2   | import { test, expect, pane1, press } from '../__setup__.js'
  3   | import { setupTestBrinsFixture } from '../../../helpers/fixture-setup.js'
  4   | 
  5   | test('brins cochés doivent correspondre aux brins de l\'event', async ({ page }) => {
  6   |   await setupTestBrinsFixture()
  7   |   await page.goto('/')
  8   | 
  9   |   // Naviguer au premier project
  10  |   await press(page, 'ArrowRight')
> 11  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
      |                                                    ^ Error: expect(locator).toHaveCount(expected) failed
  12  | 
  13  |   // Ouvrir brins pour e1 (doit avoir A et B cochés)
  14  |   await press(page, 'b')
  15  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  16  | 
  17  |   let brinsItems = pane1(page).locator('.brin-item')
  18  |   let checkedCount = 0
  19  |   let uncheckedCount = 0
  20  | 
  21  |   for (let i = 0; i < await brinsItems.count(); i++) {
  22  |     const item = brinsItems.nth(i)
  23  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  24  |     const title = await item.locator('.brin-title').textContent()
  25  |     if (hasChecked) {
  26  |       checkedCount++
  27  |       expect(title).toMatch(/Brin [AB]/)
  28  |     } else {
  29  |       uncheckedCount++
  30  |       expect(title).toMatch(/Brin [CD]/)
  31  |     }
  32  |   }
  33  |   expect(checkedCount).toBe(2)
  34  |   expect(uncheckedCount).toBe(2)
  35  | 
  36  |   // Fermer
  37  |   await press(page, 'Meta+Enter')
  38  | 
  39  |   // Ouvrir brins pour e3 (aucun coché)
  40  |   await press(page, 'ArrowDown')
  41  |   await press(page, 'b')
  42  | 
  43  |   brinsItems = pane1(page).locator('.brin-item')
  44  |   checkedCount = 0
  45  | 
  46  |   for (let i = 0; i < await brinsItems.count(); i++) {
  47  |     const item = brinsItems.nth(i)
  48  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  49  |     expect(hasChecked).toBe(false)
  50  |     if (hasChecked) checkedCount++
  51  |   }
  52  |   expect(checkedCount).toBe(0)
  53  | 
  54  |   // Fermer
  55  |   await press(page, 'Meta+Enter')
  56  | 
  57  |   // Ouvrir brins pour e2 (doit avoir B et C cochés)
  58  |   await press(page, 'ArrowDown')
  59  |   await press(page, 'b')
  60  | 
  61  |   brinsItems = pane1(page).locator('.brin-item')
  62  |   checkedCount = 0
  63  |   uncheckedCount = 0
  64  | 
  65  |   for (let i = 0; i < await brinsItems.count(); i++) {
  66  |     const item = brinsItems.nth(i)
  67  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  68  |     const title = await item.locator('.brin-title').textContent()
  69  |     if (hasChecked) {
  70  |       checkedCount++
  71  |       expect(title).toMatch(/Brin [BC]/)
  72  |     } else {
  73  |       uncheckedCount++
  74  |       expect(title).toMatch(/Brin [AD]/)
  75  |     }
  76  |   }
  77  |   expect(checkedCount).toBe(2)
  78  |   expect(uncheckedCount).toBe(2)
  79  | 
  80  |   // Cocher D (index 3 : ArrowDown×3 depuis A sélectionné)
  81  |   await press(page, 'ArrowDown')
  82  |   await press(page, 'ArrowDown')
  83  |   await press(page, 'ArrowDown')
  84  |   await press(page, ' ')
  85  | 
  86  |   // Fermer
  87  |   await press(page, 'Meta+Enter')
  88  | 
  89  |   // Naviguer back à e1 et vérifier que A et B sont encore cochés
  90  |   await press(page, 'ArrowLeft')
  91  |   await press(page, 'ArrowUp')
  92  |   await press(page, 'ArrowUp')
  93  |   await press(page, 'ArrowRight')
  94  |   await expect(pane1(page).locator('.event-item').nth(0)).toHaveClass(/selected/)
  95  |   await press(page, 'b')
  96  | 
  97  |   brinsItems = pane1(page).locator('.brin-item')
  98  |   checkedCount = 0
  99  | 
  100 |   for (let i = 0; i < await brinsItems.count(); i++) {
  101 |     const item = brinsItems.nth(i)
  102 |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  103 |     const title = await item.locator('.brin-title').textContent()
  104 |     if (hasChecked) {
  105 |       checkedCount++
  106 |       expect(title).toMatch(/Brin [AB]/)
  107 |     }
  108 |   }
  109 |   expect(checkedCount).toBe(2)
  110 | })
  111 | 
```