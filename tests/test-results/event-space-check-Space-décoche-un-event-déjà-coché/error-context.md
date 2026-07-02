# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/space-check.spec.js >> Space décoche un event déjà coché
- Location: specs/e2e/event/space-check.spec.js:28:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').first().locator('.event-check')
Expected substring: "✓"
Received string:    ""
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').first().locator('.event-check')
    14 × locator resolved to <span class="item-check event-check panel-check"></span>
       - unexpected value ""

```

```yaml
- text: Évènement un — Évènement deux — Évènement trois — DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | async function enterListerEvent(page) {
  9  |   await page.goto('/')
  10 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  11 |   await press(page, 'ArrowRight')
  12 |   await press(page, 'ArrowRight')
  13 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  14 | }
  15 | 
  16 | test('Space coche visuellement l\'event sélectionné', async ({ page }) => {
  17 |   await enterListerEvent(page)
  18 | 
  19 |   const firstEvent = pane1(page).locator('.event-item').nth(0)
  20 |   await expect(firstEvent).toHaveClass(/selected/)
  21 |   await expect(firstEvent.locator('.event-check')).not.toContainText('✓')
  22 | 
  23 |   await press(page, ' ')
  24 | 
  25 |   await expect(firstEvent.locator('.event-check')).toContainText('✓')
  26 | })
  27 | 
  28 | test('Space décoche un event déjà coché', async ({ page }) => {
  29 |   await enterListerEvent(page)
  30 | 
  31 |   const firstEvent = pane1(page).locator('.event-item').nth(0)
  32 |   await press(page, ' ')
> 33 |   await expect(firstEvent.locator('.event-check')).toContainText('✓')
     |                                                    ^ Error: expect(locator).toContainText(expected) failed
  34 | 
  35 |   await press(page, ' ')
  36 |   await expect(firstEvent.locator('.event-check')).not.toContainText('✓')
  37 | })
  38 | 
  39 | test('Space persiste la coche après rechargement', async ({ page }) => {
  40 |   await enterListerEvent(page)
  41 | 
  42 |   const patchDone = page.waitForResponse(r => r.url().includes('/api/items/') && r.request().method() === 'PATCH')
  43 |   await press(page, ' ')
  44 |   const patchResp = await patchDone
  45 |   await page.waitForLoadState('networkidle')
  46 | 
  47 |   // Vérification API directe avant rechargement
  48 |   const itemsResp = await page.request.get('/api/listers/2/items?project_id=00000000-0000-0000-0000-000000000001')
  49 |   const itemsData = await itemsResp.json()
  50 |   const firstEventId = Object.keys(itemsData)[0]
  51 |   const checkedValue = itemsData[firstEventId]?.checked
  52 |   expect(checkedValue, `checked DB après PATCH = ${checkedValue}`).toBeTruthy()
  53 | 
  54 |   await page.reload()
  55 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  56 |   await press(page, 'ArrowRight')
  57 |   await press(page, 'ArrowRight')
  58 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  59 | 
  60 |   const firstEvent = pane1(page).locator('.event-item').nth(0)
  61 |   await expect(firstEvent.locator('.event-check')).toContainText('✓')
  62 | })
  63 | 
```