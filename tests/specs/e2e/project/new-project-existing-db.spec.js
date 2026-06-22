// Origine : tests/specs/e2e/project/new-project-existing-db.spec.js
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { installFixtures } from '../../../helpers/install-fixtures.js'
import { test, expect, pane1 } from '../__setup__.js'

test.beforeEach(() => {
  installFixtures('many-projects')
})

async function setupFolderWithDb(page) {
  const workDir  = path.join(os.tmpdir(), `eventer-test-${Date.now()}`)
  const folder   = path.join(workDir, 'projet-existant')
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(path.join(folder, 'eventer.db'), '')

  await page.request.patch('/api/settings/last_path', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ value: workDir })
  })
  return { workDir, folder }
}

async function openPickerAndSelectFolder(page) {
  await expect(pane1(page).locator('#main-panel')).toHaveClass(/project-list/)
  await pane1(page).locator('#main-panel').press('n')
  await expect(pane1(page).locator('.file-picker')).toBeVisible()
  await expect(pane1(page).locator('.file-picker__entry-name', { hasText: 'projet-existant' })).toBeVisible()
  await pane1(page).locator('#main-panel').press('Enter')
}

// ── Dialog ────────────────────────────────────────────────────────────────────

test('choisir un dossier avec eventer.db → dialog de confirmation visible', async ({ page }) => {
  await setupFolderWithDb(page)
  await page.goto('/')
  await openPickerAndSelectFolder(page)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
})

test('dialog eventer.db existant → 3 boutons (Annuler, Non la détruire, Oui)', async ({ page }) => {
  await setupFolderWithDb(page)
  await page.goto('/')
  await openPickerAndSelectFolder(page)
  await expect(pane1(page).locator('.ftpanel-btn')).toHaveCount(3)
})

test('dialog eventer.db → Tab+Tab+Enter (Annuler) → aucun projet créé', async ({ page }) => {
  await setupFolderWithDb(page)
  await page.goto('/')
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerAndSelectFolder(page)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  await pane1(page).locator('.ftpanel.kpanel').press('Tab')   // 0 Importer → 1 Détruire
  await pane1(page).locator('.ftpanel.kpanel').press('Tab')   // 1 Détruire → 2 Annuler
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await expect(pane1(page).locator('.ftpanel.kpanel')).not.toBeVisible()
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore)
})

test('dialog eventer.db → Enter (Oui) importe le projet existant', async ({ page }) => {
  await setupFolderWithDb(page)
  await page.goto('/')
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerAndSelectFolder(page)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
})

test('dialog eventer.db → Tab+Enter (Détruire) crée un nouveau projet vide', async ({ page }) => {
  await setupFolderWithDb(page)
  await page.goto('/')
  const countBefore = await pane1(page).locator('.project-item').count()
  await openPickerAndSelectFolder(page)
  await expect(pane1(page).locator('.ftpanel.kpanel')).toBeVisible()
  await pane1(page).locator('.ftpanel.kpanel').press('Tab')   // 0 Importer → 1 Détruire
  await pane1(page).locator('.ftpanel.kpanel').press('Enter')
  await page.waitForLoadState('networkidle')
  await expect(pane1(page).locator('.project-item')).toHaveCount(countBefore + 1)
})
