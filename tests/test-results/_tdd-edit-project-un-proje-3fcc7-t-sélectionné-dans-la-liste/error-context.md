# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/edit-project.spec.js >> un projet créé via FilePicker apparaît sélectionné dans la liste
- Location: specs/e2e/_tdd/edit-project.spec.js:32:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.file-picker')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.file-picker')

```

```yaml
- main: Projet A --- roman Projet B --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | import os from 'node:os'
  2  | import path from 'node:path'
  3  | 
  4  | /**
  5  |  * Crée un dossier temporaire et configure last_path pour que FilePicker s'y ouvre.
  6  |  */
  7  | export async function setupProjectFolder(page, folderName = null) {
  8  |   const name = folderName ?? `eventer-test-${Date.now()}`
  9  |   const workDir = path.join(os.tmpdir(), `eventer-work-${Date.now()}`)
  10 | 
  11 |   await page.request.post('/api/fs/mkdir', {
  12 |     headers: { 'Content-Type': 'application/json' },
  13 |     data: JSON.stringify({ path: workDir })
  14 |   })
  15 |   await page.request.patch('/api/settings/last_path', {
  16 |     headers: { 'Content-Type': 'application/json' },
  17 |     data: JSON.stringify({ value: workDir })
  18 |   })
  19 | 
  20 |   return { folderName: name, workDir, folderPath: path.join(workDir, name) }
  21 | }
  22 | 
  23 | /**
  24 |  * Dans le FilePicker ouvert, crée un sous-dossier avec folderName puis le sélectionne.
  25 |  */
  26 | export async function createAndSelectFolderInPicker(page, expect, folderName) {
  27 |   const frame = page.frameLocator('#pane-1')
> 28 |   await expect(frame.locator('.file-picker')).toBeVisible()
     |                                               ^ Error: expect(locator).toBeVisible() failed
  29 | 
  30 |   // n dans le FilePicker = nouveau dossier — le FilePicker lui-même a le focus
  31 |   await frame.locator('.file-picker').press('n')
  32 | 
  33 |   const input = frame.locator('.file-picker__new-folder-input')
  34 |   await expect(input).toBeVisible()
  35 |   await input.fill(folderName)
  36 |   await input.press('Enter')
  37 | 
  38 |   // Attendre que l'entrée apparaisse, puis Enter dessus pour sélectionner
  39 |   const entry = frame.locator('.file-picker__entry-name', { hasText: folderName })
  40 |   await entry.waitFor({ state: 'visible' })
  41 |   await entry.press('Enter')
  42 | }
  43 | 
  44 | /**
  45 |  * Flux complet : setup dossier + n + FilePicker + attente fin création.
  46 |  * Retourne l'id du projet tel qu'affiché dans le DOM (.project-item__id à l'index 1).
  47 |  */
  48 | export async function createProjectViaFilePicker(page, expect) {
  49 |   const { folderName } = await setupProjectFolder(page)
  50 |   await page.frameLocator('#pane-1').locator('.project-item.selected').press('n')
  51 |   await createAndSelectFolderInPicker(page, expect, folderName)
  52 |   await page.waitForLoadState('networkidle')
  53 |   const idText = await page.frameLocator('#pane-1').locator('.project-item').nth(1).locator('.project-item__id').textContent()
  54 |   return { projectId: idText.trim(), folderName }
  55 | }
  56 | 
```