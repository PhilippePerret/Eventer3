# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/project-edit.spec.js >> persistance : le titre modifié survit au rechargement (premier projet)
- Location: specs/e2e/_tdd/project-edit.spec.js:108:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.project-item').first().locator('.project-title')
Expected: "Titre persistant A"
Received: "Projet A"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.project-item').first().locator('.project-title')
    14 × locator resolved to <span class="project-title">Projet A</span>
       - unexpected value "Projet A"

```

```yaml
- text: Projet A
```

# Test source

```ts
  15  |   await expect(titleInput).toBeFocused()
  16  |   return titleInput
  17  | }
  18  | 
  19  | async function startEditingSecondProject(page) {
  20  |   await page.goto('/')
  21  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  22  |   await press(page, 'ArrowDown')
  23  |   await press(page, 'Enter')
  24  |   const titleInput = pane1(page).locator('.project-item.selected [contenteditable][data-field="title"]')
  25  |   await expect(titleInput).toBeFocused()
  26  |   return titleInput
  27  | }
  28  | 
  29  | // ─── Apparence ────────────────────────────────────────────────────────────────
  30  | 
  31  | test("un projet créé via FilePicker apparaît sélectionné dans la liste", async ({ page }) => {
  32  |   const { setupProjectFolder, createAndSelectFolderInPicker } = await import('../../../helpers/create-project-helper.js')
  33  | 
  34  |   await page.goto('/')
  35  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  36  | 
  37  |   const { folderName } = await setupProjectFolder(page)
  38  |   await press(page, 'n')
  39  |   await createAndSelectFolderInPicker(page, expect, folderName)
  40  |   await page.waitForLoadState('networkidle')
  41  | 
  42  |   const items = pane1(page).locator('.project-item')
  43  |   const countAfter = await items.count()
  44  |   expect(countAfter).toBeGreaterThan(1)
  45  |   await expect(items.nth(1)).toHaveClass(/selected/)
  46  | })
  47  | 
  48  | test("la hauteur du project-item reste identique en édition", async ({ page }) => {
  49  |   await page.goto('/')
  50  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  51  |   const item = pane1(page).locator('.project-item.selected')
  52  |   const heightBefore = (await item.boundingBox()).height
  53  |   await press(page, 'Enter')
  54  |   await expect(item.locator('[contenteditable][data-field="title"]')).toBeFocused()
  55  |   const heightAfter = (await item.boundingBox()).height
  56  |   expect(heightAfter).toBe(heightBefore)
  57  | })
  58  | 
  59  | // ─── Champs éditables ─────────────────────────────────────────────────────────
  60  | 
  61  | test("édition : les champs PROPS sont éditables (title, state, type)", async ({ page }) => {
  62  |   const titleInput = await startEditingFirstProject(page)
  63  |   await expect(titleInput).toBeVisible()
  64  |   await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeVisible()
  65  |   await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeVisible()
  66  |   await expect(pane1(page).locator('.project-item.selected [data-field="id"]')).toHaveCount(0)
  67  | })
  68  | 
  69  | test("Tab cycle entre les champs PROPS éditables", async ({ page }) => {
  70  |   const titleInput = await startEditingFirstProject(page)
  71  |   await press(page, 'Tab')
  72  |   await expect(pane1(page).locator('.project-item.selected [data-field="state"]')).toBeFocused()
  73  |   await press(page, 'Tab')
  74  |   await expect(pane1(page).locator('.project-item.selected [data-field="type"]')).toBeFocused()
  75  |   await press(page, 'Tab')
  76  |   await expect(titleInput).toBeFocused()
  77  | })
  78  | 
  79  | test("Enter valide le nouveau titre", async ({ page }) => {
  80  |   const titleInput = await startEditingFirstProject(page)
  81  |   await titleInput.fill('Nouveau titre')
  82  |   await press(page, 'Enter')
  83  | 
  84  |   const firstProject = pane1(page).locator('.project-item').nth(0)
  85  |   await expect(firstProject.locator('.project-title')).toHaveText('Nouveau titre')
  86  | })
  87  | 
  88  | test("Escape restaure le titre original (premier projet)", async ({ page }) => {
  89  |   const titleInput = await startEditingFirstProject(page)
  90  |   await titleInput.fill('Titre temporaire')
  91  |   await press(page, 'Escape')
  92  | 
  93  |   const firstProject = pane1(page).locator('.project-item').nth(0)
  94  |   await expect(firstProject.locator('.project-title')).toHaveText('Projet A')
  95  | })
  96  | 
  97  | test("Escape restaure le titre original (second projet)", async ({ page }) => {
  98  |   const titleInput = await startEditingSecondProject(page)
  99  |   await titleInput.fill('Titre temp')
  100 |   await press(page, 'Escape')
  101 | 
  102 |   const secondProject = pane1(page).locator('.project-item').nth(1)
  103 |   await expect(secondProject.locator('.project-title')).toHaveText('Projet B')
  104 | })
  105 | 
  106 | // ─── Persistance ──────────────────────────────────────────────────────────────
  107 | 
  108 | test("persistance : le titre modifié survit au rechargement (premier projet)", async ({ page }) => {
  109 |   const titleInput = await startEditingFirstProject(page)
  110 |   await titleInput.fill('Titre persistant A')
  111 |   await press(page, 'Enter')
  112 |   await page.waitForLoadState('networkidle')
  113 | 
  114 |   await page.reload()
> 115 |   await expect(pane1(page).locator('.project-item').nth(0).locator('.project-title')).toHaveText('Titre persistant A')
      |                                                                                       ^ Error: expect(locator).toHaveText(expected) failed
  116 | })
  117 | 
  118 | test("persistance : le titre modifié survit au rechargement (second projet)", async ({ page }) => {
  119 |   const titleInput = await startEditingSecondProject(page)
  120 |   await titleInput.fill('Titre persistant B')
  121 |   await press(page, 'Enter')
  122 |   await page.waitForLoadState('networkidle')
  123 | 
  124 |   await page.reload()
  125 |   await expect(pane1(page).locator('.project-item').nth(1).locator('.project-title')).toHaveText('Titre persistant B')
  126 | })
  127 | 
```