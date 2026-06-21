# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-project-existing-db.spec.js >> choisir un dossier avec eventer.db → dialog de confirmation visible
- Location: specs/e2e/_tdd/new-project-existing-db.spec.js:34:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pane-1').contentFrame().locator('.confirm-dialog')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.confirm-dialog')

```

```yaml
- main: Projet A --- roman Projet B --- roman Projet C --- roman Projet caché --- roman
- contentinfo "Raccourcis clavier"
- text: AIDE ⇧⌘ ? Projet existant
- paragraph: Ce dossier contient déjà un projet (eventer.db). Que faire ?
- text: ⇥ Annuler ⇥ Détruire ↩︎ Importer
```

# Test source

```ts
  1  | import fs from 'node:fs'
  2  | import path from 'node:path'
  3  | import os from 'node:os'
  4  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  5  | import { test, expect, pane1 } from '../__setup__.js'
  6  | 
  7  | test.beforeEach(() => {
  8  |   installFixtures('many-projects')
  9  | })
  10 | 
  11 | async function setupFolderWithDb(page) {
  12 |   const workDir  = path.join(os.tmpdir(), `eventer-test-${Date.now()}`)
  13 |   const folder   = path.join(workDir, 'projet-existant')
  14 |   fs.mkdirSync(folder, { recursive: true })
  15 |   fs.writeFileSync(path.join(folder, 'eventer.db'), '')
  16 | 
  17 |   await page.request.patch('/api/settings/last_path', {
  18 |     headers: { 'Content-Type': 'application/json' },
  19 |     data: JSON.stringify({ value: workDir })
  20 |   })
  21 |   return { workDir, folder }
  22 | }
  23 | 
  24 | async function openPickerAndSelectFolder(page) {
  25 |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  26 |   await pane1(page).locator('body').press('n')
  27 |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  28 |   await expect(pane1(page).locator('.file-picker__entry-name', { hasText: 'projet-existant' })).toBeVisible()
  29 |   await pane1(page).locator('body').press('Enter')
  30 | }
  31 | 
  32 | // ── Dialog ────────────────────────────────────────────────────────────────────
  33 | 
  34 | test('choisir un dossier avec eventer.db → dialog de confirmation visible', async ({ page }) => {
  35 |   await setupFolderWithDb(page)
  36 |   await page.goto('/')
  37 |   await openPickerAndSelectFolder(page)
> 38 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  39 | })
  40 | 
  41 | test('dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)', async ({ page }) => {
  42 |   await setupFolderWithDb(page)
  43 |   await page.goto('/')
  44 |   await openPickerAndSelectFolder(page)
  45 |   await expect(pane1(page).locator('.panel-btn')).toHaveCount(3)
  46 | })
  47 | 
  48 | test('dialog eventer.db → Escape annule, aucun projet créé', async ({ page }) => {
  49 |   await setupFolderWithDb(page)
  50 |   await page.goto('/')
  51 |   const countBefore = await pane1(page).locator('.project-item').count()
  52 |   await openPickerAndSelectFolder(page)
  53 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  54 |   await pane1(page).locator('body').press('Escape')
  55 |   await expect(pane1(page).locator('.confirm-dialog')).not.toBeVisible()
  56 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
  57 | })
  58 | 
  59 | test('dialog eventer.db → Enter (Oui) importe le projet existant', async ({ page }) => {
  60 |   await setupFolderWithDb(page)
  61 |   await page.goto('/')
  62 |   const countBefore = await pane1(page).locator('.project-item').count()
  63 |   await openPickerAndSelectFolder(page)
  64 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  65 |   await pane1(page).locator('body').press('Enter')
  66 |   await page.waitForLoadState('networkidle')
  67 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  68 | })
  69 | 
  70 | test('dialog eventer.db → Delete (⌦ Non, la détruire) crée un nouveau projet vide', async ({ page }) => {
  71 |   await setupFolderWithDb(page)
  72 |   await page.goto('/')
  73 |   const countBefore = await pane1(page).locator('.project-item').count()
  74 |   await openPickerAndSelectFolder(page)
  75 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  76 |   await pane1(page).locator('body').press('Delete')
  77 |   await page.waitForLoadState('networkidle')
  78 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  79 | })
  80 | 
```