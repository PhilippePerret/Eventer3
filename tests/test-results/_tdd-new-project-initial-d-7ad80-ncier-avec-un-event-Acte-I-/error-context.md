# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-project-initial-data.spec.js >> un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"
- Location: specs/e2e/_tdd/new-project-initial-data.spec.js:21:1

# Error details

```
TypeError: Cannot read properties of null (reading 'id')
```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [ref=f1e1]:
    - main [ref=f1e2]:
      - generic [ref=f1e3]:
        - generic [ref=f1e4]: Projet A
        - generic [ref=f1e5]: "---"
        - generic [ref=f1e6]: roman
      - generic [active] [ref=f1e7]:
        - generic [ref=f1e8]: eventer-test-1782028786353
        - generic [ref=f1e9]: "---"
        - generic [ref=f1e10]: roman
      - generic [ref=f1e11]:
        - generic [ref=f1e12]: Projet B
        - generic [ref=f1e13]: "---"
        - generic [ref=f1e14]: roman
      - generic [ref=f1e15]:
        - generic [ref=f1e16]: Projet C
        - generic [ref=f1e17]: "---"
        - generic [ref=f1e18]: roman
      - generic [ref=f1e19]:
        - generic [ref=f1e20]: Projet caché
        - generic [ref=f1e21]: "---"
        - generic [ref=f1e22]: roman
    - contentinfo "Raccourcis clavier" [ref=f1e23]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  3  | import { test, expect, pane1 } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-projects')
  7  | })
  8  | 
  9  | async function createProject(page, expect) {
  10 |   await page.goto('/')
  11 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  12 | 
  13 |   const { folderName } = await setupProjectFolder(page)
  14 |   await pane1(page).locator('body').press('n')
  15 |   await createAndSelectFolderInPicker(page, expect, folderName)
  16 |   await page.waitForLoadState('networkidle')
  17 | 
  18 |   return await pane1(page).locator('.project-item').nth(1).getAttribute('data-id')
  19 | }
  20 | 
  21 | test('un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"', async ({ page }) => {
  22 |   const projectId = await createProject(page, expect)
  23 | 
  24 |   const listerResp = await page.request.get(`/api/items/${projectId}/lister`)
  25 |   expect(listerResp.ok()).toBeTruthy()
  26 |   const listerData = await listerResp.json()
> 27 |   expect(listerData.id).toBeTruthy()
     |                     ^ TypeError: Cannot read properties of null (reading 'id')
  28 | 
  29 |   const itemsResp = await page.request.get(`/api/listers/${listerData.id}/items?project_id=${projectId}`)
  30 |   expect(itemsResp.ok()).toBeTruthy()
  31 |   const items = await itemsResp.json()
  32 |   const eventTitles = Object.values(items).map(i => i.title)
  33 |   expect(eventTitles).toContain('Acte I')
  34 | })
  35 | 
  36 | test('un nouveau projet sauvegardé a un brin "Intrigue principale"', async ({ page }) => {
  37 |   const projectId = await createProject(page, expect)
  38 | 
  39 |   const itemsResp = await page.request.get(`/api/listers/${projectId}-brins/items`)
  40 |   expect(itemsResp.ok()).toBeTruthy()
  41 |   const items = await itemsResp.json()
  42 |   const brinTitles = Object.values(items).map(i => i.title)
  43 |   expect(brinTitles).toContain('Intrigue principale')
  44 | })
  45 | 
  46 | test('un nouveau projet sauvegardé a un personnage "Votre protagoniste"', async ({ page }) => {
  47 |   const projectId = await createProject(page, expect)
  48 | 
  49 |   const itemsResp = await page.request.get(`/api/listers/${projectId}-persos/items`)
  50 |   expect(itemsResp.ok()).toBeTruthy()
  51 |   const items = await itemsResp.json()
  52 |   const persoTitles = Object.values(items).map(i => i.title)
  53 |   expect(persoTitles).toContain('Votre protagoniste')
  54 | })
  55 | 
```