// Refactorisé — nouvelle architecture (2026-06-20)
import { test, expect, pane1, press, getErr } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import path from 'path'
import fs from 'fs'
import os from 'os'

const TEST_DIR = path.join(os.tmpdir(), 'eventer_e2e_filepicker')
const fp = (page) => pane1(page).locator('.file-picker')

test.beforeAll(() => {
  fs.mkdirSync(path.join(TEST_DIR, 'Roman-Alpha'), { recursive: true })
  fs.mkdirSync(path.join(TEST_DIR, 'Roman-Beta'),  { recursive: true })
  fs.mkdirSync(path.join(TEST_DIR, 'Roman-Gamma'), { recursive: true })
  fs.writeFileSync(path.join(TEST_DIR, 'notes.txt'), '')
})

test.afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true })
})

test.beforeEach(async ({ page }) => {
  installFixtures('many-projects')
  await page.request.patch('/api/settings/last_path', {
    data: JSON.stringify({ value: TEST_DIR }),
    headers: { 'Content-Type': 'application/json' }
  })
  await page.goto('/')
  await expect(pane1(page).locator('#projects-panel')).toBeVisible()
})

async function openPickerViaN(page) {
  await press(page, 'n')
  await expect(fp(page)).toBeVisible()
}

async function waitForPath(page, expectedPath) {
  await expect(fp(page)).toHaveAttribute('data-current-path', expectedPath)
}

// ── Ouverture directe ─────────────────────────────────────────────────

test('n ouvre directement le FilePicker sans demander le titre', async ({ page }) => {
  await press(page, 'n')
  await expect(fp(page)).toBeVisible()
  await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
})

test('FilePicker liste les entrées du dossier courant', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__entry')).toHaveCount(4)
})

test('entrées triées alphabétiquement (fichiers et dossiers mélangés)', async ({ page }) => {
  await openPickerViaN(page)
  const first = pane1(page).locator('.file-picker__entry').first()
  await expect(first).toHaveAttribute('data-type', 'file')
  await expect(first.locator('.file-picker__entry-name')).toContainText('notes.txt')
})

test('FilePicker sélectionne la première entrée par défaut', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveCount(1)
  await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
})

// ── Flot de création de projet ─────────────────────────────────────────

test('Escape ne ferme pas le FilePicker en mode normal (interdit hors création dossier)', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'Escape')
  await expect(fp(page)).toBeVisible()
})

test('sélectionner un dossier crée le projet directement (sans éditeur)', async ({ page }) => {
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerViaN(page)
  await press(page, 'ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  await press(page, 'Enter')
  await expect(fp(page)).not.toBeVisible()
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
})

// ── Navigation clavier ────────────────────────────────────────────────

test('↓ déplace la sélection vers le bas', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.file-picker__entry').nth(1)).toHaveClass(/selected/)
})

test('↑ déplace la sélection vers le haut', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowUp')
  await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
})

test('→ entre dans un dossier', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')  // Roman-Alpha
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
})

test('← remonte au niveau supérieur', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'ArrowLeft')
  await waitForPath(page, TEST_DIR)
})

test('→ ne fait rien sur un fichier', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  await press(page, 'ArrowRight')
  await waitForPath(page, TEST_DIR)
})

// ── Sélection ─────────────────────────────────────────────────────────

test('Enter sur un dossier ferme le picker', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')  // Roman-Alpha
  await press(page, 'Enter')
  await expect(fp(page)).not.toBeVisible()
})

// ── Création de dossier ───────────────────────────────────────────────

test('n dans le picker affiche un champ de saisie pour nouveau dossier', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'n')
  await expect(pane1(page).locator('.file-picker__new-folder-input')).toBeVisible()
})

test('frappe réelle dans l\'input nouveau dossier (pas fill)', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'n')
  const input = pane1(page).locator('.file-picker__new-folder-input')
  await expect(input).toBeVisible()
  await input.pressSequentially('MonDossier')
  await expect(input).toHaveValue('MonDossier')
})

test('n + nom + Enter crée le dossier et l\'ajoute à la liste', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'n')
  await pane1(page).locator('.file-picker__new-folder-input').fill('Mon-Nouveau-Dossier')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.file-picker__entry-name').filter({ hasText: 'Mon-Nouveau-Dossier' })).toBeVisible()
  expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Mon-Nouveau-Dossier'))).toBe(true)
})

test('Escape pendant création dossier annule sans créer', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'n')
  await pane1(page).locator('.file-picker__new-folder-input').fill('Dossier-Annule')
  await press(page, 'Escape')
  expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Dossier-Annule'))).toBe(false)
  await expect(fp(page)).toBeVisible()
})

// ── Tab cycle ─────────────────────────────────────────────────────────

test('Tab donne le focus au menu de chemin', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'Tab')
  await expect(fp(page).locator('.file-picker__path')).toHaveClass(/file-picker__path--focused/)
})

test('Tab + Tab donne le focus au faux-bouton Annuler', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'Tab')
  await press(page, 'Tab')
  await expect(fp(page).locator('.ftpanel-btn').filter({ hasText: 'Annuler' })).toHaveClass(/ftpanel-btn--focused/)
})

test('Tab + Tab + Tab revient en mode liste (aucun bouton focusé)', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Tab')
  await expect(fp(page).locator('.ftpanel-btn--focused')).toHaveCount(0)
})

// ── Faux-bouton Fermer ────────────────────────────────────────────────

test('footer a un faux-bouton "Annuler"', async ({ page }) => {
  await openPickerViaN(page)
  await expect(fp(page).locator('.ftpanel-btn').filter({ hasText: 'Annuler' })).toBeVisible()
})

test('Tab + Tab + Enter sur Annuler ferme le FilePicker sans créer de projet', async ({ page }) => {
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerViaN(page)
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Enter')
  await expect(fp(page)).not.toBeVisible()
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
})

test('fermeture via Fermer restaure le focus sur l\'élément appelant', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'Tab')
  await press(page, 'Tab')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.project-item.selected')).toBeFocused()
})

// ── Bouton de chemin (path-btn) → PopupSelect ancêtres ───────────────

test('FilePicker a un menu de chemin au-dessus de la liste', async ({ page }) => {
  await openPickerViaN(page)
  await expect(fp(page).locator('.file-picker__path')).toBeVisible()
})

test('le menu de chemin affiche le nom du dossier courant', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await expect(fp(page).locator('.file-picker__path')).toContainText('Roman-Alpha')
})

test('Tab + ArrowDown ouvre le popup des ancêtres (comme Enter)', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'Tab')
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test('chemin focusé : ArrowLeft ne remonte pas au dossier parent', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'Tab')
  await press(page, 'ArrowLeft')
  await page.waitForTimeout(400)  // laisse _goUp() se terminer si déclenché
  await expect(fp(page)).toHaveAttribute('data-current-path', path.join(TEST_DIR, 'Roman-Alpha'))
})

test('Tab + Enter sur le bouton de chemin ouvre un PopupSelect des ancêtres', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'Tab')
  await press(page, 'Enter')
  await expect(pane1(page).locator('.popup-select')).toBeVisible()
})

test('le PopupSelect contient le dossier courant et ses parents', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')
  await press(page, 'ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await press(page, 'Tab')
  await press(page, 'Enter')
  const items = pane1(page).locator('.popup-select__option')
  await expect(items.first()).toContainText('Roman-Alpha')
  await expect(items.nth(1)).toContainText(path.basename(TEST_DIR))
})

// ── Bouton "Choisir" (au-dessus de la liste) ──────────────────────────

test('bouton de sélection dit "Choisir" (pas "↩︎")', async ({ page }) => {
  await openPickerViaN(page)
  await press(page, 'ArrowDown')  // sur un dossier
  await expect(fp(page).locator('.file-picker__select-btn')).toContainText('Choisir')
  await expect(fp(page).locator('.file-picker__select-btn')).not.toContainText('↩︎')
})

test('bouton sélection désactivé sur fichier, actif sur dossier', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  await expect(pane1(page).locator('.file-picker__select-btn')).toHaveClass(/disabled/)
  await press(page, 'ArrowDown')
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'directory')
  await expect(pane1(page).locator('.file-picker__select-btn')).not.toHaveClass(/disabled/)
})
