# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/edit-project.spec.js >> la hauteur du project-item reste identique en édition
- Location: specs/e2e/project/edit-project.spec.js:52:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 64
Received: 78
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - heading "Liste des projets" [level=1] [ref=e3]
    - generic [ref=e4]:
      - textbox "Titre du nouveau projet" [active] [ref=e5]
      - textbox "identifiant" [ref=e6]: project-a
    - generic [ref=e8]: project-b
  - generic:
    - generic: DISP MODE PROJECTS
  - contentinfo "Raccourcis clavier" [ref=e9]
  - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1   | import { installFixtures } from '../../../helpers/install-fixtures'
  2   | import { test, expect } from '../__setup__.js'
  3   | 
  4   | test.beforeEach(() => {
  5   |   installFixtures('many-events')
  6   | })
  7   | 
  8   | // many-events : project-a (index 0, hl:true), project-b (index 1, hl:false)
  9   | 
  10  | async function startEditingFirstProject(page) {
  11  |   await page.goto('/')
  12  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  13  |   await page.keyboard.press('Enter')
  14  |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  15  |   await expect(titleInput).toBeFocused()
  16  |   return titleInput
  17  | }
  18  | 
  19  | async function startEditingSecondProject(page) {
  20  |   await page.goto('/')
  21  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  22  |   await page.keyboard.press('ArrowDown')
  23  |   await page.keyboard.press('Enter')
  24  |   const titleInput = page.locator('.project-item.selected input[name="title"]')
  25  |   await expect(titleInput).toBeFocused()
  26  |   return titleInput
  27  | }
  28  | 
  29  | // --- Lisibilité en édition ---
  30  | 
  31  | test("un projet créé via FilePicker apparaît sélectionné dans la liste", async ({ page }) => {
  32  |   // Ce test remplace le test de lisibilité de l'input id, supprimé avec le passage au FilePicker.
  33  |   // La création via FilePicker n'expose plus d'input id en ligne.
  34  |   const { setupProjectFolder, createAndSelectFolderInPicker } = await import('../../../helpers/create-project-helper.js')
  35  | 
  36  |   await page.goto('/')
  37  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  38  | 
  39  |   const { folderName } = await setupProjectFolder(page)
  40  |   await page.keyboard.press('n')
  41  |   await createAndSelectFolderInPicker(page, expect, folderName)
  42  |   await page.waitForLoadState('networkidle')
  43  | 
  44  |   const items = page.locator('.project-item')
  45  |   const countAfter = await items.count()
  46  |   expect(countAfter).toBeGreaterThan(1)
  47  |   await expect(items.nth(1)).toHaveClass(/selected/)
  48  | })
  49  | 
  50  | // --- Hauteur visuelle ---
  51  | 
  52  | test("la hauteur du project-item reste identique en édition", async ({ page }) => {
  53  |   await page.goto('/')
  54  |   await expect(page.locator('#main-panel')).toHaveClass(/project-list/)
  55  |   const item = page.locator('.project-item.selected')
  56  |   const heightBefore = (await item.boundingBox()).height
  57  |   await page.keyboard.press('Enter')
  58  |   await expect(item.locator('input[name="title"]')).toBeFocused()
  59  |   const heightAfter = (await item.boundingBox()).height
> 60  |   expect(heightAfter).toBe(heightBefore)
      |                       ^ Error: expect(received).toBe(expected) // Object.is equality
  61  | })
  62  | 
  63  | // --- Projet avec lister (id verrouillé) ---
  64  | 
  65  | test("projet avec lister : seul le titre est éditable", async ({ page }) => {
  66  |   const titleInput = await startEditingFirstProject(page)
  67  |   await expect(titleInput).toBeVisible()
  68  | 
  69  |   const idInput = page.locator('.project-item.selected input[name="id"]')
  70  |   await expect(idInput).not.toBeVisible()
  71  | 
  72  |   // l'id est toujours affiché comme span non-éditable
  73  |   const idSpan = page.locator('.project-item.selected .project-item__id')
  74  |   await expect(idSpan).toBeVisible()
  75  |   await expect(idSpan).toHaveText('project-a')
  76  | })
  77  | 
  78  | test("projet avec lister : Tab boucle sur le titre (un seul champ)", async ({ page }) => {
  79  |   const titleInput = await startEditingFirstProject(page)
  80  |   await page.keyboard.press('Tab')
  81  |   await expect(titleInput).toBeFocused()
  82  | })
  83  | 
  84  | test("projet avec lister : Enter valide le nouveau titre", async ({ page }) => {
  85  |   const titleInput = await startEditingFirstProject(page)
  86  |   await titleInput.fill('Nouveau titre')
  87  |   await page.keyboard.press('Enter')
  88  | 
  89  |   const firstProject = page.locator('.project-item').nth(0)
  90  |   await expect(firstProject.locator('.project-item__title')).toHaveText('Nouveau titre')
  91  |   await expect(firstProject.locator('.project-item__id')).toHaveText('project-a')
  92  | })
  93  | 
  94  | test("projet avec lister : Escape restaure le titre original", async ({ page }) => {
  95  |   const titleInput = await startEditingFirstProject(page)
  96  |   await titleInput.fill('Titre temporaire')
  97  |   await page.keyboard.press('Escape')
  98  | 
  99  |   const firstProject = page.locator('.project-item').nth(0)
  100 |   await expect(firstProject.locator('.project-item__title')).toHaveText('Projet A')
  101 | })
  102 | 
  103 | // --- Projet sans lister (id modifiable) ---
  104 | 
  105 | test("projet sans lister : titre ET id sont éditables", async ({ page }) => {
  106 |   const titleInput = await startEditingSecondProject(page)
  107 |   await expect(titleInput).toBeVisible()
  108 | 
  109 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  110 |   await expect(idInput).toBeVisible()
  111 |   await expect(idInput).toHaveValue('project-b')
  112 | })
  113 | 
  114 | test("projet sans lister : l'id ne se recalcule pas quand on change le titre", async ({ page }) => {
  115 |   const titleInput = await startEditingSecondProject(page)
  116 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  117 | 
  118 |   await titleInput.fill('Titre complètement différent')
  119 |   await expect(idInput).toHaveValue('project-b')
  120 | })
  121 | 
  122 | test("projet sans lister : Tab passe du titre à l'id puis revient au titre", async ({ page }) => {
  123 |   const titleInput = await startEditingSecondProject(page)
  124 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  125 | 
  126 |   await page.keyboard.press('Tab')
  127 |   await expect(idInput).toBeFocused()
  128 | 
  129 |   await page.keyboard.press('Tab')
  130 |   await expect(titleInput).toBeFocused()
  131 | })
  132 | 
  133 | test("projet sans lister : Enter valide titre et id modifiés", async ({ page }) => {
  134 |   const titleInput = await startEditingSecondProject(page)
  135 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  136 | 
  137 |   await titleInput.fill('Projet Bêta')
  138 |   await page.keyboard.press('Tab')
  139 |   await idInput.fill('projet-beta')
  140 |   await page.keyboard.press('Enter')
  141 | 
  142 |   const secondProject = page.locator('.project-item').nth(1)
  143 |   await expect(secondProject.locator('.project-item__title')).toHaveText('Projet Bêta')
  144 |   await expect(secondProject.locator('.project-item__id')).toHaveText('projet-beta')
  145 | })
  146 | 
  147 | // --- Persistance ---
  148 | 
  149 | test("persistance : le titre modifié (avec lister) survit au rechargement", async ({ page }) => {
  150 |   const titleInput = await startEditingFirstProject(page)
  151 |   await titleInput.fill('Titre persistant A')
  152 |   await page.keyboard.press('Enter')
  153 |   await page.waitForLoadState('networkidle')
  154 | 
  155 |   await page.reload()
  156 |   await expect(page.locator('.project-item').nth(0).locator('.project-item__title')).toHaveText('Titre persistant A')
  157 | })
  158 | 
  159 | test("persistance : le titre modifié (sans lister) survit au rechargement", async ({ page }) => {
  160 |   const titleInput = await startEditingSecondProject(page)
```