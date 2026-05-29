# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: item/new-item-deselects-current.spec.js >> la touche n désélectionne l'item courant
- Location: specs/e2e/item/new-item-deselects-current.spec.js:6:1

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('.project-item').nth(1)
Expected pattern: not /selected/
Received string: "item project-item selected"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('.project-item').nth(1)
    14 × locator resolved to <div class="item project-item selected">…</div>
       - unexpected value "item project-item selected"

```

```yaml
- text: Projet A project-a
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from '../__setup__.js'
  5  | 
  6  | test("la touche n désélectionne l'item courant", async ({ page }) => {
  7  | 
  8  |   await page.goto('/')
  9  | 
  10 |   const items = page.locator('.project-item')
  11 | 
  12 |   console.log('\n=== TEST DÉSÉLECTION À LA TOUCHE n ===')
  13 | 
  14 |   console.log('-> vérification état initial : item 0 sélectionné')
  15 |   await expect(items.nth(0)).toHaveClass(/selected/)
  16 | 
  17 |   console.log('-> appui sur n')
  18 |   await page.keyboard.press('n')
  19 | 
  20 |   console.log("-> vérification : item 0 n'est plus sélectionné")
> 21 |   await expect(items.nth(1)).not.toHaveClass(/selected/)
     |                                  ^ Error: expect(locator).not.toHaveClass(expected) failed
  22 | 
  23 |   console.log('\n=== FIN TEST DÉSÉLECTION À LA TOUCHE n ===\n')
  24 | 
  25 | })
  26 | 
```