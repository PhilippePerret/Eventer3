# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/open-existing-project.spec.js >> confirmer l'ouverture : le projet apparaît dans la liste avec ses events
- Location: specs/e2e/project/open-existing-project.spec.js:41:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.confirm-dialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.confirm-dialog')

```

```yaml
- main:
  - heading "Liste des projets" [level=1]
  - text: project-a eventer-test-1781242853165 ad16237b-85d8-40e7-91de-4738f2554351 project-b project-c eventer-test-1781242853165 a05960ff-a0af-4457-b277-bf9f2e4a5361
- text: DISP MODE PROJECTS
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import { test, expect } from '../__setup__.js'
  2  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3  | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-projects')
  7  | })
  8  | 
  9  | async function createProjectAndGetFolderInfo(page, expect) {
  10 |   await page.goto('/')
  11 |   const { folderName, workDir } = await setupProjectFolder(page)
  12 |   await page.keyboard.press('n')
  13 |   await createAndSelectFolderInPicker(page, expect, folderName)
  14 |   await page.waitForLoadState('networkidle')
  15 |   return { folderName, workDir }
  16 | }
  17 | 
  18 | async function tryPickExistingFolder(page, expect, workDir) {
  19 |   await page.request.patch('/api/settings/last_path', {
  20 |     headers: { 'Content-Type': 'application/json' },
  21 |     data: JSON.stringify({ value: workDir })
  22 |   })
  23 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  24 |   await page.keyboard.press('n')
  25 |   await expect(page.locator('.file-picker')).toBeVisible()
  26 |   await page.keyboard.press('Enter')
  27 | }
  28 | 
  29 | // ─────────────────────────────────────────────────────────────────────────────
  30 | 
  31 | test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  32 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  33 | 
  34 |   await page.goto('/')
  35 |   await tryPickExistingFolder(page, expect, workDir)
  36 | 
  37 |   await expect(page.locator('.confirm-dialog')).toBeVisible()
  38 |   await expect(page.locator('.confirm-dialog')).toContainText('projet')
  39 | })
  40 | 
  41 | test('confirmer l\'ouverture : le projet apparaît dans la liste avec ses events', async ({ page }) => {
  42 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  43 | 
  44 |   const countAfterFirst = await page.locator('.project-item').count()
  45 | 
  46 |   await page.goto('/')
  47 |   await tryPickExistingFolder(page, expect, workDir)
> 48 |   await expect(page.locator('.confirm-dialog')).toBeVisible()
     |                                                 ^ Error: expect(locator).toBeVisible() failed
  49 | 
  50 |   await page.keyboard.press('Enter')
  51 |   await page.waitForLoadState('networkidle')
  52 | 
  53 |   await expect(page.locator('.project-item')).toHaveCount(countAfterFirst + 1)
  54 | 
  55 |   await page.keyboard.press('ArrowRight')
  56 |   await expect(page.locator('#main-panel')).toHaveClass(/event-list/)
  57 | 
  58 |   await expect(page.locator('.event-item')).toHaveCount(1)
  59 |   await expect(page.locator('.event-item').nth(0)).toContainText('Acte I')
  60 | })
  61 | 
  62 | test('annuler : aucun projet créé', async ({ page }) => {
  63 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  64 | 
  65 |   const countAfterFirst = await page.locator('.project-item').count()
  66 | 
  67 |   await page.goto('/')
  68 |   await tryPickExistingFolder(page, expect, workDir)
  69 |   await expect(page.locator('.confirm-dialog')).toBeVisible()
  70 | 
  71 |   await page.keyboard.press('Escape')
  72 |   await expect(page.locator('.confirm-dialog')).not.toBeVisible()
  73 | 
  74 |   await expect(page.locator('.project-item')).toHaveCount(countAfterFirst)
  75 | })
  76 | 
  77 | test('persistance : le projet survit au rechargement', async ({ page }) => {
  78 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  79 | 
  80 |   const countAfterFirst = await page.locator('.project-item').count()
  81 | 
  82 |   await page.goto('/')
  83 |   await tryPickExistingFolder(page, expect, workDir)
  84 |   await expect(page.locator('.confirm-dialog')).toBeVisible()
  85 |   await page.keyboard.press('Enter')
  86 |   await page.waitForLoadState('networkidle')
  87 | 
  88 |   await page.reload()
  89 |   await expect(page.locator('.project-item')).toHaveCount(countAfterFirst + 1)
  90 | })
  91 | 
```