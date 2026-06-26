# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/start-up.spec.js >> l’application démarre correctement
- Location: specs/e2e/_tdd/start-up.spec.js:10:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#projects-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#projects-panel')
    14 × locator resolved to <div class="" id="projects-panel">…</div>
       - unexpected value ""

```

```yaml
- text: Projet modèle --- roman
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/bootstrap/start-up.spec.js
  2  | import fs from 'node:fs/promises'
  3  | import path from 'node:path'
  4  | import { test, expect, pane1 } from '../__setup__.js'
  5  | 
  6  | const appRoot = path.resolve(process.cwd(), '..')
  7  | const dataDir = path.join(appRoot, 'data')
  8  | 
  9  | 
  10 | test('l’application démarre correctement', async ({ page }) => {
  11 |   page.on('pageerror', error => console.error(error))
  12 | 
  13 |   console.log('\n-> destruction du dossier data')
  14 |   await fs.rm(dataDir, { recursive: true, force: true })
  15 | 
  16 |   await page.goto('/')
  17 |   await expect(pane1(page).locator('#projects-panel')).toHaveCount(1)
> 18 |   await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
     |                                                        ^ Error: expect(locator).toHaveClass(expected) failed
  19 |   await expect(pane1(page).locator('.project-list')).toHaveCount(1)
  20 |   await expect(pane1(page).locator('.project-item')).toHaveCount(1)
  21 |   await expect(pane1(page).locator('.project-item').nth(0)).toContainText('Projet modèle')
  22 | 
  23 | })
```