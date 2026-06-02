# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brins-selection.spec.js >> brins cochés doivent correspondre aux brins de l'event
- Location: specs/e2e/_tdd/brins-selection.spec.js:4:1

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /Brin [CD]/
Received string:  "Intrigue principale"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button "Projet Test" [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e9]: Event 1
      - generic [ref=e11]: —
    - generic [ref=e14]:
      - generic [ref=e15]: Event 2
      - generic [ref=e17]: —
    - generic [ref=e20]:
      - generic [ref=e21]: Event 3
      - generic [ref=e23]: —
  - contentinfo "Raccourcis clavier" [ref=e24]:
    - generic [ref=e25]:
      - generic [ref=e26]: ↑ ↓
      - text: choisir
    - generic [ref=e27]:
      - generic [ref=e28]: ⏎
      - text: éditer
    - generic [ref=e29]:
      - generic [ref=e30]: "n"
      - text: nouveau
    - generic [ref=e31]:
      - generic [ref=e32]: ⌥n
      - text: nouveau sous le courant
    - generic [ref=e33]:
      - generic [ref=e34]: ⌘c
      - text: copier
    - generic [ref=e35]:
      - generic [ref=e36]: ⌘x
      - text: couper
    - generic [ref=e37]:
      - generic [ref=e38]: ⌘v
      - text: coller avant
    - generic [ref=e39]:
      - generic [ref=e40]: ⌦
      - text: supprimer
    - generic [ref=e41]:
      - generic [ref=e42]: ←
      - text: parent
    - generic [ref=e43]:
      - generic [ref=e44]: →
      - text: éléments
    - generic [ref=e45]:
      - generic [ref=e46]: /
      - text: filtrer
    - generic [ref=e47]:
      - generic [ref=e48]: ␣
      - text: cocher
    - generic [ref=e49]:
      - generic [ref=e50]: ⌘⏎
      - text: fermer
  - generic [ref=e52]:
    - generic [ref=e54]: Brins · Event 2
    - generic [ref=e55]:
      - generic [ref=e56]: ✓
      - textbox "Couleur du brin" [ref=e57]: "#d9c8a9"
      - generic [ref=e58]: INT
      - generic [ref=e59]: Intrigue principale
      - combobox [ref=e60]:
        - option "—"
        - option "intrigue principale"
        - option "intrigue amoureuse"
        - option "intrigue"
        - option "personnage"
        - option "relation"
        - option "thème"
        - option "accessoire"
        - option "autre"
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
  10  |   await page.waitForTimeout(500)
  11  | 
  12  |   // Ouvrir brins pour e1 (doit avoir A et B cochés)
  13  |   await page.press('body', 'ArrowDown')
  14  |   await page.waitForTimeout(200)
  15  |   await page.press('body', 'b')
  16  |   await page.waitForTimeout(300)
  17  | 
  18  |   let brinsItems = page.locator('.brin-item')
  19  |   let checkedCount = 0
  20  |   let uncheckedCount = 0
  21  | 
  22  |   console.log(`e1: ${await brinsItems.count()} brins trouvés`)
  23  | 
  24  |   for (let i = 0; i < await brinsItems.count(); i++) {
  25  |     const item = brinsItems.nth(i)
  26  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  27  |     const title = await item.locator('.brin-item__title').textContent()
  28  |     console.log(`  - "${title}" (checked: ${hasChecked})`)
  29  |     if (hasChecked) {
  30  |       checkedCount++
  31  |       expect(title).toMatch(/Brin [AB]/)
  32  |     } else {
  33  |       uncheckedCount++
> 34  |       expect(title).toMatch(/Brin [CD]/)
      |                     ^ Error: expect(received).toMatch(expected)
  35  |     }
  36  |   }
  37  |   expect(checkedCount).toBe(2)
  38  |   expect(uncheckedCount).toBe(2)
  39  | 
  40  |   // Fermer
  41  |   await page.press('body', 'Escape')
  42  |   await page.waitForTimeout(200)
  43  | 
  44  |   // Ouvrir brins pour e3 (aucun coché)
  45  |   await page.press('body', 'ArrowDown')
  46  |   await page.waitForTimeout(200)
  47  |   await page.press('body', 'b')
  48  |   await page.waitForTimeout(300)
  49  | 
  50  |   brinsItems = page.locator('.brin-item')
  51  |   checkedCount = 0
  52  | 
  53  |   for (let i = 0; i < await brinsItems.count(); i++) {
  54  |     const item = brinsItems.nth(i)
  55  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  56  |     const title = await item.locator('.brin-item__title').textContent()
  57  |     expect(hasChecked).toBe(false)
  58  |     if (hasChecked) checkedCount++
  59  |   }
  60  |   expect(checkedCount).toBe(0)
  61  | 
  62  |   // Fermer
  63  |   await page.press('body', 'Escape')
  64  |   await page.waitForTimeout(200)
  65  | 
  66  |   // Ouvrir brins pour e2 (doit avoir B et C cochés)
  67  |   await page.press('body', 'ArrowDown')
  68  |   await page.waitForTimeout(200)
  69  |   await page.press('body', 'b')
  70  |   await page.waitForTimeout(300)
  71  | 
  72  |   brinsItems = page.locator('.brin-item')
  73  |   checkedCount = 0
  74  |   uncheckedCount = 0
  75  | 
  76  |   for (let i = 0; i < await brinsItems.count(); i++) {
  77  |     const item = brinsItems.nth(i)
  78  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  79  |     const title = await item.locator('.brin-item__title').textContent()
  80  |     if (hasChecked) {
  81  |       checkedCount++
  82  |       expect(title).toMatch(/Brin [BC]/)
  83  |     } else {
  84  |       uncheckedCount++
  85  |       expect(title).toMatch(/Brin [AD]/)
  86  |     }
  87  |   }
  88  |   expect(checkedCount).toBe(2)
  89  |   expect(uncheckedCount).toBe(2)
  90  | 
  91  |   // Cocher D
  92  |   const brinDItem = page.locator('.brin-item').filter({ hasText: /Brin D/ })
  93  |   await brinDItem.click()
  94  |   await page.waitForTimeout(200)
  95  | 
  96  |   // Fermer
  97  |   await page.press('body', 'Escape')
  98  |   await page.waitForTimeout(200)
  99  | 
  100 |   // Naviguer back à e1 et vérifier que A et B sont encore cochés
  101 |   await page.press('body', 'ArrowLeft')
  102 |   await page.waitForTimeout(200)
  103 |   await page.press('body', 'ArrowUp')
  104 |   await page.waitForTimeout(200)
  105 |   await page.press('body', 'ArrowUp')
  106 |   await page.waitForTimeout(200)
  107 |   await page.press('body', 'b')
  108 |   await page.waitForTimeout(300)
  109 | 
  110 |   brinsItems = page.locator('.brin-item')
  111 |   checkedCount = 0
  112 | 
  113 |   for (let i = 0; i < await brinsItems.count(); i++) {
  114 |     const item = brinsItems.nth(i)
  115 |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  116 |     const title = await item.locator('.brin-item__title').textContent()
  117 |     if (hasChecked) {
  118 |       checkedCount++
  119 |       expect(title).toMatch(/Brin [AB]/)
  120 |     }
  121 |   }
  122 |   expect(checkedCount).toBe(2)
  123 | })
  124 | 
```