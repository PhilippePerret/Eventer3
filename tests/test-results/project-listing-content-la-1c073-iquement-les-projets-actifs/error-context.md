# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-listing-content.spec.js >> la liste affiche uniquement les projets actifs
- Location: specs/e2e/project-listing-content.spec.js:6:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#main-panel > .project-list').locator('.project-item')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#main-panel > .project-list').locator('.project-item')
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
  6  | test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  7  | 
  8  |   await page.goto('/')
  9  | 
  10 |   const listing = page.locator('#main-panel > .project-list')
  11 | 
> 12 |   await expect(listing.locator('.project-item')).toHaveCount(3)
     |                                                  ^ Error: expect(locator).toHaveCount(expected) failed
  13 | 
  14 |   await expect(page.locator('text=project-a')).toBeVisible()
  15 |   await expect(page.locator('text=project-b')).toBeVisible()
  16 |   await expect(page.locator('text=project-c')).toBeVisible()
  17 | 
  18 |   await expect(page.locator('text=project-hidden')).toHaveCount(0)
  19 | 
  20 | })
```