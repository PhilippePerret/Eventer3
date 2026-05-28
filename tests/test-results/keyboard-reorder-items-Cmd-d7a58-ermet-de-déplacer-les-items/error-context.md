# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard-reorder-items.spec.js >> Cmd+flèche permet de déplacer les items
- Location: specs/e2e/keyboard-reorder-items.spec.js:6:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.project-item').first()
Expected substring: "Projet A"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item').first()

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from '@playwright/test'
  5  | 
  6  | test('Cmd+flèche permet de déplacer les items', async ({ page }) => {
  7  | 
  8  |     await page.goto('/')
  9  | 
  10 |     const items =
  11 |       page.locator('.project-item')
  12 | 
  13 |     await expect(items.nth(0))
> 14 |       .toContainText('Projet A')
     |        ^ Error: expect(locator).toContainText(expected) failed
  15 | 
  16 |     await expect(items.nth(1))
  17 |       .toContainText('Projet B')
  18 | 
  19 |     await page.keyboard.press(
  20 |       'Meta+ArrowDown'
  21 |     )
  22 | 
  23 |     await expect(items.nth(0))
  24 |       .toContainText('Projet B')
  25 | 
  26 |     await expect(items.nth(1))
  27 |       .toContainText('Projet A')
  28 | 
  29 |     await page.keyboard.press(
  30 |       'Meta+ArrowUp'
  31 |     )
  32 | 
  33 |     await expect(items.nth(0))
  34 |       .toContainText('Projet A')
  35 | 
  36 |     await expect(items.nth(1))
  37 |       .toContainText('Projet B')
  38 | 
  39 |   }
  40 | )
```