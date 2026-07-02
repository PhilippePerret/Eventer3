# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/new-event-virtual-lister.spec.js >> → sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event
- Location: specs/e2e/event/new-event-virtual-lister.spec.js:9:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('#events-panel')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#events-panel')

```

```yaml
- text: Projet A roman Projet B roman DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/new-event-virtual-lister.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-events')
  7  | })
  8  | 
  9  | test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {
  10 | 
  11 |   await page.goto('/')
  12 | 
  13 | 
  14 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  15 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  16 | 
  17 |   await press(page, 'ArrowDown')
  18 |   await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  19 | 
  20 |   await press(page, 'ArrowRight')
> 21 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  22 | 
  23 |   const firstInput = pane1(page).locator('.event-item [data-field="title"]')
  24 |   await expect(firstInput).toBeVisible()
  25 |   await expect(firstInput).toBeFocused()
  26 | 
  27 |   await firstInput.fill('Mon premier event')
  28 |   await press(page, 'Enter')
  29 |   await page.waitForLoadState('networkidle')
  30 | 
  31 |   await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  32 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
  33 | 
  34 |   const listerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000002/lister')
  35 |   expect(listerResp.ok()).toBeTruthy()
  36 |   const lister = await listerResp.json()
  37 |   expect(lister.item_ids).toHaveLength(1)
  38 |   const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=00000000-0000-0000-0000-000000000002`)
  39 |   expect(itemsResp.ok()).toBeTruthy()
  40 |   const items = await itemsResp.json()
  41 |   expect(items[lister.item_ids[0]].title).toBe('Mon premier event')
  42 | 
  43 | 
  44 |   await press(page, 'n')
  45 |   const secondInput = pane1(page).locator('.event-item [data-field="title"]')
  46 |   await expect(secondInput).toBeVisible()
  47 |   await expect(secondInput).toBeFocused()
  48 | 
  49 |   await secondInput.fill('Mon second event')
  50 |   await press(page, 'Enter')
  51 | 
  52 |   await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  53 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
  54 |   await expect(pane1(page).locator('.event-item').nth(1)).toContainText('Mon second event')
  55 | 
  56 | 
  57 | })
  58 | 
```