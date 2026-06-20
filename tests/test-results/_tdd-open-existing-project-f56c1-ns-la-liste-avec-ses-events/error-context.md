# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/open-existing-project.spec.js >> confirmer l'ouverture : le projet apparaît dans la liste avec ses events
- Location: specs/e2e/_tdd/open-existing-project.spec.js:43:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#main-panel')
Expected pattern: /event-list/
Received string:  "project-list"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#main-panel')
    14 × locator resolved to <main id="main-panel" class="project-list">…</main>
       - unexpected value "project-list"

```

```yaml
- main: Projet A --- roman eventer-test-1781975716582 --- roman eventer-test-1781975716582 --- roman Projet B --- roman Projet C --- roman Projet caché --- roman
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/open-existing-project.spec.js
  2  | import { test, expect, pane1 } from '../__setup__.js'
  3  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  5  | 
  6  | test.beforeEach(() => {
  7  |   installFixtures('many-projects')
  8  | })
  9  | 
  10 | async function createProjectAndGetFolderInfo(page, expect) {
  11 |   await page.goto('/')
  12 |   const { folderName, workDir } = await setupProjectFolder(page)
  13 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  14 |   await pane1(page).locator('.project-item.selected').press('n')
  15 |   await createAndSelectFolderInPicker(page, expect, folderName)
  16 |   await page.waitForLoadState('networkidle')
  17 |   return { folderName, workDir }
  18 | }
  19 | 
  20 | async function tryPickExistingFolder(page, expect, workDir) {
  21 |   await page.request.patch('/api/settings/last_path', {
  22 |     headers: { 'Content-Type': 'application/json' },
  23 |     data: JSON.stringify({ value: workDir })
  24 |   })
  25 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  26 |   await pane1(page).locator('.project-item.selected').press('n')
  27 |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  28 |   await pane1(page).locator('.file-picker').press('Enter')
  29 | }
  30 | 
  31 | // ─────────────────────────────────────────────────────────────────────────────
  32 | 
  33 | test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  34 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  35 | 
  36 |   await page.goto('/')
  37 |   await tryPickExistingFolder(page, expect, workDir)
  38 | 
  39 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  40 |   await expect(pane1(page).locator('.confirm-dialog')).toContainText('projet')
  41 | })
  42 | 
  43 | test('confirmer l\'ouverture : le projet apparaît dans la liste avec ses events', async ({ page }) => {
  44 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  45 | 
  46 |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  47 | 
  48 |   await page.goto('/')
  49 |   await tryPickExistingFolder(page, expect, workDir)
  50 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  51 | 
  52 |   await pane1(page).locator('.confirm-dialog').press('Enter')
  53 |   await page.waitForLoadState('networkidle')
  54 | 
  55 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  56 | 
  57 |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
> 58 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/event-list/)
     |                                                    ^ Error: expect(locator).toHaveClass(expected) failed
  59 | 
  60 |   await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  61 |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
  62 | })
  63 | 
  64 | test('annuler : aucun projet créé', async ({ page }) => {
  65 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  66 | 
  67 |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  68 | 
  69 |   await page.goto('/')
  70 |   await tryPickExistingFolder(page, expect, workDir)
  71 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  72 | 
  73 |   await pane1(page).locator('.confirm-dialog').press('Tab')
  74 |   await pane1(page).locator('.confirm-dialog').press('Enter')
  75 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  76 | 
  77 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
  78 | })
  79 | 
  80 | test('persistance : le projet survit au rechargement', async ({ page }) => {
  81 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  82 | 
  83 |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  84 | 
  85 |   await page.goto('/')
  86 |   await tryPickExistingFolder(page, expect, workDir)
  87 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  88 |   await pane1(page).locator('.confirm-dialog').press('Enter')
  89 |   await page.waitForLoadState('networkidle')
  90 | 
  91 |   await page.reload()
  92 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  93 | })
  94 | 
```