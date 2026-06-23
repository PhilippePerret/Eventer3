# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-event-virtual-lister.spec.js >> → sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event
- Location: specs/e2e/_tdd/new-event-virtual-lister.spec.js:9:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.event-item').first()
Expected substring: "Mon premier event"
Received string:    "Mo premier evet—------"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.event-item').first()
    - locator resolved to <div data-id="e1" tabindex="-1" class="event-item selected">…</div>
    13 × unexpected value "Mo premier evet—------"
       - locator resolved to <div data-id="e1" tabindex="-1" class="event-item">…</div>
    - unexpected value "Mo premier evet—------"

```

```yaml
- text: Mo premier evet — --- ---
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/event/new-event-virtual-lister.spec.js
  2  | import { installFixtures } from '../../../helpers/install-fixtures'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-events')
  7  | })
  8  | 
  9  | test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {
  10 | 
  11 |   await page.goto('/')
  12 | 
  13 |   console.log('\n=== TEST PREMIER EVENT + SECOND EVENT ===')
  14 | 
  15 |   console.log('-> attente du rendu initial')
  16 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  17 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  18 | 
  19 |   console.log('-> sélection du projet sans lister (project-b)')
  20 |   await pane1(page).locator('#main-panel').press('ArrowDown')
  21 |   await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  22 | 
  23 |   console.log('-> flèche → : entre dans le EventLister vide')
  24 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  25 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
  26 | 
  27 |   console.log('-> vérification : un éditeur est apparu automatiquement')
  28 |   const firstInput = pane1(page).locator('.event-item [data-field="title"]')
  29 |   await expect(firstInput).toBeVisible()
  30 |   await expect(firstInput).toBeFocused()
  31 | 
  32 |   console.log('-> saisie du premier event et validation')
  33 |   await page.keyboard.type('Mon premier event')
  34 | 
  35 |   const savePromise = page.waitForResponse(resp =>
  36 |     resp.url().includes('/api/listers/') && resp.request().method() === 'PATCH'
  37 |   )
  38 |   await pane1(page).locator('.event-item.selected').press('Enter')
  39 |   await savePromise
  40 | 
  41 |   console.log('-> vérification : le premier event est créé dans le DOM')
  42 |   await expect(pane1(page).locator('.event-item')).toHaveCount(1)
> 43 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
     |                                                           ^ Error: expect(locator).toContainText(expected) failed
  44 | 
  45 |   console.log('-> vérification : données persistées sur le serveur')
  46 |   const listerResp = await page.request.get('/api/items/00000000-0000-0000-0000-000000000002/lister')
  47 |   expect(listerResp.ok()).toBeTruthy()
  48 |   const lister = await listerResp.json()
  49 |   expect(lister.item_ids).toHaveLength(1)
  50 |   const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=00000000-0000-0000-0000-000000000002`)
  51 |   expect(itemsResp.ok()).toBeTruthy()
  52 |   const items = await itemsResp.json()
  53 |   expect(items[lister.item_ids[0]].title).toBe('Mon premier event')
  54 | 
  55 |   console.log('-> vérification : project-b a maintenant un lister')
  56 | 
  57 |   console.log('-> appui sur n : doit créer un second event en dessous')
  58 |   await pane1(page).locator('#main-panel').press('n')
  59 |   const secondInput = pane1(page).locator('.event-item [data-field="title"]')
  60 |   await expect(secondInput).toBeVisible()
  61 |   await expect(secondInput).toBeFocused()
  62 | 
  63 |   await page.keyboard.type('Mon second event')
  64 |   await pane1(page).locator('.event-item.selected').press('Enter')
  65 | 
  66 |   console.log('-> vérification : deux events dans le bon ordre')
  67 |   await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  68 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Mon premier event')
  69 |   await expect(pane1(page).locator('.event-item').nth(1)).toContainText('Mon second event')
  70 | 
  71 |   console.log('\n=== FIN TEST ===\n')
  72 | 
  73 | })
  74 | 
```