# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/project-listing.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#main-panel > .project-list').first()
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#main-panel > .project-list').first()
    14 × locator resolved to 0 elements
       - unexpected value "0"

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
  1  | import { test, expect } from './__setup__.js'
  2  | 
  3  | test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {
  4  | 
  5  |   await page.goto('/')
  6  | 
  7  |   const mainPanel = page.locator('#main-panel')
  8  |   const listing = page.locator('#main-panel > .project-list').first()
  9  |   const item = page.locator('.project-item')
  10 |   const title = page.locator('.project-item__title')
  11 |   const pid = page.locator('.project-item__id')
  12 | 
  13 |   console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')
  14 | 
  15 |   console.log('-> vérification #main-panel.project-list')
  16 |   await expect(mainPanel).toHaveClass(/project-list/)
  17 | 
  18 |   console.log('-> vérification .project-list')
> 19 |   await expect(listing).toHaveCount(1)
     |                         ^ Error: expect(locator).toHaveCount(expected) failed
  20 | 
  21 |   console.log('-> vérification .project-item')
  22 |   await expect(item).toHaveCount(3)
  23 | 
  24 |   console.log('-> vérification .project-item__title')
  25 |   await expect(title.nth(0)).toContainText('Projet A')
  26 | 
  27 |   console.log('-> vérification .project-item__id')
  28 |   await expect(pid.nth(0)).toContainText('project-a')
  29 | 
  30 |   console.log('\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n')
  31 | 
  32 | })
```