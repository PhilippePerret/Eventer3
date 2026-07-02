# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/new-project-existing-db.spec.js >> dialog eventer.db → Tab+Enter (Détruire) crée un nouveau projet vide
- Location: specs/e2e/project/new-project-existing-db.spec.js:73:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.project-item')
Expected: 5
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
  - generic [active] [ref=f1e1]:
    - generic [ref=f1e5]:
      - generic [ref=f1e7]:
        - generic [ref=f1e8]: Projet A
        - generic [ref=f1e10]: roman
      - generic [ref=f1e12]:
        - generic [ref=f1e13]: Projet B
        - generic [ref=f1e15]: roman
      - generic [ref=f1e17]:
        - generic [ref=f1e18]: Projet C
        - generic [ref=f1e20]: roman
      - generic [ref=f1e22]:
        - generic [ref=f1e23]: Projet caché
        - generic [ref=f1e25]: roman
    - generic:
      - generic: DISP MODE PROJECTS
    - contentinfo "Raccourcis clavier" [ref=f1e26]
    - generic: AIDE ⇧⌘ ?
```

# Test source

```ts
  1  | // Origine : tests/specs/e2e/project/new-project-existing-db.spec.js
  2  | import fs from 'node:fs'
  3  | import path from 'node:path'
  4  | import os from 'node:os'
  5  | import { installFixtures } from '../../../helpers/install-fixtures.js'
  6  | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  7  | 
  8  | test.beforeEach(() => {
  9  |   installFixtures('many-projects')
  10 | })
  11 | 
  12 | async function setupFolderWithDb(page) {
  13 |   const workDir  = path.join(os.tmpdir(), `eventer-test-${Date.now()}`)
  14 |   const folder   = path.join(workDir, 'projet-existant')
  15 |   fs.mkdirSync(folder, { recursive: true })
  16 |   fs.writeFileSync(path.join(folder, 'eventer.db'), '')
  17 | 
  18 |   await page.request.patch('/api/settings/last_path', {
  19 |     headers: { 'Content-Type': 'application/json' },
  20 |     data: JSON.stringify({ value: workDir })
  21 |   })
  22 |   return { workDir, folder }
  23 | }
  24 | 
  25 | async function openPickerAndSelectFolder(page) {
  26 |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  27 |   await press(page, 'n')
  28 |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  29 |   await expect(pane1(page).locator('.file-picker__entry-name', { hasText: 'projet-existant' })).toBeVisible()
  30 |   await press(page, 'Enter')
  31 | }
  32 | 
  33 | // ── Dialog ────────────────────────────────────────────────────────────────────
  34 | 
  35 | test('choisir un dossier avec eventer.db → dialog de confirmation visible', async ({ page }) => {
  36 |   await setupFolderWithDb(page)
  37 |   await page.goto('/')
  38 |   await openPickerAndSelectFolder(page)
  39 |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  40 | })
  41 | 
  42 | test('dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)', async ({ page }) => {
  43 |   await setupFolderWithDb(page)
  44 |   await page.goto('/')
  45 |   await openPickerAndSelectFolder(page)
  46 |   await expect(pane1(page).locator('.ftpanel-btn')).toHaveCount(3)
  47 | })
  48 | 
  49 | test('dialog eventer.db → Tab+Tab+Enter (Annuler) → aucun projet créé', async ({ page }) => {
  50 |   await setupFolderWithDb(page)
  51 |   await page.goto('/')
  52 |   const countBefore = await pane1(page).locator('.project-item').count()
  53 |   await openPickerAndSelectFolder(page)
  54 |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  55 |   await press(page, 'Tab')   // 0 Importer → 1 Détruire
  56 |   await press(page, 'Tab')   // 1 Détruire → 2 Annuler
  57 |   await press(page, 'Enter')
  58 |   await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
  59 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
  60 | })
  61 | 
  62 | test('dialog eventer.db → Enter (Oui) importe le projet existant', async ({ page }) => {
  63 |   await setupFolderWithDb(page)
  64 |   await page.goto('/')
  65 |   const countBefore = await pane1(page).locator('.project-item').count()
  66 |   await openPickerAndSelectFolder(page)
  67 |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  68 |   await press(page, 'Enter')
  69 |   await page.waitForLoadState('networkidle')
  70 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  71 | })
  72 | 
  73 | test('dialog eventer.db → Tab+Enter (Détruire) crée un nouveau projet vide', async ({ page }) => {
  74 |   await setupFolderWithDb(page)
  75 |   await page.goto('/')
  76 |   const countBefore = await pane1(page).locator('.project-item').count()
  77 |   await openPickerAndSelectFolder(page)
  78 |   await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  79 |   await press(page, 'Tab')   // 0 Importer → 1 Détruire
  80 |   await press(page, 'Enter')
  81 |   await page.waitForLoadState('networkidle')
> 82 |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
     |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  83 | })
  84 | 
```