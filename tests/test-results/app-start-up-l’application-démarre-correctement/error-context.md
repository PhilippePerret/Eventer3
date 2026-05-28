# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app/start-up.spec.js >> l’application démarre correctement
- Location: specs/e2e/app/start-up.spec.js:3:6

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
  1  | import { test, expect } from '../../e2e/__setup__.js'
  2  | 
  3  | test.only('l’application démarre correctement', async ({ page }) => {
  4  |   page.on('pageerror', error => console.error(error))
  5  |   await page.goto('/')
  6  |   await expect(page.locator('#main-panel')).toHaveCount(1)
> 7  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  8  |   await expect(page.locator('.project-list')).toHaveCount(1)
  9  |   await expect(page.locator('.project-item')).toHaveCount(3)
  10 |   await expect(page.locator('.project-item').nth(0)).toContainText('Projet A')
  11 |   await expect(page.locator('.project-item').nth(1)).toContainText('Projet B')
  12 |   await expect(page.locator('.project-item').nth(2)).toContainText('Projet C')
  13 | })
```