# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-project-initial-data.spec.js >> un nouveau projet sauvegardé a un personnage "Votre protagoniste"
- Location: specs/e2e/project/new-project-initial-data.spec.js:47:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Liste des projets" [level=1] [ref=e3]
    - generic [ref=e5]: project-a
    - generic [ref=e6]:
      - generic [ref=e7]: eventer-test-1781242845223
      - generic [ref=e8]: ddbb90ef-9f4b-409e-b85d-f8fc07a93080
    - generic [ref=e10]: project-b
    - generic [ref=e12]: project-c
  - generic:
    - generic: DISP MODE PROJECTS
  - contentinfo "Raccourcis clavier" [ref=e13]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { installFixtures } from '../../../helpers/install-fixtures'
  2  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  3  | import { test, expect } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-projects')
  7  | })
  8  | 
  9  | async function createProject(page, expect) {
  10 |   await page.goto('/')
  11 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  12 | 
  13 |   const { folderName } = await setupProjectFolder(page)
  14 |   await page.keyboard.press('n')
  15 |   await createAndSelectFolderInPicker(page, expect, folderName)
  16 |   await page.waitForLoadState('networkidle')
  17 | 
  18 |   const idText = await page.locator('.project-item').nth(1).locator('.project-item__id').textContent()
  19 |   return idText.trim()
  20 | }
  21 | 
  22 | test('un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"', async ({ page }) => {
  23 |   const projectId = await createProject(page, expect)
  24 | 
  25 |   const listerResp = await page.request.get(`/api/items/${projectId}/lister`)
  26 |   expect(listerResp.ok()).toBeTruthy()
  27 |   const listerData = await listerResp.json()
  28 |   expect(listerData.id).toBeTruthy()
  29 | 
  30 |   const itemsResp = await page.request.get(`/api/listers/${listerData.id}/items?project_id=${projectId}`)
  31 |   expect(itemsResp.ok()).toBeTruthy()
  32 |   const items = await itemsResp.json()
  33 |   const eventTitles = Object.values(items).map(i => i.title)
  34 |   expect(eventTitles).toContain('Acte I')
  35 | })
  36 | 
  37 | test('un nouveau projet sauvegardé a un brin "Intrigue principale"', async ({ page }) => {
  38 |   const projectId = await createProject(page, expect)
  39 | 
  40 |   const itemsResp = await page.request.get(`/api/listers/${projectId}-brins/items`)
  41 |   expect(itemsResp.ok()).toBeTruthy()
  42 |   const items = await itemsResp.json()
  43 |   const brinTitles = Object.values(items).map(i => i.title)
  44 |   expect(brinTitles).toContain('Intrigue principale')
  45 | })
  46 | 
  47 | test('un nouveau projet sauvegardé a un personnage "Votre protagoniste"', async ({ page }) => {
  48 |   const projectId = await createProject(page, expect)
  49 | 
  50 |   const itemsResp = await page.request.get(`/api/listers/${projectId}-persos/items`)
> 51 |   expect(itemsResp.ok()).toBeTruthy()
     |                          ^ Error: expect(received).toBeTruthy()
  52 |   const items = await itemsResp.json()
  53 |   const persoTitles = Object.values(items).map(i => i.title)
  54 |   expect(persoTitles).toContain('Votre protagoniste')
  55 | })
  56 | 
```