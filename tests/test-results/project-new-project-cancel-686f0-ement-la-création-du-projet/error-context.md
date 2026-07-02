# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-project-cancelled.spec.js >> la touche Escape après n annule complètement la création du projet
- Location: specs/e2e/project/new-project-cancelled.spec.js:8:1

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
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-projects')
  6  | })
  7  | 
  8  | test('la touche Escape après n annule complètement la création du projet', async ({ page }) => {
  9  | 
  10 |   await page.goto('/')
  11 | 
  12 |   const items = pane1(page).locator('.project-item')
  13 | 
> 14 |   await expect(items).toHaveCount(3)
     |                       ^ Error: expect(locator).toHaveCount(expected) failed
  15 |   await expect(items.nth(0)).toHaveClass(/selected/)
  16 |   await expect(items.nth(1)).not.toHaveClass(/selected/)
  17 |   await expect(items.nth(2)).not.toHaveClass(/selected/)
  18 | 
  19 |   const beforeResp = await page.request.get('/api/listers/1')
  20 |   const before = await beforeResp.json()
  21 | 
  22 |   await press(page, 'n')
  23 | 
  24 |   await press(page, 'Escape')
  25 | 
  26 |   await expect(items).toHaveCount(3)
  27 |   await expect(pane1(page).locator('input:not(#filter-input):not(.panel-search)')).toHaveCount(0)
  28 |   await expect(items.nth(0)).toHaveClass(/selected/)
  29 |   await expect(items.nth(1)).not.toHaveClass(/selected/)
  30 |   await expect(items.nth(2)).not.toHaveClass(/selected/)
  31 | 
  32 |   const afterResp = await page.request.get('/api/listers/1')
  33 |   const after = await afterResp.json()
  34 |   expect(after.item_ids).toEqual(before.item_ids)
  35 | 
  36 | })
  37 | 
```