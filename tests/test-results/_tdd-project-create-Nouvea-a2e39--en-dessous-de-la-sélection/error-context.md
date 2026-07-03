# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-create.spec.js >> Nouveau projet sous la sélection >> la touche n crée un nouveau projet vide en dessous de la sélection
- Location: specs/e2e/_tdd/project-create.spec.js:15:3

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
        - generic [ref=f1e11]: roman
      - generic [ref=f1e13]:
        - generic [ref=f1e14]: Projet B
        - generic [ref=f1e17]: roman
      - generic [ref=f1e19]:
        - generic [ref=f1e20]: Projet C
        - generic [ref=f1e23]: roman
      - generic [ref=f1e25]:
        - generic [ref=f1e26]: Projet caché
        - generic [ref=f1e29]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e30]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Origine : tests/specs/e2e/project/new-project-*.spec.js + new-event-virtual-lister.spec.js
  2   | import fs from 'node:fs'
  3   | import path from 'node:path'
  4   | import os from 'node:os'
  5   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  6   | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  7   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  8   | 
  9   | // ─── Nouveau projet sous la sélection ─────────────────────────────────────────
  10  | 
  11  | test.describe('Nouveau projet sous la sélection', () => {
  12  | 
  13  |   test.beforeEach(() => installFixtures('many-projects'))
  14  | 
  15  |   test('la touche n crée un nouveau projet vide en dessous de la sélection', async ({ page }) => {
  16  |     await page.goto('/')
  17  | 
  18  |     const items = pane1(page).locator('.project-item')
  19  | 
> 20  |     await expect(items).toHaveCount(3)
      |                         ^ Error: expect(locator).toHaveCount(expected) failed
  21  | 
  22  |     await press(page, 'ArrowDown')
  23  |     await expect(items.nth(1)).toHaveClass(/selected/)
  24  | 
  25  |     const { folderName } = await setupProjectFolder(page)
  26  | 
  27  |     await press(page, 'n')
  28  |     await createAndSelectFolderInPicker(page, expect, folderName)
  29  |     await page.waitForLoadState('networkidle')
  30  | 
  31  |     // Nouveau projet inséré en dessous de la sélection (index 1) → index 2
  32  |     await expect(items).toHaveCount(4)
  33  |     await expect(items.nth(0)).toContainText('Projet A')
  34  |     await expect(items.nth(1)).toContainText('Projet B')
  35  |     await expect(items.nth(2)).toHaveClass(/selected/)
  36  |     await expect(items.nth(2)).not.toContainText('Projet A')
  37  |     await expect(items.nth(2)).not.toContainText('Projet B')
  38  |     await expect(items.nth(2)).not.toContainText('Projet C')
  39  |   })
  40  | 
  41  | })
  42  | 
  43  | // ─── Données initiales ─────────────────────────────────────────────────────────
  44  | 
  45  | test.describe("Données initiales d'un nouveau projet", () => {
  46  | 
  47  |   test.beforeEach(() => installFixtures('many-projects'))
  48  | 
  49  |   async function createProject(page, expect) {
  50  |     await page.goto('/')
  51  |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  52  | 
  53  |     const { folderName } = await setupProjectFolder(page)
  54  |     await press(page, 'n')
  55  |     await createAndSelectFolderInPicker(page, expect, folderName)
  56  |     await page.waitForLoadState('networkidle')
  57  | 
  58  |     return await pane1(page).locator('.project-item').nth(1).getAttribute('data-id')
  59  |   }
  60  | 
  61  |   test('un nouveau projet sauvegardé a un évènemencier avec un event "Acte I"', async ({ page }) => {
  62  |     const projectId = await createProject(page, expect)
  63  | 
  64  |     const listerResp = await page.request.get(`/api/items/${projectId}/lister`)
  65  |     expect(listerResp.ok()).toBeTruthy()
  66  |     const listerData = await listerResp.json()
  67  |     expect(listerData.id).toBeTruthy()
  68  | 
  69  |     const itemsResp = await page.request.get(`/api/listers/${listerData.id}/items?project_id=${projectId}`)
  70  |     expect(itemsResp.ok()).toBeTruthy()
  71  |     const items = await itemsResp.json()
  72  |     const eventTitles = Object.values(items).map(i => i.title)
  73  |     expect(eventTitles).toContain('Acte I')
  74  |   })
  75  | 
  76  |   test('un nouveau projet sauvegardé a un brin "Intrigue principale"', async ({ page }) => {
  77  |     const projectId = await createProject(page, expect)
  78  | 
  79  |     const itemsResp = await page.request.get(`/api/listers/${projectId}-brins/items`)
  80  |     expect(itemsResp.ok()).toBeTruthy()
  81  |     const items = await itemsResp.json()
  82  |     const brinTitles = Object.values(items).map(i => i.title)
  83  |     expect(brinTitles).toContain('Intrigue principale')
  84  |   })
  85  | 
  86  |   test('un nouveau projet sauvegardé a un personnage "Votre protagoniste"', async ({ page }) => {
  87  |     const projectId = await createProject(page, expect)
  88  | 
  89  |     const itemsResp = await page.request.get(`/api/listers/${projectId}-persos/items`)
  90  |     expect(itemsResp.ok()).toBeTruthy()
  91  |     const items = await itemsResp.json()
  92  |     const persoTitles = Object.values(items).map(i => i.title)
  93  |     expect(persoTitles).toContain('Votre protagoniste')
  94  |   })
  95  | 
  96  | })
  97  | 
  98  | // ─── Dialog eventer.db existant ───────────────────────────────────────────────
  99  | // Scénario : dossier créé manuellement contenant un eventer.db vide
  100 | 
  101 | test.describe('Nouveau projet — dialog eventer.db existant (dossier manuel)', () => {
  102 | 
  103 |   test.beforeEach(() => installFixtures('many-projects'))
  104 | 
  105 |   async function setupFolderWithDb(page) {
  106 |     const workDir  = path.join(os.tmpdir(), `eventer-test-${Date.now()}`)
  107 |     const folder   = path.join(workDir, 'projet-existant')
  108 |     fs.mkdirSync(folder, { recursive: true })
  109 |     fs.writeFileSync(path.join(folder, 'eventer.db'), '')
  110 | 
  111 |     await page.request.patch('/api/settings/last_path', {
  112 |       headers: { 'Content-Type': 'application/json' },
  113 |       data: JSON.stringify({ value: workDir })
  114 |     })
  115 |     return { workDir, folder }
  116 |   }
  117 | 
  118 |   async function openPickerAndSelectFolder(page) {
  119 |     await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  120 |     await press(page, 'n')
```