# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: brin/brin-init.spec.js >> un projet sans brins reçoit automatiquement b1 'Intrigue principale' à l'ouverture du panneau
- Location: specs/e2e/brin/brin-init.spec.js:17:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#main-panel')
Expected pattern: /project-list/
Received string:  ""

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#main-panel')
    9 × locator resolved to <main id="main-panel"></main>
      - unexpected value ""

```

```yaml
- main
- contentinfo "Raccourcis clavier"
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | // fixture many-events : project-a (hl:true, events e1/e2/e3, pas de brins lister)
  5  | 
  6  | test.beforeEach(() => {
  7  |   installFixtures('many-events')
  8  | })
  9  | 
  10 | async function goToEventLister(page) {
  11 |   await page.goto('/')
> 12 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
     |                                             ^ Error: expect(locator).toHaveClass(expected) failed
  13 |   await page.keyboard.press('ArrowRight')
  14 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  15 | }
  16 | 
  17 | test("un projet sans brins reçoit automatiquement b1 'Intrigue principale' à l'ouverture du panneau", async ({ page }) => {
  18 |   await goToEventLister(page)
  19 |   await page.keyboard.press('b')
  20 |   await expect(page.locator('#brin-panel')).toBeVisible()
  21 |   await expect(page.locator('.brin-item')).toHaveCount(1)
  22 |   await expect(page.locator('.brin-item').nth(0).locator('.brin-item__title')).toHaveText('Intrigue principale')
  23 | })
  24 | 
  25 | test("b1 'Intrigue principale' est persisté dans la base de données", async ({ page }) => {
  26 |   await goToEventLister(page)
  27 |   await page.keyboard.press('b')
  28 |   await expect(page.locator('#brin-panel')).toBeVisible()
  29 |   await page.waitForLoadState('networkidle')
  30 | 
  31 |   const eventsListerResp = await page.request.get('/api/items/project-a/lister')
  32 |   expect(eventsListerResp.ok()).toBeTruthy()
  33 |   const eventsLister = await eventsListerResp.json()
  34 |   const brinsListerId = eventsLister.brins_lister_id
  35 |   expect(brinsListerId).toBeTruthy()
  36 | 
  37 |   const itemsResp = await page.request.get(`/api/listers/${brinsListerId}/items`)
  38 |   expect(itemsResp.ok()).toBeTruthy()
  39 |   const items = await itemsResp.json()
  40 |   const intrigue = Object.values(items).find(i => i.title === 'Intrigue principale')
  41 |   expect(intrigue).toBeTruthy()
  42 | })
  43 | 
```