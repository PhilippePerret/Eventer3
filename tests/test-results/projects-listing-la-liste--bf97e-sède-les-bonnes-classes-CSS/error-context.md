# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/projects-listing.spec.js:3:6

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /projects-listing/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main id="main-panel">…</main>
       - unexpected value ""

```

```yaml
- main: Projet modèle
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.only('la liste des projets possède les bonnes classes CSS', async ({ page }) => {
  4  | 
  5  |   console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')
  6  | 
  7  |   await page.goto('/')
  8  | 
  9  |   const mainPanel = page.locator('#main-panel')
  10 |   const listing   = page.locator('.project-listing')
  11 |   const item      = page.locator('.project-listing__item')
  12 |   const title     = page.locator('.project-listing__title')
  13 |   const pid       = page.locator('.project-listing__id')
  14 | 
  15 |   console.log('-> vérification #main-panel.projects-listing')
  16 | 
> 17 |   await expect(mainPanel).toHaveClass(/projects-listing/)
     |                           ^ Error: expect(locator).toHaveClass(expected) failed
  18 | 
  19 |   console.log('-> OK')
  20 | 
  21 |   console.log('-> vérification .project-listing')
  22 | 
  23 |   await expect(listing).toHaveCount(1)
  24 | 
  25 |   console.log('-> OK')
  26 | 
  27 |   console.log('-> vérification .project-listing__item')
  28 | 
  29 |   await expect(item).toHaveCount(1)
  30 | 
  31 |   console.log('-> OK')
  32 | 
  33 |   console.log('-> vérification .project-listing__title')
  34 | 
  35 |   await expect(title).toContainText('Projet modèle')
  36 | 
  37 |   console.log('-> OK')
  38 | 
  39 |   console.log('-> vérification .project-listing__id')
  40 | 
  41 |   await expect(pid).toContainText('demo')
  42 | 
  43 |   console.log('-> OK')
  44 | 
  45 |   console.log(
  46 |     '\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n'
  47 |   )
  48 | 
  49 | })
```