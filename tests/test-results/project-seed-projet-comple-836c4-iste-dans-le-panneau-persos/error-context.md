# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/seed-projet-complet.spec.js >> projet seed → "Votre protagoniste" dans le panneau persos
- Location: specs/e2e/project/seed-projet-complet.spec.js:22:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.perso-item__title').first()
Expected substring: "Votre protagoniste"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.perso-item__title').first()

```

```yaml
- text: Acte I — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  2  | import fs from 'node:fs/promises'
  3  | import path from 'node:path'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | test.beforeEach(async ({ page }) => {
  9  |   await fs.rm(dataDir, { recursive: true, force: true })
  10 |   await page.goto('/')
  11 |   await expect(pane1(page).locator('.project-item')).toHaveCount(1)
  12 | })
  13 | 
  14 | test('projet seed → "Intrigue principale" dans le panneau brins', async ({ page }) => {
  15 |   await press(page, 'ArrowRight')
  16 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  17 |   await press(page, 'b')
  18 |   await expect(pane1(page).locator('#brins-panel')).toBeVisible()
  19 |   await expect(pane1(page).locator('.brin-item').first()).toContainText('Intrigue principale')
  20 | })
  21 | 
  22 | test('projet seed → "Votre protagoniste" dans le panneau persos', async ({ page }) => {
  23 |   await press(page, 'ArrowRight')
  24 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  25 |   await press(page, 'p')
  26 |   await expect(pane1(page).locator('#persos-panel')).toBeVisible()
> 27 |   await expect(pane1(page).locator('.perso-item__title').first()).toContainText('Votre protagoniste')
     |                                                                   ^ Error: expect(locator).toContainText(expected) failed
  28 | })
  29 | 
```