# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-listing.spec.js >> la liste des projets possède les bonnes classes CSS
- Location: specs/e2e/project/project-listing.spec.js:5:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.project-item')
Expected: 3
Received: 4
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item')
    14 × locator resolved to 4 elements
       - unexpected value "4"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e10]: roman
      - generic [ref=f1e12]:
        - generic [ref=f1e13]: Projet B
        - generic [ref=f1e15]: roman
      - generic [ref=f1e17]:
        - generic [ref=f1e18]: Projet C
        - generic [ref=f1e20]: roman
      - generic [ref=f1e22]:
        - generic [ref=f1e23]: Projet caché
        - generic [ref=f1e25]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e26]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | installFixtures('many-projects')
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test('la liste des projets possède les bonnes classes CSS', async ({ page }) => {
  6  | 
  7  |   await page.goto('/')
  8  | 
  9  |   const mainPanel = pane1(page).locator('#projects-panel')
  10 |   const listing = pane1(page).locator('#projects-panel').first()
  11 |   const item = pane1(page).locator('.project-item')
  12 |   const title = pane1(page).locator('.project-item__title')
  13 | 
  14 |   await expect(mainPanel).toHaveClass(/project-list/)
  15 | 
  16 |   await expect(listing).toHaveCount(1)
  17 | 
> 18 |   await expect(item).toHaveCount(3)
     |                      ^ Error: expect(locator).toHaveCount(expected) failed
  19 | 
  20 |   await expect(title.nth(0)).toContainText('Projet A')
  21 | 
  22 | 
  23 | })
```