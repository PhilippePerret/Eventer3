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

Locator:  locator('.project-item')
Expected: 3
Received: 4
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-item')
    14 × locator resolved to 4 elements
       - unexpected value "4"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]: project-a
      - generic [ref=e5]: project-a
    - generic [ref=e6]:
      - generic [ref=e7]: project-b
      - generic [ref=e8]: project-b
    - generic [ref=e9]:
      - generic [ref=e10]: project-c
      - generic [ref=e11]: project-c
    - generic [ref=e12]:
      - generic [ref=e13]: Projet caché
      - generic [ref=e14]: project-hidden
  - contentinfo "Raccourcis clavier" [ref=e15]
```

# Test source

```ts
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | 
  4  | import { test, expect } from './__setup__.js'
  5  | 
  6  | test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  7  | 
  8  |   await page.goto('/')
  9  | 
> 10 |   await expect(page.locator('.project-item')).toHaveCount(3)
     |                                               ^ Error: expect(locator).toHaveCount(expected) failed
  11 | 
  12 |   await expect(page.locator('text=project-a')).toBeVisible()
  13 |   await expect(page.locator('text=project-b')).toBeVisible()
  14 |   await expect(page.locator('text=project-c')).toBeVisible()
  15 | 
  16 |   await expect(page.locator('text=project-hidden')).toHaveCount(0)
  17 | 
  18 | })
```