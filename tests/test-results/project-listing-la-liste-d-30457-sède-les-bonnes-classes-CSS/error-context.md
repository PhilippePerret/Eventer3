# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/project-listing.spec.js:5:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.project-item__title').first()
Expected substring: "Projet A"
Received string:    ""
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item__title').first()
    14 × locator resolved to <span class="project-item__title"></span>
       - unexpected value ""

```

```yaml
- main:
  - heading "Liste des projets" [level=1]
  - text: project-a project-b project-c
- text: DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | import { test, expect } from './__setup__.js'
  4  | 
  5  | test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {
  6  | 
  7  |   await page.goto('/')
  8  | 
  9  |   const mainPanel = page.locator('#main-panel')
  10 |   const listing = page.locator('#main-panel.project-list').first()
  11 |   const item = page.locator('.project-item')
  12 |   const title = page.locator('.project-item__title')
  13 |   const pid = page.locator('.project-item__id')
  14 | 
  15 |   console.log('\n=== TEST CLASSES CSS PROJECT LISTING ===')
  16 | 
  17 |   console.log('-> vérification #main-panel.project-list')
  18 |   await expect(mainPanel).toHaveClass(/project-list/)
  19 | 
  20 |   console.log('-> vérification .project-list')
  21 |   await expect(listing).toHaveCount(1)
  22 | 
  23 |   console.log('-> vérification .project-item')
  24 |   await expect(item).toHaveCount(3)
  25 | 
  26 |   console.log('-> vérification .project-item__title')
> 27 |   await expect(title.nth(0)).toContainText('Projet A')
     |                              ^ Error: expect(locator).toContainText(expected) failed
  28 | 
  29 |   console.log('-> vérification .project-item__id')
  30 |   await expect(pid.nth(0)).toContainText('project-a')
  31 | 
  32 |   console.log('\n=== FIN TEST CLASSES CSS PROJECT LISTING ===\n')
  33 | 
  34 | })
```