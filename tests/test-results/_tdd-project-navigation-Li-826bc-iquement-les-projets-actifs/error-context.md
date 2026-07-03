# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-navigation.spec.js >> Liste des projets >> la liste affiche uniquement les projets actifs
- Location: specs/e2e/_tdd/project-navigation.spec.js:17:3

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
  1   | // Origine : tests/specs/e2e/project/project-listing-content.spec.js
  2   | //         + tests/specs/e2e/project/open-existing-project.spec.js
  3   | //         + tests/specs/e2e/project/seed-projet-complet.spec.js
  4   | //         + tests/specs/e2e/project/regression-project-id.spec.js
  5   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  6   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  7   | import { setupProjectFolder, createAndSelectFolderInPicker } from '../../../helpers/create-project-helper.js'
  8   | import fs from 'node:fs/promises'
  9   | import path from 'node:path'
  10  | 
  11  | // ─── Liste des projets ────────────────────────────────────────────────────────
  12  | 
  13  | test.describe('Liste des projets', () => {
  14  | 
  15  |   test.beforeEach(() => installFixtures('many-projects'))
  16  | 
  17  |   test('la liste affiche uniquement les projets actifs', async ({ page }) => {
  18  |     await page.goto('/')
> 19  |     await expect(pane1(page).locator('.project-item')).toHaveCount(3)
      |                                                        ^ Error: expect(locator).toHaveCount(expected) failed
  20  |     await expect(pane1(page).locator('text=Projet A')).toBeVisible()
  21  |     await expect(pane1(page).locator('text=Projet B')).toBeVisible()
  22  |     await expect(pane1(page).locator('text=Projet C')).toBeVisible()
  23  |     await expect(pane1(page).locator('text=Projet caché')).toHaveCount(0)
  24  |   })
  25  | 
  26  | })
  27  | 
  28  | // ─── Ouverture / navigation ───────────────────────────────────────────────────
  29  | // Scénario : projet créé via FilePicker, puis retrouvé à la prochaine session
  30  | 
  31  | test.describe('Ouverture et navigation', () => {
  32  | 
  33  |   test.beforeEach(() => installFixtures('many-projects'))
  34  | 
  35  |   async function createProjectAndGetFolderInfo(page, expect) {
  36  |     await page.goto('/')
  37  |     const { folderName, workDir } = await setupProjectFolder(page)
  38  |     await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  39  |     await press(page, 'n')
  40  |     await createAndSelectFolderInPicker(page, expect, folderName)
  41  |     await page.waitForLoadState('networkidle')
  42  |     return { folderName, workDir }
  43  |   }
  44  | 
  45  |   async function tryPickExistingFolder(page, expect, workDir) {
  46  |     await page.request.patch('/api/settings/last_path', {
  47  |       headers: { 'Content-Type': 'application/json' },
  48  |       data: JSON.stringify({ value: workDir })
  49  |     })
  50  |     await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  51  |     await press(page, 'n')
  52  |     await expect(pane1(page).locator('.file-picker')).toBeVisible()
  53  |     await press(page, 'Enter')
  54  |   }
  55  | 
  56  |   test('choisir un dossier avec eventer.db affiche une boîte de confirmation', async ({ page }) => {
  57  |     const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  58  |     await page.goto('/')
  59  |     await tryPickExistingFolder(page, expect, workDir)
  60  |     await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  61  |     await expect(pane1(page).locator('.ftpanel.kpanel')).toContainText('projet')
  62  |   })
  63  | 
  64  |   test("confirmer l'ouverture : le projet apparaît dans la liste", async ({ page }) => {
  65  |     const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  66  |     const countAfterFirst = await pane1(page).locator('.project-item').count()
  67  |     await page.goto('/')
  68  |     await tryPickExistingFolder(page, expect, workDir)
  69  |     await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  70  |     await press(page, 'Enter')
  71  |     await page.waitForLoadState('networkidle')
  72  |     await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  73  |   })
  74  | 
  75  |   test('→ sur un projet ouvre la liste de ses events', async ({ page }) => {
  76  |     const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  77  |     await page.goto('/')
  78  |     await tryPickExistingFolder(page, expect, workDir)
  79  |     await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  80  |     await press(page, 'Enter')
  81  |     await page.waitForLoadState('networkidle')
  82  |     await press(page, 'ArrowRight')
  83  |     await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
  84  |     await expect(pane1(page).locator('.event-item')).toHaveCount(1)
  85  |     await expect(pane1(page).locator('.event-item').nth(0)).toContainText('Acte I')
  86  |   })
  87  | 
  88  |   test('annuler : aucun projet créé', async ({ page }) => {
  89  |     const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  90  |     const countAfterFirst = await pane1(page).locator('.project-item').count()
  91  |     await page.goto('/')
  92  |     await tryPickExistingFolder(page, expect, workDir)
  93  |     await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  94  |     await press(page, 'Tab')
  95  |     await press(page, 'Enter')
  96  |     await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
  97  |     await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
  98  |   })
  99  | 
  100 |   test("ouverture d'un projet existant : ses events affichent les marques de brins et de personnages", async ({ page }) => {
  101 |     installFixtures('with-brins-and-persos')
  102 |     await page.goto('/')
  103 |     await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  104 |     await press(page, 'ArrowRight')
  105 |     await expect(pane1(page).locator('#events-panel')).toHaveClass(/event-list/)
  106 |     await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  107 |     const e1 = pane1(page).locator('.event-item').nth(0)
  108 |     await expect(e1.locator('.event-brins-marks')).toContainText('MON')
  109 |     await expect(e1.locator('.event-persos-marks')).toContainText('CY')
  110 |   })
  111 | 
  112 |   test('persistance : le projet survit au rechargement', async ({ page }) => {
  113 |     const { workDir } = await createProjectAndGetFolderInfo(page, expect)
  114 |     const countAfterFirst = await pane1(page).locator('.project-item').count()
  115 |     await page.goto('/')
  116 |     await tryPickExistingFolder(page, expect, workDir)
  117 |     await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  118 |     await press(page, 'Enter')
  119 |     await page.waitForLoadState('networkidle')
```