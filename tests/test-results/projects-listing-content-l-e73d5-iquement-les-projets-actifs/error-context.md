# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-listing-content.spec.js >> la liste affiche uniquement les projets actifs
- Location: specs/e2e/projects-listing-content.spec.js:6:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-listing')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-listing')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: Projet A
        - generic [ref=e6]: project-a
      - generic [ref=e7]:
        - generic [ref=e8]: Projet B
        - generic [ref=e9]: project-b
      - generic [ref=e10]:
        - generic [ref=e11]: Projet C
        - generic [ref=e12]: project-c
  - contentinfo "Raccourcis clavier" [ref=e13]
```

# Test source

```ts
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from '@playwright/test'
  5  | 
  6  | test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  7  | 
  8  |   await page.goto('/')
  9  | 
  10 |   const listings = page.locator('.project-listing')
  11 | 
> 12 |   await expect(listings).toHaveCount(3)
     |                          ^ Error: expect(locator).toHaveCount(expected) failed
  13 | 
  14 |   await expect(page.locator('text=project-a')).toBeVisible()
  15 |   await expect(page.locator('text=project-b')).toBeVisible()
  16 |   await expect(page.locator('text=project-c')).toBeVisible()
  17 | 
  18 |   await expect(page.locator('text=project-hidden')).toHaveCount(0)
  19 | 
  20 | })
```