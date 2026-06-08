# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bootstrap/start-up.spec.js >> l’application démarre correctement
- Location: specs/e2e/bootstrap/start-up.spec.js:9:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    14 × locator resolved to <main id="main-panel"></main>
       - unexpected value ""

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import fs from 'node:fs/promises'
  2  | import path from 'node:path'
  3  | import { test, expect } from '../__setup__.js'
  4  | 
  5  | const appRoot = path.resolve(process.cwd(), '..')
  6  | const dataDir = path.join(appRoot, 'data')
  7  | 
  8  | 
  9  | test('l’application démarre correctement', async ({ page }) => {
  10 |   page.on('pageerror', error => console.error(error))
  11 | 
  12 |   console.log('\n-> destruction du dossier data')
  13 |   await fs.rm(dataDir, { recursive: true, force: true })
  14 | 
  15 |   await page.goto('/')
  16 |   await expect(page.locator('#main-panel')).toHaveCount(1)
> 17 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  18 |   await expect(page.locator('.project-list')).toHaveCount(1)
  19 |   await expect(page.locator('.project-item')).toHaveCount(1)
  20 |   await expect(page.locator('.project-item').nth(0)).toContainText('Projet modèle')
  21 | 
  22 | })
```