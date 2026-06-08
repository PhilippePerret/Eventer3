# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bootstrap/first-item-selected.spec.js >> le premier item du listing est sélectionné
- Location: specs/e2e/bootstrap/first-item-selected.spec.js:6:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-item')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active]:
  - main
  - contentinfo "Raccourcis clavier" [ref=e1]
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from '../__setup__.js'
  5  | 
  6  | test(
  7  |   'le premier item du listing est sélectionné',
  8  |   async ({ page }) => {
  9  | 
  10 |     await page.goto('/')
  11 | 
  12 |     const items = page.locator('.project-item')
  13 | 
> 14 |     await expect(items).toHaveCount(3)
     |                         ^ Error: expect(locator).toHaveCount(expected) failed
  15 | 
  16 |     await expect(items.nth(0)).toHaveClass(/selected/)
  17 |     await expect(items.nth(1)).not.toHaveClass(/selected/)
  18 |     await expect(items.nth(2)).not.toHaveClass(/selected/)
  19 | 
  20 |   }
  21 | )
```