# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/edit-project.spec.js >> un projet créé via FilePicker apparaît sélectionné dans la liste
- Location: specs/e2e/project/edit-project.spec.js:32:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pane-1').contentFrame().locator('.project-item').nth(1)
Expected pattern: /selected/
Received string:  "project-item"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').nth(1)
    14 × locator resolved to <div tabindex="-1" class="project-item" data-id="00000000-0000-0000-0000-000000000002">…</div>
       - unexpected value "project-item"

```

```yaml
- text: Projet B roman
```

# Test source

```ts
  1   | // Refactorisé — nouvelle architecture (2026-06-20)
  2   | import { installFixtures } from '../../../helpers/install-fixtures'
  3   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  4   | 
  5   | test.beforeEach(() => {
  6   |   installFixtures('many-events')
  7   | })
  8   | 
  9   | // many-events : project-a (index 0), project-b (index 1)
  10  | 
  11  | async function startEditingFirstProject(page) {
  12  |   await page.goto('/')
  13  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  14  |   await press(page, 'Enter')
  15  |   const titleInput = pane1(page).locator('.project-item.selected [contenteditable][data-field="title"]')
  16  |   await expect(titleInput).toBeFocused()
  17  |   return titleInput
  18  | }
  19  | 
  20  | async function startEditingSecondProject(page) {
  21  |   await page.goto('/')
  22  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  23  |   await press(page, 'ArrowDown')
  24  |   await press(page, 'Enter')
  25  |   const titleInput = pane1(page).locator('.project-item.selected [contenteditable][data-field="title"]')
  26  |   await expect(titleInput).toBeFocused()
  27  |   return titleInput
  28  | }
  29  | 
  30  | // --- Lisibilité en édition ---
  31  | 
  32  | test("un projet créé via FilePicker apparaît sélectionné dans la liste", async ({ page }) => {
  33  |   // Ce test remplace le test de lisibilité de l'input id, supprimé avec le passage au FilePicker.
  34  |   // La création via FilePicker n'expose plus d'input id en ligne.
  35  |   const { setupProjectFolder, createAndSelectFolderInPicker } = await import('../../../helpers/create-project-helper.js')
  36  | 
  37  |   await page.goto('/')
  38  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  39  | 
  40  |   const { folderName } = await setupProjectFolder(page)
  41  |   await press(page, 'n')
  42  |   await createAndSelectFolderInPicker(page, expect, folderName)
  43  |   await page.waitForLoadState('networkidle')
  44  | 
  45  |   const items = pane1(page).locator('.project-item')
  46  |   const countAfter = await items.count()
  47  |   expect(countAfter).toBeGreaterThan(1)
> 48  |   await expect(items.nth(1)).toHaveClass(/selected/)
      |                              ^ Error: expect(locator).toHaveClass(expected) failed
  49  | })
  50  | 
  51  | // --- Hauteur visuelle ---
  52  | 
  53  | test("la hauteur du project-item reste identique en édition", async ({ page }) => {
  54  |   await page.goto('/')
  55  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  56  |   const item = pane1(page).locator('.project-item.selected')
  57  |   const heightBefore = (await item.boundingBox()).height
  58  |   await press(page, 'Enter')
  59  |   await expect(item.locator('[contenteditable][data-field="title"]')).toBeFocused()
  60  |   const heightAfter = (await item.boundingBox()).height
  61  |   expect(heightAfter).toBe(heightBefore)
  62  | })
  63  | 
  64  | // --- Champs éditables ---
  65  | 
  66  | test("édition : les champs PROPS sont éditables (title, state, type)", async ({ page }) => {
  67  |   const titleInput = await startEditingFirstProject(page)
  68  |   await expect(titleInput).toBeVisible()
  69  |   await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeVisible()
  70  |   await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeVisible()
  71  |   await expect(pane1(page).locator('.project-item.selected [data-field="id"]')).toHaveCount(0)
  72  | })
  73  | 
  74  | test("Tab cycle entre les champs PROPS éditables", async ({ page }) => {
  75  |   const titleInput = await startEditingFirstProject(page)
  76  |   await press(page, 'Tab')
  77  |   await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeFocused()
  78  |   await press(page, 'Tab')
  79  |   await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeFocused()
  80  |   await press(page, 'Tab')
  81  |   await expect(titleInput).toBeFocused()
  82  | })
  83  | 
  84  | test("Enter valide le nouveau titre", async ({ page }) => {
  85  |   const titleInput = await startEditingFirstProject(page)
  86  |   await titleInput.fill('Nouveau titre')
  87  |   await press(page, 'Enter')
  88  | 
  89  |   const firstProject = pane1(page).locator('.project-item').nth(0)
  90  |   await expect(firstProject.locator('.project-item__title')).toHaveText('Nouveau titre')
  91  | })
  92  | 
  93  | test("Escape restaure le titre original (premier projet)", async ({ page }) => {
  94  |   const titleInput = await startEditingFirstProject(page)
  95  |   await titleInput.fill('Titre temporaire')
  96  |   await press(page, 'Escape')
  97  | 
  98  |   const firstProject = pane1(page).locator('.project-item').nth(0)
  99  |   await expect(firstProject.locator('.project-item__title')).toHaveText('Projet A')
  100 | })
  101 | 
  102 | test("Escape restaure le titre original (second projet)", async ({ page }) => {
  103 |   const titleInput = await startEditingSecondProject(page)
  104 |   await titleInput.fill('Titre temp')
  105 |   await press(page, 'Escape')
  106 | 
  107 |   const secondProject = pane1(page).locator('.project-item').nth(1)
  108 |   await expect(secondProject.locator('.project-item__title')).toHaveText('Projet B')
  109 | })
  110 | 
  111 | // --- Persistance ---
  112 | 
  113 | test("persistance : le titre modifié survit au rechargement (premier projet)", async ({ page }) => {
  114 |   const titleInput = await startEditingFirstProject(page)
  115 |   await titleInput.fill('Titre persistant A')
  116 |   await press(page, 'Enter')
  117 |   await page.waitForLoadState('networkidle')
  118 | 
  119 |   await page.reload()
  120 |   await expect(pane1(page).locator('.project-item').nth(0).locator('.project-item__title')).toHaveText('Titre persistant A')
  121 | })
  122 | 
  123 | test("persistance : le titre modifié survit au rechargement (second projet)", async ({ page }) => {
  124 |   const titleInput = await startEditingSecondProject(page)
  125 |   await titleInput.fill('Titre persistant B')
  126 |   await press(page, 'Enter')
  127 |   await page.waitForLoadState('networkidle')
  128 | 
  129 |   await page.reload()
  130 |   await expect(pane1(page).locator('.project-item').nth(1).locator('.project-item__title')).toHaveText('Titre persistant B')
  131 | })
  132 | 
```