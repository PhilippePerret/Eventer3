# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brins-selection.spec.js >> brins cochés doivent correspondre aux brins de l'event
- Location: specs/e2e/_tdd/brins-selection.spec.js:5:1

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /Brin [AB]/
Received string:  "Brin C"
```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e2]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet Brins Test
        - generic [ref=f1e9]:
          - generic [ref=f1e10]: "---"
          - generic [ref=f1e11]: roman
      - generic [ref=f1e14]:
        - generic [ref=f1e17]:
          - generic [ref=f1e18]: Event 1
          - generic [ref=f1e19]:
            - generic [ref=f1e20]: —
            - generic [ref=f1e21]: "---"
            - generic [ref=f1e22]: "---"
          - generic [ref=f1e25]:
            - generic [ref=f1e26]: BRA
            - generic [ref=f1e27]: BRB
        - generic [ref=f1e30]:
          - generic [ref=f1e31]: Event 3
          - generic [ref=f1e32]:
            - generic [ref=f1e33]: —
            - generic [ref=f1e34]: "---"
            - generic [ref=f1e35]: "---"
        - generic [ref=f1e38]:
          - generic [ref=f1e39]: Event 2
          - generic [ref=f1e40]:
            - generic [ref=f1e41]: —
            - generic [ref=f1e42]: "---"
            - generic [ref=f1e43]: "---"
          - generic [ref=f1e46]:
            - generic [ref=f1e47]: BRB
            - generic [ref=f1e48]: BRC
      - generic [ref=f1e51]:
        - generic [ref=f1e54]:
          - generic [ref=f1e55]: Brin A
          - generic [ref=f1e56]:
            - generic [ref=f1e57]: "#d9c8a9"
            - generic [ref=f1e58]: BRA
            - generic [ref=f1e59]: intrigue
        - generic [ref=f1e60]:
          - generic [ref=f1e62]: ✓
          - generic [ref=f1e63]:
            - generic [ref=f1e64]: Brin B
            - generic [ref=f1e65]:
              - generic [ref=f1e66]: "#c8d9a9"
              - generic [ref=f1e67]: BRB
              - generic [ref=f1e68]: accessoire
        - generic [ref=f1e69]:
          - generic [ref=f1e71]: ✓
          - generic [ref=f1e72]:
            - generic [ref=f1e73]: Brin C
            - generic [ref=f1e74]:
              - generic [ref=f1e75]: "#a9d9c8"
              - generic [ref=f1e76]: BRC
              - generic [ref=f1e77]: personnage
        - generic [ref=f1e80]:
          - generic [ref=f1e81]: Brin D
          - generic [ref=f1e82]:
            - generic [ref=f1e83]: "#a9c8d9"
            - generic [ref=f1e84]: BRD
            - generic [ref=f1e85]: enquête
    - contentinfo "Raccourcis clavier" [ref=f1e86]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  7   |   await page.goto('/')
  8   | 
  9   |   // Naviguer au premier project
  10  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  11  |   await expect(pane1(page).locator('.event-item')).toHaveCount(3)
  12  | 
  13  |   // Ouvrir brins pour e1 (doit avoir A et B cochés)
  14  |   await pane1(page).locator('.event-item.selected').press('b')
  15  |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  16  | 
  17  |   let brinsItems = pane1(page).locator('.brin-item')
  18  |   let checkedCount = 0
  19  |   let uncheckedCount = 0
  20  | 
  21  |   console.log(`e1: ${await brinsItems.count()} brins trouvés`)
  22  | 
  23  |   for (let i = 0; i < await brinsItems.count(); i++) {
  24  |     const item = brinsItems.nth(i)
  25  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  26  |     const title = await item.locator('.brin-title').textContent()
  27  |     console.log(`  - "${title}" (checked: ${hasChecked})`)
  28  |     if (hasChecked) {
  29  |       checkedCount++
  30  |       expect(title).toMatch(/Brin [AB]/)
  31  |     } else {
  32  |       uncheckedCount++
  33  |       expect(title).toMatch(/Brin [CD]/)
  34  |     }
  35  |   }
  36  |   expect(checkedCount).toBe(2)
  37  |   expect(uncheckedCount).toBe(2)
  38  | 
  39  |   // Fermer
  40  |   await pane1(page).locator('.brin-item.selected').press('Meta+Enter')
  41  | 
  42  |   // Ouvrir brins pour e3 (aucun coché)
  43  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  44  |     await pane1(page).locator('.event-item.selected').press('b')
  45  |   
  46  |   brinsItems = pane1(page).locator('.brin-item')
  47  |   checkedCount = 0
  48  | 
  49  |   for (let i = 0; i < await brinsItems.count(); i++) {
  50  |     const item = brinsItems.nth(i)
  51  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  52  |     const title = await item.locator('.brin-title').textContent()
  53  |     expect(hasChecked).toBe(false)
  54  |     if (hasChecked) checkedCount++
  55  |   }
  56  |   expect(checkedCount).toBe(0)
  57  | 
  58  |   // Fermer
  59  |   await pane1(page).locator('.brin-item.selected').press('Meta+Enter')
  60  | 
  61  |   // Ouvrir brins pour e2 (doit avoir B et C cochés)
  62  |   await pane1(page).locator('.event-item.selected').press('ArrowDown')
  63  |     await pane1(page).locator('.event-item.selected').press('b')
  64  |   
  65  |   brinsItems = pane1(page).locator('.brin-item')
  66  |   checkedCount = 0
  67  |   uncheckedCount = 0
  68  | 
  69  |   for (let i = 0; i < await brinsItems.count(); i++) {
  70  |     const item = brinsItems.nth(i)
  71  |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  72  |     const title = await item.locator('.brin-title').textContent()
  73  |     if (hasChecked) {
  74  |       checkedCount++
  75  |       expect(title).toMatch(/Brin [BC]/)
  76  |     } else {
  77  |       uncheckedCount++
  78  |       expect(title).toMatch(/Brin [AD]/)
  79  |     }
  80  |   }
  81  |   expect(checkedCount).toBe(2)
  82  |   expect(uncheckedCount).toBe(2)
  83  | 
  84  |   // Cocher D
  85  |   const brinDItem = pane1(page).locator('.brin-item').filter({ hasText: /Brin D/ })
  86  |   await brinDItem.click()
  87  |   
  88  |   // Fermer
  89  |   await pane1(page).locator('.brin-item.selected').press('Meta+Enter')
  90  | 
  91  |   // Naviguer back à e1 et vérifier que A et B sont encore cochés
  92  |   await pane1(page).locator('.event-item.selected').press('ArrowLeft')
  93  |     await pane1(page).locator('.project-item.selected').press('ArrowUp')
  94  |     await pane1(page).locator('.project-item.selected').press('ArrowUp')
  95  |     await pane1(page).locator('.project-item.selected').press('ArrowRight')
  96  |     await pane1(page).locator('.event-item.selected').press('b')
  97  |   
  98  |   brinsItems = pane1(page).locator('.brin-item')
  99  |   checkedCount = 0
  100 | 
  101 |   for (let i = 0; i < await brinsItems.count(); i++) {
  102 |     const item = brinsItems.nth(i)
  103 |     const hasChecked = await item.evaluate(el => el.classList.contains('checked'))
  104 |     const title = await item.locator('.brin-title').textContent()
  105 |     if (hasChecked) {
  106 |       checkedCount++
> 107 |       expect(title).toMatch(/Brin [AB]/)
      |                     ^ Error: expect(received).toMatch(expected)
  108 |     }
  109 |   }
  110 |   expect(checkedCount).toBe(2)
  111 | })
  112 | 
```