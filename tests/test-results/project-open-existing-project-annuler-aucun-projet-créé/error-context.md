# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/open-existing-project.spec.js >> annuler : aucun projet créé
- Location: specs/e2e/project/open-existing-project.spec.js:74:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.project-item')
Expected: 4
Received: 5
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item')
    14 × locator resolved to 5 elements
       - unexpected value "5"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [active] [ref=f3e1]:
    - generic [ref=f3e5]:
      - generic [ref=f3e7]:
        - generic [ref=f3e8]: Projet A
        - generic [ref=f3e10]: roman
      - generic [ref=f3e12]:
        - generic [ref=f3e13]: Projet B
        - generic [ref=f3e15]: roman
      - generic [ref=f3e17]:
        - generic [ref=f3e18]: Projet C
        - generic [ref=f3e20]: roman
      - generic [ref=f3e22]:
        - generic [ref=f3e23]: Projet caché
        - generic [ref=f3e25]: roman
      - generic [ref=f3e27]:
        - generic [ref=f3e28]: eventer-test-1782968694085
        - generic [ref=f3e30]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f3e31]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | // Refactorisé — nouvelle architecture (2026-06-25)
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
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
  13  |   await expect(pane1(page).locator('#projects-panel')).toHaveClass(/project-list/)
  14  |   await press(page, 'n')
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
  26  |   await press(page, 'n')
  27  |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  28  |   await press(page, 'Enter')
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
  52  |   await press(page, 'Enter')
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
  64  |   await press(page, 'Enter')
  65  |   await page.waitForLoadState('networkidle')
  66  | 
  67  |   await press(page, 'ArrowRight')
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
  83  |   await press(page, 'Tab')
  84  |   await press(page, 'Enter')
  85  |   await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
  86  | 
> 87  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst)
      |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  88  | })
  89  | 
  90  | // Fixture with-brins-and-persos : Projet A, e1 (brin b1 'MON', perso c1 'CY'), e2 (sans brin/perso)
  91  | 
  92  | test('ouverture d\'un projet existant : ses events affichent les marques de brins et de personnages', async ({ page }) => {
  93  |   installFixtures('with-brins-and-persos')
  94  |   await page.goto('/')
  95  |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  96  | 
  97  |   await press(page, 'ArrowRight')
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
  114 |   await press(page, 'Enter')
  115 |   await page.waitForLoadState('networkidle')
  116 | 
  117 |   await page.reload()
  118 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countAfterFirst + 1)
  119 | })
  120 | 
  121 | // ─── Lancement / navigation projets ↔ events ─────────────────────────────────
  122 | 
  123 | test("entrer dans un projet cache le panneau des projets", async ({ page }) => {
  124 |   installFixtures('with-brins-and-persos')
  125 |   await page.goto('/')
  126 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  127 | 
  128 |   await press(page, 'ArrowRight')
  129 | 
  130 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  131 |   await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  132 | })
  133 | 
  134 | test("→ ouvre directement le PREMIER projet à l'ouverture de l'app", async ({ page }) => {
  135 |   installFixtures('with-brins-and-persos')
  136 |   await page.goto('/')
  137 |   await expect(pane1(page).locator('.project-item').nth(0)).toHaveClass(/selected/)
  138 | 
  139 |   await press(page, 'ArrowRight')
  140 | 
  141 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  142 |   await expect(pane1(page).locator('.event-item')).toHaveCount(2)
  143 | })
  144 | 
  145 | test("→ ← ↓ → : navigation entre projets et leurs évènemenciers", async ({ page }) => {
  146 |   installFixtures('two-projects-events')
  147 |   await page.goto('/')
  148 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  149 | 
  150 |   // entrer dans Projet A
  151 |   await press(page, 'ArrowRight')
  152 |   await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  153 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  154 |   await expect(pane1(page).locator('.event-item')).toHaveCount(3) // e1,e2,e3
  155 | 
  156 |   // revenir à la liste des projets
  157 |   await press(page, 'ArrowLeft')
  158 |   await expect(pane1(page).locator('#events-panel')).not.toBeVisible()
  159 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  160 | 
  161 |   // choisir Projet B
  162 |   await press(page, 'ArrowDown')
  163 |   await expect(pane1(page).locator('.project-item').nth(1)).toHaveClass(/selected/)
  164 | 
  165 |   // entrer dans Projet B
  166 |   await press(page, 'ArrowRight')
  167 |   await expect(pane1(page).locator('#projects-panel')).not.toBeVisible()
  168 |   await expect(pane1(page).locator('#events-panel')).toBeVisible()
  169 |   await expect(pane1(page).locator('.event-item')).toHaveCount(2) // e4,e5
  170 | })
  171 | 
```