# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard-navigation.spec.js >> les flèches haut/bas permettent de naviguer dans un Lister
- Location: specs/e2e/keyboard-navigation.spec.js:6:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('.project-item').first()
Expected pattern: /selected/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
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
  6  | test(
  7  |   'les flèches haut/bas permettent de naviguer dans un Lister',
  8  |   async ({ page }) => {
  9  | 
  10 |     await page.goto('/')
  11 | 
  12 |     const items = page.locator('.project-item')
  13 | 
  14 |     await expect(items.nth(0))
> 15 |       .toHaveClass(/selected/)
     |        ^ Error: expect(locator).toHaveClass(expected) failed
  16 | 
  17 |     await page.keyboard.press('ArrowDown')
  18 | 
  19 |     await expect(items.nth(0))
  20 |       .not.toHaveClass(/selected/)
  21 | 
  22 |     await expect(items.nth(1))
  23 |       .toHaveClass(/selected/)
  24 | 
  25 |     await page.keyboard.press('ArrowDown')
  26 | 
  27 |     await expect(items.nth(1))
  28 |       .not.toHaveClass(/selected/)
  29 | 
  30 |     await expect(items.nth(2))
  31 |       .toHaveClass(/selected/)
  32 | 
  33 |     await page.keyboard.press('ArrowUp')
  34 | 
  35 |     await expect(items.nth(2))
  36 |       .not.toHaveClass(/selected/)
  37 | 
  38 |     await expect(items.nth(1))
  39 |       .toHaveClass(/selected/)
  40 | 
  41 |   }
  42 | )
```