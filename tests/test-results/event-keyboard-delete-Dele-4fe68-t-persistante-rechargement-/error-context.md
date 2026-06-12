# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/keyboard-delete.spec.js >> Delete dans EventLister >> la suppression de l'event est persistante (rechargement)
- Location: specs/e2e/event/keyboard-delete.spec.js:22:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.event-item')
Expected: 2
Received: 3
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.event-item')
    14 × locator resolved to 3 elements
       - unexpected value "3"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - navigation [ref=e3]:
      - button [ref=e4] [cursor=pointer]
      - generic [ref=e5]: ‹
    - generic [ref=e8]:
      - generic [ref=e10]: Évènement un
      - generic [ref=e12]: —
    - generic [ref=e15]:
      - generic [ref=e17]: Évènement deux
      - generic [ref=e19]: —
    - generic [ref=e22]:
      - generic [ref=e24]: Évènement trois
      - generic [ref=e26]: —
  - generic:
    - generic: DISP MODE NESTING
  - contentinfo "Raccourcis clavier" [ref=e27]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | // ─── EVENTS ────────────────────────────────────────────────────────────────
  5  | // many-events : project-a (hl:true, events e1/e2/e3), project-b
  6  | 
  7  | test.describe('Delete dans EventLister', () => {
  8  | 
  9  |   test.beforeEach(() => installFixtures('many-events'))
  10 | 
  11 |   test('Delete supprime l\'event sélectionné dans un EventLister', async ({ page }) => {
  12 |     await page.goto('/')
  13 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  14 |     await page.keyboard.press('ArrowRight')
  15 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  16 |     const items = page.locator('.event-item')
  17 |     const initialCount = await items.count()
  18 |     await page.keyboard.press('Delete')
  19 |     await expect(items).toHaveCount(initialCount - 1)
  20 |   })
  21 | 
  22 |   test('la suppression de l\'event est persistante (rechargement)', async ({ page }) => {
  23 |     await page.goto('/')
  24 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  25 |     await page.keyboard.press('ArrowRight')
  26 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  27 |     const items = page.locator('.event-item')
  28 |     const initialCount = await items.count()
  29 |     await page.keyboard.press('Delete')
  30 |     await expect(items).toHaveCount(initialCount - 1)
  31 |     await page.waitForLoadState('networkidle')
  32 |     await page.reload()
  33 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  34 |     await page.keyboard.press('ArrowRight')
  35 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
> 36 |     await expect(items).toHaveCount(initialCount - 1)
     |                         ^ Error: expect(locator).toHaveCount(expected) failed
  37 |   })
  38 | 
  39 |   test('l\'aide contextuelle mentionne ⌦ dans un EventLister avec plusieurs events', async ({ page }) => {
  40 |     await page.goto('/')
  41 |     await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  42 |     await page.keyboard.press('ArrowRight')
  43 |     await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  44 |     await page.keyboard.press('Meta+?')
  45 |     await expect(page.locator('.contextual-help')).toContainText('⌦')
  46 |     await page.keyboard.press('Escape')
  47 |   })
  48 | 
  49 | })
  50 | 
```