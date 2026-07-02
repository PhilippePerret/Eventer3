# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: item/new-item-deselects-current.spec.js >> la touche n désélectionne l'item courant
- Location: specs/e2e/item/new-item-deselects-current.spec.js:7:1

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.project-item').first()
Expected pattern: not /selected/
Received string: "project-item selected"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').first()
    14 × locator resolved to <div tabindex="-1" class="project-item selected" data-id="00000000-0000-0000-0000-000000000001">…</div>
       - unexpected value "project-item selected"

```

```yaml
- text: Projet A roman
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  3  | installFixtures('many-projects')
  4  | 
  5  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  6  | 
  7  | test("la touche n désélectionne l'item courant", async ({ page }) => {
  8  | 
  9  |   await page.goto('/')
  10 | 
  11 |   const items = pane1(page).locator('.project-item')
  12 | 
  13 | 
  14 |   await expect(items.nth(0)).toHaveClass(/selected/)
  15 | 
  16 |   const { folderName } = await setupProjectFolder(page)
  17 | 
  18 |   await press(page, 'n')
  19 |   await createAndSelectFolderInPicker(page, expect, folderName)
  20 |   await page.waitForLoadState('networkidle')
  21 | 
> 22 |   await expect(items.nth(0)).not.toHaveClass(/selected/)
     |                                  ^ Error: expect(locator).not.toHaveClass(expected) failed
  23 | 
  24 |   await expect(items.nth(1)).toHaveClass(/selected/)
  25 | 
  26 | 
  27 | })
  28 | 
```