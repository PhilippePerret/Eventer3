# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-listing-content.spec.js >> la liste affiche uniquement les projets actifs
- Location: specs/e2e/project/project-listing-content.spec.js:6:1

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
  3  | 
  4  | import { test, expect, pane1 } from '../__setup__.js'
  5  | 
  6  | test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  7  | 
  8  |   await page.goto('/')
  9  | 
> 10 |   await expect(pane1(page).locator('.project-item')).toHaveCount(3)
     |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  11 | 
  12 |   await expect(pane1(page).locator('text=Projet A')).toBeVisible()
  13 |   await expect(pane1(page).locator('text=Projet B')).toBeVisible()
  14 |   await expect(pane1(page).locator('text=Projet C')).toBeVisible()
  15 | 
  16 |   await expect(pane1(page).locator('text=Projet caché')).toHaveCount(0)
  17 | 
  18 | })
```