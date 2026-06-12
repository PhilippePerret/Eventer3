# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/seed-projet-complet.spec.js >> projet seed → "Intrigue principale" dans les brins
- Location: specs/e2e/_tdd/seed-projet-complet.spec.js:14:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.brin-item, [data-type="brin"]').first()
Expected substring: "Intrigue principale"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.brin-item, [data-type="brin"]').first()

```

```yaml
- main:
  - navigation:
    - button "Projet modèle"
    - text: ‹
  - text: Acte I —
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect } from '../__setup__.js'
  2  | import fs from 'node:fs/promises'
  3  | import path from 'node:path'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | test.beforeEach(async ({ page }) => {
  9  |   await fs.rm(dataDir, { recursive: true, force: true })
  10 |   await page.goto('/')
  11 |   await page.waitForLoadState('networkidle')
  12 | })
  13 | 
  14 | test('projet seed → "Intrigue principale" dans les brins', async ({ page }) => {
  15 |   await expect(page.locator('.project-item')).toHaveCount(1)
  16 |   await page.keyboard.press('ArrowRight')
  17 |   await page.waitForLoadState('networkidle')
> 18 |   await expect(page.locator('.brin-item, [data-type="brin"]').first()).toContainText('Intrigue principale')
     |                                                                        ^ Error: expect(locator).toContainText(expected) failed
  19 | })
  20 | 
  21 | test('projet seed → "Votre protagoniste" dans les persos', async ({ page }) => {
  22 |   await expect(page.locator('.project-item')).toHaveCount(1)
  23 |   await page.keyboard.press('ArrowRight')
  24 |   await page.waitForLoadState('networkidle')
  25 |   await expect(page.locator('.perso-item, [data-type="perso"]').first()).toContainText('Votre protagoniste')
  26 | })
  27 | 
```