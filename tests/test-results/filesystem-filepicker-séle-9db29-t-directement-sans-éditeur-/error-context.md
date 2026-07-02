# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filesystem/filepicker.spec.js >> sélectionner un dossier crée le projet directement (sans éditeur)
- Location: specs/e2e/filesystem/filepicker.spec.js:75:1

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

# Test source

```ts
  1   | // Refactorisé — nouvelle architecture (2026-06-20)
  2   | import { test, expect, pane1, press, getErr } from '../__setup__.js'
  3   | import { installFixtures } from '../../../helpers/install-fixtures.js'
  4   | import path from 'path'
  5   | import fs from 'fs'
  6   | import os from 'os'
  7   | 
  8   | const TEST_DIR = path.join(os.tmpdir(), 'eventer_e2e_filepicker')
  9   | const fp = (page) => pane1(page).locator('.file-picker')
  10  | 
  11  | test.beforeAll(() => {
  12  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Alpha'), { recursive: true })
  13  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Beta'),  { recursive: true })
  14  |   fs.mkdirSync(path.join(TEST_DIR, 'Roman-Gamma'), { recursive: true })
  15  |   fs.writeFileSync(path.join(TEST_DIR, 'notes.txt'), '')
  16  | })
  17  | 
  18  | test.afterAll(() => {
  19  |   fs.rmSync(TEST_DIR, { recursive: true, force: true })
  20  | })
  21  | 
  22  | test.beforeEach(async ({ page }) => {
  23  |   installFixtures('many-projects')
  24  |   await page.request.patch('/api/settings/last_path', {
  25  |     data: JSON.stringify({ value: TEST_DIR }),
  26  |     headers: { 'Content-Type': 'application/json' }
  27  |   })
  28  |   await page.goto('/')
  29  |   await expect(pane1(page).locator('#projects-panel')).toBeVisible()
  30  | })
  31  | 
  32  | async function openPickerViaN(page) {
  33  |   await press(page, 'n')
  34  |   await expect(fp(page)).toBeVisible()
  35  | }
  36  | 
  37  | async function waitForPath(page, expectedPath) {
  38  |   await expect(fp(page)).toHaveAttribute('data-current-path', expectedPath)
  39  | }
  40  | 
  41  | // ── Ouverture directe ─────────────────────────────────────────────────
  42  | 
  43  | test('n ouvre directement le FilePicker sans demander le titre', async ({ page }) => {
  44  |   await press(page, 'n')
  45  |   await expect(fp(page)).toBeVisible()
  46  |   await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
  47  | })
  48  | 
  49  | test('FilePicker liste les entrées du dossier courant', async ({ page }) => {
  50  |   await openPickerViaN(page)
  51  |   await expect(pane1(page).locator('.file-picker__entry')).toHaveCount(4)
  52  | })
  53  | 
  54  | test('entrées triées alphabétiquement (fichiers et dossiers mélangés)', async ({ page }) => {
  55  |   await openPickerViaN(page)
  56  |   const first = pane1(page).locator('.file-picker__entry').first()
  57  |   await expect(first).toHaveAttribute('data-type', 'file')
  58  |   await expect(first.locator('.file-picker__entry-name')).toContainText('notes.txt')
  59  | })
  60  | 
  61  | test('FilePicker sélectionne la première entrée par défaut', async ({ page }) => {
  62  |   await openPickerViaN(page)
  63  |   await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveCount(1)
  64  |   await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
  65  | })
  66  | 
  67  | // ── Flot de création de projet ─────────────────────────────────────────
  68  | 
  69  | test('Escape ne ferme pas le FilePicker en mode normal (interdit hors création dossier)', async ({ page }) => {
  70  |   await openPickerViaN(page)
  71  |   await press(page, 'Escape')
  72  |   await expect(fp(page)).toBeVisible()
  73  | })
  74  | 
  75  | test('sélectionner un dossier crée le projet directement (sans éditeur)', async ({ page }) => {
  76  |   const countBefore = await pane1(page).locator('.project-item').count()
  77  |   await openPickerViaN(page)
  78  |   await press(page, 'ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  79  |   await press(page, 'Enter')
  80  |   await expect(fp(page)).not.toBeVisible()
  81  |   await page.waitForLoadState('networkidle')
> 82  |   await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
      |                                                      ^ Error: expect(locator).toHaveCount(expected) failed
  83  |   await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
  84  | })
  85  | 
  86  | // ── Navigation clavier ────────────────────────────────────────────────
  87  | 
  88  | test('↓ déplace la sélection vers le bas', async ({ page }) => {
  89  |   await openPickerViaN(page)
  90  |   await press(page, 'ArrowDown')
  91  |   await expect(pane1(page).locator('.file-picker__entry').nth(1)).toHaveClass(/selected/)
  92  | })
  93  | 
  94  | test('↑ déplace la sélection vers le haut', async ({ page }) => {
  95  |   await openPickerViaN(page)
  96  |   await press(page, 'ArrowDown')
  97  |   await press(page, 'ArrowUp')
  98  |   await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
  99  | })
  100 | 
  101 | test('→ entre dans un dossier', async ({ page }) => {
  102 |   await openPickerViaN(page)
  103 |   await press(page, 'ArrowDown')  // Roman-Alpha
  104 |   await press(page, 'ArrowRight')
  105 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  106 | })
  107 | 
  108 | test('← remonte au niveau supérieur', async ({ page }) => {
  109 |   await openPickerViaN(page)
  110 |   await press(page, 'ArrowDown')
  111 |   await press(page, 'ArrowRight')
  112 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  113 |   await press(page, 'ArrowLeft')
  114 |   await waitForPath(page, TEST_DIR)
  115 | })
  116 | 
  117 | test('→ ne fait rien sur un fichier', async ({ page }) => {
  118 |   await openPickerViaN(page)
  119 |   await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  120 |   await press(page, 'ArrowRight')
  121 |   await waitForPath(page, TEST_DIR)
  122 | })
  123 | 
  124 | // ── Sélection ─────────────────────────────────────────────────────────
  125 | 
  126 | test('Enter sur un dossier ferme le picker', async ({ page }) => {
  127 |   await openPickerViaN(page)
  128 |   await press(page, 'ArrowDown')  // Roman-Alpha
  129 |   await press(page, 'Enter')
  130 |   await expect(fp(page)).not.toBeVisible()
  131 | })
  132 | 
  133 | // ── Création de dossier ───────────────────────────────────────────────
  134 | 
  135 | test('n dans le picker affiche un champ de saisie pour nouveau dossier', async ({ page }) => {
  136 |   await openPickerViaN(page)
  137 |   await press(page, 'n')
  138 |   await expect(pane1(page).locator('.file-picker__new-folder-input')).toBeVisible()
  139 | })
  140 | 
  141 | test('frappe réelle dans l\'input nouveau dossier (pas fill)', async ({ page }) => {
  142 |   await openPickerViaN(page)
  143 |   await press(page, 'n')
  144 |   const input = pane1(page).locator('.file-picker__new-folder-input')
  145 |   await expect(input).toBeVisible()
  146 |   await input.pressSequentially('MonDossier')
  147 |   await expect(input).toHaveValue('MonDossier')
  148 | })
  149 | 
  150 | test('n + nom + Enter crée le dossier et l\'ajoute à la liste', async ({ page }) => {
  151 |   await openPickerViaN(page)
  152 |   await press(page, 'ArrowDown')
  153 |   await press(page, 'ArrowRight')
  154 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  155 |   await press(page, 'n')
  156 |   await pane1(page).locator('.file-picker__new-folder-input').fill('Mon-Nouveau-Dossier')
  157 |   await press(page, 'Enter')
  158 |   await expect(pane1(page).locator('.file-picker__entry-name').filter({ hasText: 'Mon-Nouveau-Dossier' })).toBeVisible()
  159 |   expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Mon-Nouveau-Dossier'))).toBe(true)
  160 | })
  161 | 
  162 | test('Escape pendant création dossier annule sans créer', async ({ page }) => {
  163 |   await openPickerViaN(page)
  164 |   await press(page, 'ArrowDown')
  165 |   await press(page, 'ArrowRight')
  166 |   await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  167 |   await press(page, 'n')
  168 |   await pane1(page).locator('.file-picker__new-folder-input').fill('Dossier-Annule')
  169 |   await press(page, 'Escape')
  170 |   expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Dossier-Annule'))).toBe(false)
  171 |   await expect(fp(page)).toBeVisible()
  172 | })
  173 | 
  174 | // ── Tab cycle ─────────────────────────────────────────────────────────
  175 | 
  176 | test('Tab donne le focus au menu de chemin', async ({ page }) => {
  177 |   await openPickerViaN(page)
  178 |   await press(page, 'Tab')
  179 |   await expect(fp(page).locator('.file-picker__path')).toHaveClass(/file-picker__path--focused/)
  180 | })
  181 | 
  182 | test('Tab + Tab donne le focus au faux-bouton Annuler', async ({ page }) => {
```