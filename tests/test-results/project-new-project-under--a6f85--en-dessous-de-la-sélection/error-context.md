# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-project-under-selection.spec.js >> la touche n crée un nouveau projet vide en dessous de la sélection
- Location: specs/e2e/project/new-project-under-selection.spec.js:10:1

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
  1  | // Origine : tests/specs/e2e/project/new-project-under-selection.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  4  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  5  | 
  6  | test.beforeEach(() => {
  7  |   installFixtures('many-projects')
  8  | })
  9  | 
  10 | test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  11 |   await page.goto('/')
  12 | 
  13 |   const items = pane1(page).locator('.project-item')
  14 | 
> 15 |   await expect(items).toHaveCount(3)
     |                       ^ Error: expect(locator).toHaveCount(expected) failed
  16 | 
  17 |   await press(page, 'ArrowDown')
  18 |   await expect(items.nth(1)).toHaveClass(/selected/)
  19 | 
  20 |   const { folderName } = await setupProjectFolder(page)
  21 | 
  22 |   await press(page, 'n')
  23 |   await createAndSelectFolderInPicker(page, expect, folderName)
  24 |   await page.waitForLoadState('networkidle')
  25 | 
  26 |   // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
  27 |   await expect(items).toHaveCount(4)
  28 |   await expect(items.nth(0)).toContainText('Projet A')
  29 |   await expect(items.nth(1)).toContainText('Projet B')
  30 |   await expect(items.nth(2)).toHaveClass(/selected/)
  31 |   await expect(items.nth(2)).not.toContainText('Projet A')
  32 |   await expect(items.nth(2)).not.toContainText('Projet B')
  33 |   await expect(items.nth(2)).not.toContainText('Projet C')
  34 | })
  35 | 
```