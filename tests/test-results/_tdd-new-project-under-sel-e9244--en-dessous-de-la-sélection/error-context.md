# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-project-under-selection.spec.js >> la touche n crée un nouveau projet vide en dessous de la sélection
- Location: specs/e2e/_tdd/new-project-under-selection.spec.js:7:1

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
    - main [ref=f1e2]:
      - generic [active] [ref=f1e3]:
        - generic [ref=f1e4]: Projet A
        - generic [ref=f1e5]: "---"
        - generic [ref=f1e6]: roman
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet B
        - generic [ref=f1e9]: "---"
        - generic [ref=f1e10]: roman
      - generic [ref=f1e11]:
        - generic [ref=f1e12]: Projet C
        - generic [ref=f1e13]: "---"
        - generic [ref=f1e14]: roman
      - generic [ref=f1e15]:
        - generic [ref=f1e16]: Projet caché
        - generic [ref=f1e17]: "---"
        - generic [ref=f1e18]: roman
    - contentinfo "Raccourcis clavier" [ref=f1e19]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  3  | installFixtures('many-projects')
  4  | 
  5  | import { test, expect, pane1 } from '../__setup__.js'
  6  | 
  7  | test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  8  |   await page.goto('/')
  9  | 
  10 |   const items = pane1(page).locator('.project-item')
  11 | 
> 12 |   await expect(items).toHaveCount(3)
     |                       ^ Error: expect(locator).toHaveCount(expected) failed
  13 | 
  14 |   await pane1(page).locator('body').press('ArrowDown')
  15 |   await expect(items.nth(1)).toHaveClass(/selected/)
  16 | 
  17 |   const { folderName } = await setupProjectFolder(page)
  18 | 
  19 |   await pane1(page).locator('body').press('n')
  20 |   await createAndSelectFolderInPicker(page, expect, folderName)
  21 |   await page.waitForLoadState('networkidle')
  22 | 
  23 |   // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
  24 |   await expect(items).toHaveCount(4)
  25 |   await expect(items.nth(0)).toContainText('Projet A')
  26 |   await expect(items.nth(1)).toContainText('Projet B')
  27 |   await expect(items.nth(2)).toHaveClass(/selected/)
  28 |   await expect(items.nth(2)).not.toContainText('Projet A')
  29 |   await expect(items.nth(2)).not.toContainText('Projet B')
  30 |   await expect(items.nth(2)).not.toContainText('Projet C')
  31 | })
  32 | 
```