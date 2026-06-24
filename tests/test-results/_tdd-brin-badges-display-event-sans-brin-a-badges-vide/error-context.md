# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/brin-badges-display.spec.js >> event sans brin a badges vide
- Location: specs/e2e/_tdd/brin-badges-display.spec.js:37:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.project-item').first()
Expected pattern: /selected/
Error: element(s) not found

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').first()

```

```yaml
- main
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/brin-badges-display.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | // Fixture filter-events :
  6  | //   b1 "Amour romantique" badge=AMO
  7  | //   b2 "Intrigue politique" badge=INT
  8  | //   e1 "Scène du bal"    brin_ids: [b1]
  9  | //   e2 "Arrivée à Paris" brin_ids: [b2]
  10 | //   e3 "La trahison"     brin_ids: [b1, b2]
  11 | //   e4 "Retour au bal"   brin_ids: []
  12 | 
  13 | test.beforeEach(() => {
  14 |   installFixtures('filter-events')
  15 | })
  16 | 
  17 | async function enterListerEvent(page) {
  18 |   await page.goto('/')
> 19 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
     |                                                             ^ Error: expect(locator).toHaveClass(expected) failed
  20 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  21 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  22 | }
  23 | 
  24 | test('event avec un brin affiche son badge', async ({ page }) => {
  25 |   await enterListerEvent(page)
  26 |   const e1 = pane1(page).locator('.event-item').nth(0)
  27 |   await expect(e1.locator('.event-brins-marks')).toContainText('AMO')
  28 | })
  29 | 
  30 | test('event avec deux brins affiche les deux badges', async ({ page }) => {
  31 |   await enterListerEvent(page)
  32 |   const e3 = pane1(page).locator('.event-item').nth(2)
  33 |   await expect(e3.locator('.event-brins-marks')).toContainText('AMO')
  34 |   await expect(e3.locator('.event-brins-marks')).toContainText('INT')
  35 | })
  36 | 
  37 | test('event sans brin a badges vide', async ({ page }) => {
  38 |   await enterListerEvent(page)
  39 |   const e4 = pane1(page).locator('.event-item').nth(3)
  40 |   await expect(e4.locator('.event-brins-marks')).toBeEmpty()
  41 | })
  42 | 
```