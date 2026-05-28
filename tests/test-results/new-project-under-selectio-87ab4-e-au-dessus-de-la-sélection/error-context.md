# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: new-project-under-selection.spec.js >> la touche n crée un nouveau projet vide au-dessus de la sélection
- Location: specs/e2e/new-project-under-selection.spec.js:6:1

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
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from '@playwright/test'
  5  | 
  6  | test('la touche n crée un nouveau projet vide au-dessus de la sélection', async ({ page }) => {
  7  |   await page.goto('/')
  8  | 
  9  |   const items = page.locator('.project-item')
  10 | 
> 11 |   await expect(items).toHaveCount(3)
     |                       ^ Error: expect(locator).toHaveCount(expected) failed
  12 | 
  13 |   await page.keyboard.press('ArrowDown')
  14 |   await expect(items.nth(1)).toHaveClass(/selected/)
  15 | 
  16 |   await page.keyboard.press('n')
  17 | 
  18 |   await expect(items).toHaveCount(4)
  19 |   await expect(items.nth(0)).toContainText('Projet A')
  20 |   await expect(items.nth(1)).toHaveClass(/selected/)
  21 |   const titleInput = items.nth(1).locator('input[name="title"]')
  22 |   const idInput = items.nth(1).locator('input[name="id"]')
  23 | 
  24 |   await expect(titleInput).toHaveAttribute('placeholder', 'Titre du nouveau projet')
  25 |   await expect(titleInput).toHaveValue('')
  26 |   await expect(idInput).toHaveAttribute('placeholder', 'identifiant')
  27 |   await expect(idInput).toHaveValue('')
  28 |   await expect(items.nth(2)).toContainText('Projet B')
  29 | })
```