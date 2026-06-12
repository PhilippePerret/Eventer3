# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: event/new-event-virtual-lister.spec.js >> → sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event
- Location: specs/e2e/event/new-event-virtual-lister.spec.js:8:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.event-item input[name="title"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.event-item input[name="title"]')

```

```yaml
- main:
  - navigation:
    - button
    - text: ‹
- text: DISP MODE NESTING
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { test, expect } from '../__setup__.js'
  3  | 
  4  | test.beforeEach(() => {
  5  |   installFixtures('many-events')
  6  | })
  7  | 
  8  | test("→ sur un projet sans lister : crée l'éditeur, Enter confirme, n crée un second event", async ({ page }) => {
  9  | 
  10 |   await page.goto('/')
  11 | 
  12 |   console.log('\n=== TEST PREMIER EVENT + SECOND EVENT ===')
  13 | 
  14 |   console.log('-> attente du rendu initial')
  15 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  16 |   await expect(page.locator('.project-item').nth(0)).toHaveClass(/selected/)
  17 | 
  18 |   console.log('-> sélection du projet sans lister (project-b)')
  19 |   await page.keyboard.press('ArrowDown')
  20 |   await expect(page.locator('.project-item').nth(1)).toHaveClass(/selected/)
  21 | 
  22 |   console.log('-> flèche → : entre dans le EventLister vide')
  23 |   await page.keyboard.press('ArrowRight')
  24 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  25 | 
  26 |   console.log('-> vérification : un éditeur est apparu automatiquement')
  27 |   const firstInput = page.locator('.event-item input[name="title"]')
> 28 |   await expect(firstInput).toBeVisible()
     |                            ^ Error: expect(locator).toBeVisible() failed
  29 |   await expect(firstInput).toBeFocused()
  30 | 
  31 |   console.log('-> saisie du premier event et validation')
  32 |   await page.keyboard.type('Mon premier event')
  33 | 
  34 |   const savePromise = page.waitForResponse(resp =>
  35 |     resp.url().includes('/api/listers/') && resp.request().method() === 'PATCH'
  36 |   )
  37 |   await page.keyboard.press('Enter')
  38 |   await savePromise
  39 | 
  40 |   console.log('-> vérification : le premier event est créé dans le DOM')
  41 |   await expect(page.locator('.event-item')).toHaveCount(1)
  42 |   await expect(page.locator('.event-item').nth(0)).toContainText('Mon premier event')
  43 | 
  44 |   console.log('-> vérification : données persistées sur le serveur')
  45 |   const listerResp = await page.request.get('/api/items/project-b/lister')
  46 |   expect(listerResp.ok()).toBeTruthy()
  47 |   const lister = await listerResp.json()
  48 |   expect(lister.item_ids).toHaveLength(1)
  49 |   const itemsResp = await page.request.get(`/api/listers/${lister.id}/items?project_id=project-b`)
  50 |   expect(itemsResp.ok()).toBeTruthy()
  51 |   const items = await itemsResp.json()
  52 |   expect(items[lister.item_ids[0]].title).toBe('Mon premier event')
  53 | 
  54 |   console.log('-> vérification : project-b a maintenant un lister')
  55 | 
  56 |   console.log('-> appui sur n : doit créer un second event en dessous')
  57 |   await page.keyboard.press('n')
  58 |   const secondInput = page.locator('.event-item input[name="title"]')
  59 |   await expect(secondInput).toBeVisible()
  60 |   await expect(secondInput).toBeFocused()
  61 | 
  62 |   await page.keyboard.type('Mon second event')
  63 |   await page.keyboard.press('Enter')
  64 | 
  65 |   console.log('-> vérification : deux events dans le bon ordre')
  66 |   await expect(page.locator('.event-item')).toHaveCount(2)
  67 |   await expect(page.locator('.event-item').nth(0)).toContainText('Mon premier event')
  68 |   await expect(page.locator('.event-item').nth(1)).toContainText('Mon second event')
  69 | 
  70 |   console.log('\n=== FIN TEST ===\n')
  71 | 
  72 | })
  73 | 
```