import { test, expect, pane1 } from '../__setup__.js'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import path from 'path'
import fs from 'fs'
import os from 'os'

const TEST_DIR = path.join(os.tmpdir(), 'eventer_e2e_filepicker')

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
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
})

// Helper : ouvre le picker via 'n' (nouveau comportement direct)
async function openPickerViaN(page) {
  await pane1(page).locator('body').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
}

// Helper : attend que le picker soit positionné sur le chemin donné
async function waitForPath(page, expectedPath) {
  await expect(pane1(page).locator('.file-picker')).toHaveAttribute('data-current-path', expectedPath)
}

// ── Ouverture directe ─────────────────────────────────────────────────

test('n ouvre directement le FilePicker sans demander le titre', async ({ page }) => {
  await pane1(page).locator('body').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  // Aucun champ titre n'apparaît AVANT la sélection du dossier
  await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
})

test('FilePicker liste les entrées du dossier courant', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__entry')).toHaveCount(4)
})

test('entrées triées alphabétiquement (fichiers et dossiers mélangés)', async ({ page }) => {
  await openPickerViaN(page)
  // Tri alphabétique pur (sans dossiers en premier) :
  // notes.txt (n) avant Roman-Alpha (r)
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

test('Escape annule sans créer de projet', async ({ page }) => {
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerViaN(page)
  await pane1(page).locator('body').press('Escape')
  await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
})

test('sélectionner un dossier crée le projet directement (sans éditeur)', async ({ page }) => {
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  await pane1(page).locator('body').press('Enter')       // sélectionne → projet créé directement
  await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
  await page.waitForLoadState('networkidle')
  // Projet créé, pas d'éditeur visible
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
  await expect(pane1(page).locator('.project-item.selected input[name="title"]')).not.toBeVisible()
})

// ── Navigation clavier ────────────────────────────────────────────────

test('↓ déplace la sélection vers le bas', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1(page).locator('.file-picker__entry').nth(1)).toHaveClass(/selected/)
})

test('↑ déplace la sélection vers le haut', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowUp')
  await expect(pane1(page).locator('.file-picker__entry').first()).toHaveClass(/selected/)
})

test('→ entre dans un dossier', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')  // Roman-Alpha (2ème, après notes.txt)
  await pane1(page).locator('body').press('ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
})

test('← remonte au niveau supérieur', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await pane1(page).locator('body').press('ArrowLeft')
  await waitForPath(page, TEST_DIR)
})

test('→ ne fait rien sur un fichier', async ({ page }) => {
  await openPickerViaN(page)
  // Première entrée = notes.txt (fichier) : déjà sélectionné
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  await pane1(page).locator('body').press('ArrowRight')
  // Path ne change pas
  await waitForPath(page, TEST_DIR)
})

// ── Sélection ─────────────────────────────────────────────────────────

test('Enter sur un dossier ferme le picker', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')  // Roman-Alpha
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.file-picker')).not.toBeVisible()
})

// ── Création de dossier ───────────────────────────────────────────────

test('n dans le picker affiche un champ de saisie pour nouveau dossier', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('n')
  await expect(pane1(page).locator('.file-picker__new-folder-input')).toBeVisible()
})

test('n + nom + Enter crée le dossier et l\'ajoute à la liste', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')   // Roman-Alpha
  await pane1(page).locator('body').press('ArrowRight')  // entre dans Roman-Alpha
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await pane1(page).locator('body').press('n')
  await pane1(page).locator('.file-picker__new-folder-input').fill('Mon-Nouveau-Dossier')
  await pane1(page).locator('body').press('Enter')
  await expect(pane1(page).locator('.file-picker__entry-name').filter({ hasText: 'Mon-Nouveau-Dossier' })).toBeVisible()
  expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Mon-Nouveau-Dossier'))).toBe(true)
})

test('Escape pendant création dossier annule sans créer', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')   // Roman-Alpha
  await pane1(page).locator('body').press('ArrowRight')  // entre dans Roman-Alpha
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await pane1(page).locator('body').press('n')
  await pane1(page).locator('.file-picker__new-folder-input').fill('Dossier-Annule')
  await pane1(page).locator('body').press('Escape')
  expect(fs.existsSync(path.join(TEST_DIR, 'Roman-Alpha', 'Dossier-Annule'))).toBe(false)
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
})

// ── Menu arborescence (Tab) ───────────────────────────────────────────

test('Tab affiche le menu d\'arborescence des dossiers parents', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await pane1(page).locator('body').press('Tab')
  await expect(pane1(page).locator('.file-picker__path-menu')).toBeVisible()
})

test('le menu arborescence contient le dossier courant et ses parents', async ({ page }) => {
  await openPickerViaN(page)
  await pane1(page).locator('body').press('ArrowDown')
  await pane1(page).locator('body').press('ArrowRight')
  await waitForPath(page, path.join(TEST_DIR, 'Roman-Alpha'))
  await pane1(page).locator('body').press('Tab')
  const items = pane1(page).locator('.file-picker__path-menu-item')
  await expect(items.first()).toContainText('Roman-Alpha')
  await expect(items.nth(1)).toContainText(path.basename(TEST_DIR))
})

// ── Footer ────────────────────────────────────────────────────────────

test('Footer affiche ↩︎ (droite) et ␛ (gauche)', async ({ page }) => {
  await openPickerViaN(page)
  await expect(pane1(page).locator('.file-picker__select-btn')).toContainText('↩︎')
  await expect(pane1(page).locator('.file-picker__cancel-key')).toContainText('␛')
})

test('bouton sélection désactivé sur fichier, actif sur dossier', async ({ page }) => {
  await openPickerViaN(page)
  // Première entrée = notes.txt (fichier) → bouton désactivé
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'file')
  await expect(pane1(page).locator('.file-picker__select-btn')).toHaveClass(/disabled/)
  // Naviguer sur Roman-Alpha (dossier) → bouton actif
  await pane1(page).locator('body').press('ArrowDown')
  await expect(pane1(page).locator('.file-picker__entry.selected')).toHaveAttribute('data-type', 'directory')
  await expect(pane1(page).locator('.file-picker__select-btn')).not.toHaveClass(/disabled/)
})
