# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-listing-content.spec.js >> la liste affiche uniquement les projets actifs
- Location: specs/e2e/projects-listing-content.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-listing')
Expected: 3
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-listing')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]: Projet modèle
      - generic [ref=e6]: demo
  - contentinfo "Raccourcis clavier" [ref=e7]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  4  | 
  5  |   await page.goto('/')
  6  | 
  7  |   const listings = page.locator('.project-listing')
  8  | 
> 9  |   await expect(listings).toHaveCount(3)
     |                          ^ Error: expect(locator).toHaveCount(expected) failed
  10 | 
  11 |   await expect(page.locator('text=project-a')).toBeVisible()
  12 |   await expect(page.locator('text=project-b')).toBeVisible()
  13 |   await expect(page.locator('text=project-c')).toBeVisible()
  14 | 
  15 |   await expect(page.locator('text=project-hidden')).toHaveCount(0)
  16 | 
  17 | })
```