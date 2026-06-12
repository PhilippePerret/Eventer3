# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: new-project-under-selection.spec.js >> la touche n crée un nouveau projet vide en dessous de la sélection
- Location: specs/e2e/new-project-under-selection.spec.js:7:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.project-item').first()
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 4

- Projet A
+
+       
+       project-a
+     

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.project-item').first()
    14 × locator resolved to <div data-id="project-a" class="item project-item">…</div>
       - unexpected value "
      
      project-a
    "

```

```yaml
- text: project-a
```

# Test source

```ts
  1  | import { installFixtures } from '../../helpers/install-fixtures'
  2  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../helpers/create-project-helper.js'
  3  | installFixtures('many-projects')
  4  | 
  5  | import { test, expect } from './__setup__.js'
  6  | 
  7  | test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  8  |   await page.goto('/')
  9  | 
  10 |   const items = page.locator('.project-item')
  11 | 
  12 |   await expect(items).toHaveCount(3)
  13 | 
  14 |   await page.keyboard.press('ArrowDown')
  15 |   await expect(items.nth(1)).toHaveClass(/selected/)
  16 | 
  17 |   const { folderName } = await setupProjectFolder(page)
  18 | 
  19 |   await page.keyboard.press('n')
  20 |   await createAndSelectFolderInPicker(page, expect, folderName)
  21 |   await page.waitForLoadState('networkidle')
  22 | 
  23 |   // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
  24 |   await expect(items).toHaveCount(4)
> 25 |   await expect(items.nth(0)).toContainText('Projet A')
     |                              ^ Error: expect(locator).toContainText(expected) failed
  26 |   await expect(items.nth(1)).toContainText('Projet B')
  27 |   await expect(items.nth(2)).toHaveClass(/selected/)
  28 |   await expect(items.nth(2)).not.toContainText('Projet A')
  29 |   await expect(items.nth(2)).not.toContainText('Projet B')
  30 |   await expect(items.nth(2)).not.toContainText('Projet C')
  31 | })
  32 | 
```