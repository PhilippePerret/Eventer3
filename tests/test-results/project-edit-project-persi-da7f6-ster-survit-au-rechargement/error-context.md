# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/edit-project.spec.js >> persistance : l'id modifié (sans lister) survit au rechargement
- Location: specs/e2e/project/edit-project.spec.js:169:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.project-item').nth(1).locator('.project-item__id')
Expected: "project-beta"
Received: "project-b"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('.project-item').nth(1).locator('.project-item__id')
    14 × locator resolved to <span class="project-item__id">project-b</span>
       - unexpected value "project-b"

```

```yaml
- text: project-b
```

# Test source

```ts
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
  161 |   await titleInput.fill('Titre persistant B')
  162 |   await page.keyboard.press('Enter')
  163 |   await page.waitForLoadState('networkidle')
  164 | 
  165 |   await page.reload()
  166 |   await expect(page.locator('.project-item').nth(1).locator('.project-item__title')).toHaveText('Titre persistant B')
  167 | })
  168 | 
  169 | test("persistance : l'id modifié (sans lister) survit au rechargement", async ({ page }) => {
  170 |   const titleInput = await startEditingSecondProject(page)
  171 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  172 | 
  173 |   await page.keyboard.press('Tab')
  174 |   await idInput.fill('project-beta')
  175 |   await page.keyboard.press('Enter')
  176 |   await page.waitForLoadState('networkidle')
  177 | 
  178 |   await page.reload()
  179 | 
  180 |   // le nouvel id doit apparaître
  181 |   const items = page.locator('.project-item')
> 182 |   await expect(items.nth(1).locator('.project-item__id')).toHaveText('project-beta')
      |                                                           ^ Error: expect(locator).toHaveText(expected) failed
  183 |   // l'ancien id ne doit plus exister en tant qu'item listé
  184 |   await expect(items).toHaveCount(2)
  185 | })
  186 | 
  187 | test("projet sans lister : Escape restaure titre et id originaux", async ({ page }) => {
  188 |   const titleInput = await startEditingSecondProject(page)
  189 |   const idInput = page.locator('.project-item.selected input[name="id"]')
  190 | 
  191 |   await titleInput.fill('Titre temp')
  192 |   await page.keyboard.press('Tab')
  193 |   await idInput.fill('id-temp')
  194 |   await page.keyboard.press('Escape')
  195 | 
  196 |   const secondProject = page.locator('.project-item').nth(1)
  197 |   await expect(secondProject.locator('.project-item__title')).toHaveText('Projet B')
  198 |   await expect(secondProject.locator('.project-item__id')).toHaveText('project-b')
  199 | })
  200 | 
```