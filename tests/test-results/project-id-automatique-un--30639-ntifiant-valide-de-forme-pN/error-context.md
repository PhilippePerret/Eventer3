# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/id-automatique.spec.js >> un projet créé via FilePicker a un identifiant valide de forme pN
- Location: specs/e2e/project/id-automatique.spec.js:9:1

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /^p\d+$/
Received string:  "5d19d5c4-654f-4968-81f7-6330647b60b5"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "Liste des projets" [level=1] [ref=e3]
    - generic [ref=e5]: project-a
    - generic [ref=e6]:
      - generic [ref=e7]: eventer-test-1781242836549
      - generic [ref=e8]: 5d19d5c4-654f-4968-81f7-6330647b60b5
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
  2  | import { setupProjectFolder, createAndSelectFolderInPicker, createProjectViaFilePicker } from '../../../helpers/create-project-helper.js'
  3  | import { test, expect } from '../__setup__.js'
  4  | 
  5  | test.beforeEach(() => {
  6  |   installFixtures('many-projects')
  7  | })
  8  | 
  9  | test("un projet créé via FilePicker a un identifiant valide de forme pN", async ({ page }) => {
  10 |   await page.goto('/')
  11 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  12 | 
  13 |   const { projectId } = await createProjectViaFilePicker(page, expect)
  14 | 
> 15 |   expect(projectId).toMatch(/^p\d+$/)
     |                     ^ Error: expect(received).toMatch(expected)
  16 | })
  17 | 
  18 | test("le titre du nouveau projet correspond au nom du dossier choisi", async ({ page }) => {
  19 |   await page.goto('/')
  20 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  21 | 
  22 |   const { folderName } = await setupProjectFolder(page, 'mon-nouveau-projet')
  23 |   await page.keyboard.press('n')
  24 |   await createAndSelectFolderInPicker(page, expect, folderName)
  25 |   await page.waitForLoadState('networkidle')
  26 | 
  27 |   await expect(page.locator('.project-item').nth(1).locator('.project-item__title')).toHaveText(folderName)
  28 | })
  29 | 
  30 | test("deux projets créés successivement ont des identifiants différents", async ({ page }) => {
  31 |   await page.goto('/')
  32 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  33 | 
  34 |   const { projectId: id1 } = await createProjectViaFilePicker(page, expect)
  35 |   await page.goto('/')
  36 |   const { projectId: id2 } = await createProjectViaFilePicker(page, expect)
  37 | 
  38 |   expect(id1).not.toBe(id2)
  39 | })
  40 | 
  41 | test("persistance : l'identifiant du projet survit au rechargement", async ({ page }) => {
  42 |   await page.goto('/')
  43 |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  44 | 
  45 |   const { projectId } = await createProjectViaFilePicker(page, expect)
  46 | 
  47 |   await page.reload()
  48 | 
  49 |   const idText = await page.locator('.project-item').nth(1).locator('.project-item__id').textContent()
  50 |   expect(idText.trim()).toBe(projectId)
  51 | })
  52 | 
```