# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/open-existing-project.spec.js >> choisir un dossier avec eventer.db affiche une boîte de confirmation
- Location: specs/e2e/_tdd/open-existing-project.spec.js:33:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('#projects-panel')
Expected pattern: /project-list/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('#projects-panel')
    14 × locator resolved to <div class="" id="projects-panel">…</div>
       - unexpected value ""

```

```yaml
- text: Projet A --- roman Projet B --- roman Projet C --- roman Projet caché --- roman
```

# Test source

```ts
  1   | // Refactorisé — nouvelle architecture (2026-06-25)
  2   | import { test, expect, pane1 } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  5   | 
  6   | test.beforeEach(() => {
  7   |   installFixtures('many-projects')
  8   | })
  9   | 
  10  | async function createProjectAndGetFolderInfo(page, expect) {
  11  |   await page.goto('/')
  12  |   const { folderName, workDir } = await setupProjectFolder(page)
> 13  |   await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
      |                                                        ^ Error: expect(locator).toHaveClass(expected) failed
  14  |   await pane1(page).locator('.project-item.selected').press('n')
  15  |   await createAndSelectFolderInPicker(page, expect, folderName)
  16  |   await page.waitForLoadState('networkidle')
  17  |   return { folderName, workDir }
  18  | }
  19  | 
  20  | async function tryPickExistingFolder(page, expect, workDir) {
  21  |   await page.request.patch('/api/settings/last_path', {
  22  |     headers: { 'Content-Type': 'application/json' },
  23  |     data: JSON.stringify({ value: workDir })
  24  |   })
  25  |   await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  26  |   await pane1(page).locator('.project-item.selected').press('n')
  27  |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  28  |   await pane1(page).locator('.file-picker').press('Enter')
  29  | }
  30  | 
  31  | // ─────────────────────────────────────────────────────────────────────────────
  32  | 
  33  | test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  34  |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  35  | 
  36  |   await page.goto('/')
  37  |   await tryPickExistingFolder(page, expect, workDir)
  38  | 
  39  |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  40  |   await expect(pane1(page).locator('.ftpanel.kpanel')).toContainText('projet')
  41  | })
  42  | 
  43  | test('confirmer l\'ouverture : le projet apparaît dans la liste', async ({ page }) => {
  44  |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  45  | 
  46  |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  47  | 
  48  |   await page.goto('/')
  49  |   await tryPickExistingFolder(page, expect, workDir)
  50  |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  51  | 
  52  |   await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  53  |   await page.waitForLoadState('networkidle')
  54  | 
  55  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  56  | })
  57  | 
  58  | test('→ sur un projet ouvre la liste de ses events', async ({ page }) => {
  59  |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  60  | 
  61  |   await page.goto('/')
  62  |   await tryPickExistingFolder(page, expect, workDir)
  63  |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  64  |   await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  65  |   await page.waitForLoadState('networkidle')
  66  | 
  67  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  68  |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
  69  | 
  70  |   await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  71  |   await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
  72  | })
  73  | 
  74  | test('annuler : aucun projet créé', async ({ page }) => {
  75  |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  76  | 
  77  |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  78  | 
  79  |   await page.goto('/')
  80  |   await tryPickExistingFolder(page, expect, workDir)
  81  |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  82  | 
  83  |   await pane1(page).locator('.ftpanel.kpanel').press('Tab')
  84  |   await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  85  |   await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
  86  | 
  87  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
  88  | })
  89  | 
  90  | // Fixture with-brins-and-persos : Projet A, e1 (brin b1 'MON', perso c1 'CY'), e2 (sans brin/perso)
  91  | 
  92  | test('ouverture d\'un projet existant : ses events affichent les marques de brins et de personnages', async ({ page }) => {
  93  |   installFixtures('with-brins-and-persos')
  94  |   await page.goto('/')
  95  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  96  | 
  97  |   await pane1(page).locator('.project-item.selected').press('ArrowRight')
  98  |   await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
  99  |   await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  100 | 
  101 |   const e1 = pane1(page).locator('.event-item').nth(0)
  102 |   await expect(e1.locator('.event-brins-marks')).toContainText('MON')
  103 |   await expect(e1.locator('.event-persos-marks')).toContainText('CY')
  104 | })
  105 | 
  106 | test('persistance : le projet survit au rechargement', async ({ page }) => {
  107 |   const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  108 | 
  109 |   const countAfterFirst = await pane1(page).locator('.project-item').count()
  110 | 
  111 |   await page.goto('/')
  112 |   await tryPickExistingFolder(page, expect, workDir)
  113 |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
```