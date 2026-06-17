# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filesystem/filepicker.spec.js >> Escape pendant création dossier annule sans créer
- Location: specs/e2e/filesystem/filepicker.spec.js:161:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#pane-1').contentFrame().locator('.file-picker')
Expected: "/var/folders/3h/g27j5r_57m147p6jfms6xb3m0000gn/T/eventer_e2e_filepicker/Roman-Alpha"
Received: "/var/folders/3h/g27j5r_57m147p6jfms6xb3m0000gn/T/eventer_e2e_filepicker"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('#pane-1').contentFrame().locator('.file-picker')
    14 × locator resolved to <div class="file-picker" data-current-path="/var/folders/3h/g27j5r_57m147p6jfms6xb3m0000gn/T/eventer_e2e_filepicker">…</div>
       - unexpected value "/var/folders/3h/g27j5r_57m147p6jfms6xb3m0000gn/T/eventer_e2e_filepicker"

```

```yaml
- text: eventer_e2e_filepicker
- button "Récents ▾"
- text: notes.txt Roman-Alpha Roman-Beta Roman-Gamma ␛ ← remonter · n nouveau dossier · Tab arborescence
- button "↩︎"
```

# Test source

```ts
  1   | import { test, expect, pane1 } from '../__setup__.js'
  2   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  3   | import path from 'path'
  4   | import fs from 'fs'
  5   | import os from 'os'
  6   | 
  7   | const TEST_DIR = path.join(os.tmpdir(), 'eventer_e2e_filepicker')
  8   | 
  9   | test.beforeAll(() => {
  10  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Alpha'), { recursive: true })
  11  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Beta'),  { recursive: true })
  12  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Gamma'), { recursive: true })
  13  |   fs.writeFileSync(path.join(TEST_DIR, 'notes.txt'), '')
  14  | })
  15  | 
  16  | test.afterAll(() => {
  17  |   fs.rmSync(TEST_DIR, { recursive: true, force: true })
  18  | })
  19  | 
  20  | test.beforeEach(async ({ page }) => {
  21  |   installFixtures('many-projects')
  22  |   await page.request.patch('/api/settings/last_path', {
  23  |     data: JSON.stringify({ value: TEST_DIR }),
  24  |     headers: { 'Content-Type': 'application/json' }
  25  |   })
  26  |   await page.goto('/')
  27  |   await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  28  | })
  29  | 
  30  | // Helper : ouvre le picker via 'n' (nouveau comportement direct)
  31  | async function openPickerViaN(page) {
  32  |   await page.keyboard.press('n')
  33  |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  34  | }
  35  | 
  36  | // Helper : attend que le picker soit positionné sur le chemin donné
  37  | async function waitForPath(page, expectedPath) {
> 38  |   await expect(pane1(page).locator('.file-picker')).toHaveAttribute('data-current-path', expectedPath)
      |                                                     ^ Error: expect(locator).toHaveAttribute(expected) failed
  39  | }
  40  | 
  41  | // ── Ouverture directe ─────────────────────────────────────────────────
  42  | 
  43  | test('n ouvre directement le FilePicker sans demander le titre', async ({ page }) => {
  44  |   await page.keyboard.press('n')
  45  |   await expect(pane1(page).locator('.file-picker')).toBeVisible()
  46  |   // Aucun champ titre n'apparaît AVANT la sélection du dossier
  47  |   await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
  48  | })
  49  | 
  50  | test('FilePicker liste les entrées du dossier courant', async ({ page }) => {
  51  |   await openPickerViaN(page)
  52  |   await expect(pane1(page).locator('.file-picker__entry')).toHaveCount(4)
  53  | })
  54  | 
  55  | test('entrées triées alphabétiquement (fichiers et dossiers mélangés)', async ({ page }) => {
  56  |   await openPickerViaN(page)
  57  |   // Tri alphabétique pur (sans dossiers en premier) :
  58  |   // notes.txt (n) avant Roman-Alpha (r)
  59  |   const first = pane1(page).locator('.file-picker__entry').first()
  60  |   await expect(first).toHaveAttribute('data-type', 'file')
  61  |   await expect(first.locator('.file-picker__entry-name')).toContainText('notes.txt')
  62  | })
  63  | 
  64  | test('FilePicker sélectionne la première entrée par défaut', async ({ page }) => {
  65  |   await openPickerViaN(page)
  66  |   await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveCount(1)
  67  |   await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
  68  | })
  69  | 
  70  | // ── Flot de création de projet ─────────────────────────────────────────
  71  | 
  72  | test('Escape annule sans créer de projet', async ({ page }) => {
  73  |   const countBefore = await pane1(page).locator('.project-item').count()
  74  |   await openPickerViaN(page)
  75  |   await page.keyboard.press('Escape')
  76  |   await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
  77  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
  78  | })
  79  | 
  80  | test('sélectionner un dossier crée le projet directement (sans éditeur)', async ({ page }) => {
  81  |   const countBefore = await pane1(page).locator('.project-item').count()
  82  |   await openPickerViaN(page)
  83  |   await page.keyboard.press('ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  84  |   await page.keyboard.press('Enter')       // sélectionne → projet créé directement
  85  |   await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
  86  |   await page.waitForLoadState('networkidle')
  87  |   // Projet créé, pas d'éditeur visible
  88  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  89  |   await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
  90  | })
  91  | 
  92  | // ── Navigation clavier ────────────────────────────────────────────────
  93  | 
  94  | test('↓ déplace la sélection vers le bas', async ({ page }) => {
  95  |   await openPickerViaN(page)
  96  |   await page.keyboard.press('ArrowDown')
  97  |   await expect(pane1(page).locator('.file-picker__entry').nth(1)).toHaveClass(/selected/)
  98  | })
  99  | 
  100 | test('↑ déplace la sélection vers le haut', async ({ page }) => {
  101 |   await openPickerViaN(page)
  102 |   await page.keyboard.press('ArrowDown')
  103 |   await page.keyboard.press('ArrowUp')
  104 |   await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
  105 | })
  106 | 
  107 | test('→ entre dans un dossier', async ({ page }) => {
  108 |   await openPickerViaN(page)
  109 |   await page.keyboard.press('ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  110 |   await page.keyboard.press('ArrowRight')
  111 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  112 | })
  113 | 
  114 | test('← remonte au niveau supérieur', async ({ page }) => {
  115 |   await openPickerViaN(page)
  116 |   await page.keyboard.press('ArrowDown')
  117 |   await page.keyboard.press('ArrowRight')
  118 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  119 |   await page.keyboard.press('ArrowLeft')
  120 |   await waitForPath(page, TEST_DIR)
  121 | })
  122 | 
  123 | test('→ ne fait rien sur un fichier', async ({ page }) => {
  124 |   await openPickerViaN(page)
  125 |   // Première entrée = notes.txt (fichier) : déjà sélectionné
  126 |   await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  127 |   await page.keyboard.press('ArrowRight')
  128 |   // Path ne change pas
  129 |   await waitForPath(page, TEST_DIR)
  130 | })
  131 | 
  132 | // ── Sélection ─────────────────────────────────────────────────────────
  133 | 
  134 | test('Enter sur un dossier ferme le picker', async ({ page }) => {
  135 |   await openPickerViaN(page)
  136 |   await page.keyboard.press('ArrowDown')  // Roman-Alpha
  137 |   await page.keyboard.press('Enter')
  138 |   await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
```