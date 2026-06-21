# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: _tdd/new-project-existing-db.spec.js >> dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)
- Location: specs/e2e/_tdd/new-project-existing-db.spec.js:41:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.panel-btn')
Expected: 3
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.panel-btn')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- iframe [active] [ref=e3]:
  - generic [active] [ref=f1e1]:
    - main [ref=f1e2]:
      - generic [ref=f1e3]:
        - generic [ref=f1e4]: Projet A
        - generic [ref=f1e5]: "---"
        - generic [ref=f1e6]: roman
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet B
        - generic [ref=f1e9]: "---"
        - generic [ref=f1e10]: roman
      - generic [ref=f1e11]:
        - generic [ref=f1e12]: Projet C
        - generic [ref=f1e13]: "---"
        - generic [ref=f1e14]: roman
      - generic [ref=f1e15]:
        - generic [ref=f1e16]: Projet caché
        - generic [ref=f1e17]: "---"
        - generic [ref=f1e18]: roman
    - contentinfo "Raccourcis clavier" [ref=f1e19]
    - generic: AIDE ⇧⌘ ?
    - generic [ref=f1e20]:
      - generic [ref=f1e21]: Projet existant
      - paragraph [ref=f1e23]: Ce dossier contient déjà un projet (eventer.db). Que faire ?
      - generic [ref=f1e24]:
        - generic [ref=f1e25]: ⇥ Annuler
        - generic [ref=f1e26]: ⇥ Détruire
        - generic [ref=f1e27]: ↩︎ Importer
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
  38 |   await expect(pane1(page).locator('.confirm-dialog')).toBeVisible()
  39 | })
  40 | 
  41 | test('dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)', async ({ page }) => {
  42 |   await setupFolderWithDb(page)
  43 |   await page.goto('/')
  44 |   await openPickerAndSelectFolder(page)
> 45 |   await expect(pane1(page).locator('.panel-btn')).toHaveCount(3)
     |                                                   ^ Error: expect(locator).toHaveCount(expected) failed
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