# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/projects-listing.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.project-list')
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.project-list')
    14 × locator resolved to 2 elements
       - unexpected value "2"

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
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {
  4  |   console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')
  5  |   await page.goto('/')
  6  |   const mainPanel = page.locator('#main-panel')
  7  |   const listing = page.locator('.project-list')
  8  |   const item = page.locator('.project-item')
  9  |   const title = page.locator('.project-item__title')
  10 |   const pid = page.locator('.project-item__id')
  11 |   console.log('-> vérification #main-panel.project-list')
  12 |   await expect(mainPanel).toHaveClass(/project-list/)
  13 |   console.log('-> vérification .project-list')
> 14 |   await expect(listing).toHaveCount(1)
     |                         ^ Error: expect(locator).toHaveCount(expected) failed
  15 |   console.log('-> vérification .project-item')
  16 |   await expect(item).toHaveCount(1)
  17 |   console.log('-> vérification .project-item__title')
  18 |   await expect(title).toContainText('Projet modèle')
  19 |   console.log('-> vérification .project-item__id')
  20 |   await expect(pid).toContainText('demo')
  21 |   console.log('\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n')
  22 | })
  23 | 
```