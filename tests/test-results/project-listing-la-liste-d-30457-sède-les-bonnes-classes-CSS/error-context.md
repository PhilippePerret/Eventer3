# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/project-listing.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main id="main-panel"></main>
       - unexpected value ""

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
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
> 16 |   await expect(mainPanel).toHaveClass(/project-list/)
     |                           ^ Error: expect(locator).toHaveClass(expected) failed
  17 | 
  18 |   console.log('-> vérification .project-list')
  19 |   await expect(listing).toHaveCount(1)
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